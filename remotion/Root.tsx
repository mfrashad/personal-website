import React from 'react';
import { Still, Composition } from 'remotion';
import { CarouselHookSlide } from './compositions/CarouselHookSlide';
import { CarouselItemSlide } from './compositions/CarouselItemSlide';
import { VideoComposition } from './compositions/VideoComposition';
import { CAROUSEL, VIDEO, getVideoDuration } from './lib/theme';
import type { CarouselHookSlideProps, CarouselItemSlideProps, VideoReelProps } from './lib/types';

const defaultHookProps: CarouselHookSlideProps = {
    backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1350&fit=crop',
    hookText: 'Top 10 Tools Every Startup Needs',
    subtitle: 'Curated list of the best resources',
    brandName: '@rashad',
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
    brandName: '@rashad',
};

const defaultVideoProps: VideoReelProps = {
    backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=1920&fit=crop',
    hookText: 'Top Tools Every Startup Needs',
    subtitle: 'Curated by Rashad',
    brandName: '@rashad',
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
