import posthog from 'posthog-js';

const isBrowser = typeof window !== 'undefined';

export function capture(event: string, properties?: Record<string, any>) {
    if (isBrowser) {
        posthog.capture(event, properties);
    }
}

export function identify(email: string, properties?: Record<string, any>) {
    if (isBrowser && email) {
        posthog.identify(email, properties);
    }
}
