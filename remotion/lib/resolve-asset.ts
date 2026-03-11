import { staticFile } from 'remotion';

/**
 * Resolve an asset path for use in Remotion compositions.
 * - HTTP(S) URLs and data URIs pass through unchanged.
 * - Relative paths (e.g. `/resource-images/favicons/x.png`) are resolved
 *   via Remotion's `staticFile()` so they work both in the Studio preview
 *   and during headless renders from a webpack bundle.
 */
export function resolveAsset(path: string | undefined): string {
    if (!path) return '';
    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('data:') ||
        path.startsWith('blob:')
    ) {
        return path;
    }
    // staticFile expects a path without leading slash
    const relativePath = path.startsWith('/') ? path.slice(1) : path;
    // staticFile() encodes each path segment via encodeURIComponent, which
    // converts @ to %40. This breaks serving because the actual filenames
    // contain literal @ characters (e.g. youtube-com-@ycombinator.png).
    // Decode %40 back to @ since it's a valid URL character.
    return staticFile(relativePath).replace(/%40/g, '@');
}
