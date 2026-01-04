/**
 * MDX Components Index
 * Central export point for all custom MDX components
 * Import in MDX files with: import { ComponentName } from '@mdx/index';
 */

// Core Components
export { default as GrowthStageIndicator } from './GrowthStageIndicator.astro';
export { default as AssumedAudience } from './AssumedAudience.astro';
export { default as Alert } from './Alert.astro';
export { default as ComingSoon } from './ComingSoon.astro';
export { default as Footnote } from './Footnote.astro';
export { default as Spacer } from './Spacer.astro';
export { default as BlockquoteAttribution } from './BlockquoteAttribution.astro';
export { default as References } from './References.astro';

// Interactive Components (React)
export { TooltipLink } from './TooltipLink';
export { Accordion } from './Accordion';

// Layout Components
export { default as TwoColumn } from './TwoColumn.astro';
export { default as Center } from './Center.astro';

// Content Components
export { default as ImageCaption } from './ImageCaption.astro';
export { default as Highlight } from './Highlight.astro';
export { default as Sidenote } from './Sidenote.astro';
export { default as Draft } from './Draft.astro';
export { default as Callout } from './Callout.astro';
