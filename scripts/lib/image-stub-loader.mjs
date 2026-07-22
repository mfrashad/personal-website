// Node module-loader hooks that stub out image imports so data modules
// like src/content/projects.ts (which import .png/.jpg assets as Astro
// ImageMetadata) can be loaded by tsx in a plain Node context.
const IMAGE_RE = /\.(png|jpe?g|webp|svg|gif|avif)$/i;

export function resolve(specifier, context, nextResolve) {
    if (IMAGE_RE.test(specifier)) {
        return { url: `image-stub:${specifier}`, shortCircuit: true };
    }
    return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
    if (url.startsWith('image-stub:')) {
        return {
            format: 'module',
            source: "export default { src: '', width: 0, height: 0, format: 'png' };",
            shortCircuit: true,
        };
    }
    return nextLoad(url, context);
}
