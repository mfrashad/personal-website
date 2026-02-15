import React from 'react';
import { Still, Composition } from 'remotion';
import { CarouselHookSlide } from './compositions/CarouselHookSlide';
import { CarouselItemSlide } from './compositions/CarouselItemSlide';
import { CarouselCtaSlide } from './compositions/CarouselCtaSlide';
import { CarouselMockupSlide } from './compositions/CarouselMockupSlide';
import { VideoComposition } from './compositions/VideoComposition';
import { CAROUSEL, VIDEO, getVideoDuration } from './lib/theme';
import { getDefaultMockupSlideLayout } from './lib/default-layouts';
import type { CarouselHookSlideProps, CarouselItemSlideProps, CarouselMockupSlideProps, CarouselCtaSlideProps, VideoReelProps } from './lib/types';

const defaultHookProps: CarouselHookSlideProps = {
    backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1350&fit=crop',
    hookText: 'Top 10 Tools Every Startup Needs',
    brandName: '@rashadcodes',
};

const defaultItemProps: CarouselItemSlideProps = {
    backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1350&fit=crop',
    item: {
        name: 'Example Tool',
        description: 'A great tool for building products faster.',
        tags: ['productivity', 'saas'],
    },
    slideNumber: 1,
    totalSlides: 10,
    brandName: '@rashadcodes',
};

const defaultMockupProps: CarouselMockupSlideProps = {
    item: {
        name: 'Example Tool',
        description: 'A great tool for building products faster.',
        tags: ['productivity', 'saas'],
    },
    mockupImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1350&fit=crop',
    slideNumber: 1,
    totalSlides: 10,
    brandName: '@rashadcodes',
    layout: getDefaultMockupSlideLayout(),
};

const defaultCtaProps: CarouselCtaSlideProps = {
    backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1350&fit=crop',
    ctaText: 'Comment links to get all links sent to you',
    brandName: '@rashadcodes',
};

const defaultVideoProps: VideoReelProps = {
    backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1920&fit=crop',
    hookText: 'Top Tools Every Startup Needs',
    brandName: '@rashadcodes',
    items: [
        {
            item: { name: 'Tool One', description: 'First tool description.', tags: ['productivity'] },
        },
        {
            item: { name: 'Tool Two', description: 'Second tool description.', tags: ['design'] },
        },
        {
            item: { name: 'Tool Three', description: 'Third tool description.', tags: ['development'] },
        },
    ],
};

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Still
                id="CarouselHookSlide"
                component={CarouselHookSlide}
                width={CAROUSEL.width}
                height={CAROUSEL.height}
                defaultProps={defaultHookProps}
            />
            <Still
                id="CarouselItemSlide"
                component={CarouselItemSlide}
                width={CAROUSEL.width}
                height={CAROUSEL.height}
                defaultProps={defaultItemProps}
            />
            <Still
                id="CarouselMockupSlide"
                component={CarouselMockupSlide}
                width={CAROUSEL.width}
                height={CAROUSEL.height}
                defaultProps={defaultMockupProps}
            />
            <Still
                id="CarouselCtaSlide"
                component={CarouselCtaSlide}
                width={CAROUSEL.width}
                height={CAROUSEL.height}
                defaultProps={defaultCtaProps}
            />
            <Composition
                id="VideoReel"
                component={VideoComposition}
                width={VIDEO.width}
                height={VIDEO.height}
                fps={VIDEO.fps}
                durationInFrames={getVideoDuration(defaultVideoProps.items.length)}
                defaultProps={defaultVideoProps}
                calculateMetadata={async ({ props }) => {
                    return {
                        durationInFrames: getVideoDuration(props.items.length),
                    };
                }}
            />
        </>
    );
};
