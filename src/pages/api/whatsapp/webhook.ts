import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

export const prerender = false;

// Read at request time, not module scope: Vite inlines `import.meta.env` at build
// time, and these are runtime secrets managed in the Vercel dashboard.
const readEnv = (name: string): string | undefined => process.env[name];

/**
 * Meta verifies a webhook endpoint by issuing a GET with hub.* query params.
 * Echo hub.challenge back as plain text when the token matches, otherwise 403.
 * This runs once when the callback URL is set, and again on any manual re-verify.
 */
export const GET: APIRoute = async ({ url }) => {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    const VERIFY_TOKEN = readEnv('WHATSAPP_VERIFY_TOKEN');

    if (!VERIFY_TOKEN) {
        console.error('[whatsapp] WHATSAPP_VERIFY_TOKEN is not set — cannot verify webhook');
        return new Response('Verify token not configured', { status: 500 });
    }

    if (mode === 'subscribe' && token && challenge && safeEquals(token, VERIFY_TOKEN)) {
        console.log('[whatsapp] Webhook verification succeeded');
        return new Response(challenge, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
        });
    }

    console.warn('[whatsapp] Webhook verification failed (mode=%s)', mode);
    return new Response('Forbidden', { status: 403 });
};

/**
 * Inbound events. Meta retries on any non-2xx and treats slow responses as
 * failures, so acknowledge first and keep the handler cheap.
 */
export const POST: APIRoute = async ({ request }) => {
    // The signature covers the raw bytes, so read text before parsing.
    const raw = await request.text();
    const signature = request.headers.get('x-hub-signature-256');
    const APP_SECRET = readEnv('WHATSAPP_APP_SECRET');

    let signatureVerified = false;
    if (APP_SECRET) {
        if (!verifySignature(raw, signature, APP_SECRET)) {
            console.warn('[whatsapp] Rejected payload with invalid X-Hub-Signature-256');
            return new Response('Invalid signature', { status: 401 });
        }
        signatureVerified = true;
    } else {
        console.warn(
            '[whatsapp] WHATSAPP_APP_SECRET is not set — accepting payload UNVERIFIED. ' +
            'Anyone who knows this URL can post forged events. Set the secret before ' +
            'anything acts on this data.'
        );
    }

    let payload: any;
    try {
        payload = JSON.parse(raw);
    } catch {
        // Malformed body: 200 anyway, since retrying will not help.
        console.error('[whatsapp] Could not parse webhook body as JSON');
        return new Response('OK', { status: 200 });
    }

    try {
        logEvents(payload, signatureVerified);
    } catch (error) {
        console.error('[whatsapp] Failed while handling webhook payload:', error);
    }

    return new Response('OK', { status: 200 });
};

/**
 * WhatsApp payloads nest as entry[] → changes[] → value, where `value` holds
 * either inbound `messages` or delivery `statuses`.
 */
function logEvents(payload: any, signatureVerified: boolean): void {
    for (const entry of payload?.entry ?? []) {
        for (const change of entry?.changes ?? []) {
            const value = change?.value ?? {};
            const phoneNumberId = value?.metadata?.phone_number_id;

            for (const message of value.messages ?? []) {
                console.log('[whatsapp] message %j', {
                    signatureVerified,
                    phoneNumberId,
                    from: message.from,
                    id: message.id,
                    type: message.type,
                    timestamp: message.timestamp,
                    text: message.text?.body,
                });
            }

            for (const status of value.statuses ?? []) {
                console.log('[whatsapp] status %j', {
                    id: status.id,
                    recipient: status.recipient_id,
                    status: status.status,
                    timestamp: status.timestamp,
                });
            }
        }
    }
}

function verifySignature(raw: string, signature: string | null, secret: string): boolean {
    if (!signature?.startsWith('sha256=')) return false;
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('hex');
    return safeEquals(signature, expected);
}

function safeEquals(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    // timingSafeEqual throws on length mismatch, so guard first.
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}
