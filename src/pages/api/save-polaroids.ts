import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    // Only allow in development
    if (import.meta.env.PROD) {
        return new Response(JSON.stringify({ error: 'Not allowed in production' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const positions = await request.json();
        console.log('Received polaroid positions:', JSON.stringify(positions, null, 2));

        // Read the current file
        const filePath = path.join(process.cwd(), 'src/components/ScatteredPolaroids.tsx');
        let content = fs.readFileSync(filePath, 'utf-8');

        // Find the polaroidsConfig array and replace it
        const configStartMarker = 'const polaroidsConfig: PolaroidData[] = [';
        const configStart = content.indexOf(configStartMarker);

        if (configStart === -1) {
            console.error('Could not find polaroidsConfig start');
            return new Response(JSON.stringify({ error: 'Could not find polaroidsConfig in file' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Find the matching closing bracket - start from after the opening bracket
        const arrayStart = configStart + configStartMarker.length;
        let bracketCount = 1; // We already have the opening bracket
        let configEnd = -1;

        for (let i = arrayStart; i < content.length; i++) {
            if (content[i] === '[') bracketCount++;
            if (content[i] === ']') {
                bracketCount--;
                if (bracketCount === 0) {
                    // Look for the semicolon after the closing bracket
                    let j = i + 1;
                    while (j < content.length && /\s/.test(content[j])) j++;
                    if (content[j] === ';') {
                        configEnd = j + 1;
                    } else {
                        configEnd = i + 1;
                    }
                    break;
                }
            }
        }

        if (configEnd === -1) {
            console.error('Could not find polaroidsConfig end');
            return new Response(JSON.stringify({ error: 'Could not find end of polaroidsConfig' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Build new config array
        const newConfig = `const polaroidsConfig: PolaroidData[] = [
${positions.map((pos: any) => `    {
        src: ${pos.srcVar},
        srcVar: '${pos.srcVar}',
        alt: '${pos.alt}',
        caption: '${pos.caption.replace(/'/g, "\\'")}',
        initialX: ${pos.initialX},
        initialY: ${pos.initialY},
        rotation: ${pos.rotation},
        zIndex: ${pos.zIndex},
        enabled: ${pos.enabled}
    }`).join(',\n')}
];`;

        // Replace the config
        content = content.substring(0, configStart) + newConfig + content.substring(configEnd);

        // Write back to file
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Successfully saved polaroids config');

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error saving polaroids:', error);
        return new Response(JSON.stringify({ error: String(error), message: error instanceof Error ? error.message : 'Unknown error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
