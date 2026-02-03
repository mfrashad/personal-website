import { useEffect, useState, useRef } from 'react';
import { useCleveWritings, type CleveWriting, slugify, formatDate } from '@/hooks/useCleveWritings';
import { ArrowRight, Sparkle, ArrowClockwise } from '@phosphor-icons/react';
import { NEW_WRITINGS_EVENT, type NewWritingsEventDetail } from './ContributionGraph';

interface WritingsUpdaterProps {
    initialWritings: CleveWriting[];
    onNewWritings?: (writings: CleveWriting[]) => void;
}

export default function WritingsUpdater({ initialWritings, onNewWritings }: WritingsUpdaterProps) {
    const {
        newWritings,
        updatedWritings,
        isRevalidating,
        lastFetched,
        revalidate
    } = useCleveWritings({
        initialWritings,
        revalidateOnMount: true
    });

    const [showBanner, setShowBanner] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const insertedRef = useRef(false);

    // Show banner when new writings are detected
    useEffect(() => {
        if (newWritings.length > 0 && !dismissed) {
            setShowBanner(true);
            onNewWritings?.(newWritings);

            // Auto-insert new posts into the DOM
            if (!insertedRef.current) {
                insertedRef.current = true;

                // Insert into blog page (year containers)
                insertNewPosts(newWritings);

                // Insert into homepage (compact list)
                insertHomepagePosts(newWritings);

                // Dispatch event to update ContributionGraph
                const postsForGraph = newWritings.map(w => ({
                    date: new Date(w.created_at),
                    title: w.title
                }));
                const event = new CustomEvent<NewWritingsEventDetail>(NEW_WRITINGS_EVENT, {
                    detail: { posts: postsForGraph }
                });
                window.dispatchEvent(event);
            }
        }
    }, [newWritings, dismissed, onNewWritings]);

    // Auto-close banner after 5 seconds
    useEffect(() => {
        if (showBanner) {
            const timer = setTimeout(() => {
                setShowBanner(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showBanner]);

    const handleDismiss = () => {
        setDismissed(true);
        setShowBanner(false);
    };

    // Insert new posts into the homepage compact list
    const insertHomepagePosts = (posts: CleveWriting[]) => {
        const homepageContainer = document.querySelector('[data-homepage-posts]');
        if (!homepageContainer) return;

        const maxPosts = 6; // Maximum number of posts to display

        posts.forEach(post => {
            const postElement = createCompactPostElement(post, true);
            // Insert at the beginning (newest first)
            homepageContainer.insertBefore(postElement, homepageContainer.firstChild);

            // Trigger animation
            requestAnimationFrame(() => {
                postElement.classList.remove('opacity-0', 'translate-y-2');
            });
        });

        // Remove oldest posts to maintain max limit
        const allPosts = homepageContainer.children;
        while (allPosts.length > maxPosts) {
            homepageContainer.removeChild(allPosts[allPosts.length - 1]);
        }
    };

    // Create a compact post element for the homepage
    const createCompactPostElement = (post: CleveWriting, isNew: boolean): HTMLElement => {
        const div = document.createElement('div');
        div.className = 'list-item-image-hover-effect group relative flex flex-col justify-between gap-3 border-b border-neutral-300 py-3 md:py-4 md:flex-row md:gap-12 transition-all duration-500 opacity-0 translate-y-2';
        div.setAttribute('data-new-post', 'true');

        const slug = slugify(post.title);
        const date = new Date(post.created_at);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const formattedDate = `${month}/${day}`;

        div.innerHTML = `
            <div class="flex items-start justify-between gap-6 md:gap-10 md:items-center flex-1">
                <div class="flex items-start gap-3 md:gap-6 flex-1 min-w-0">
                    <div class="font-mono text-neutral-500 text-xs md:text-sm shrink-0 min-w-[40px] md:min-w-[100px]">
                        ${formattedDate}
                    </div>
                    <p class="text-sm md:text-base flex flex-col min-w-0 flex-1">
                        <span class="font-bold truncate flex items-center gap-2">
                            <span class="truncate">${post.title}</span>
                            ${isNew ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full animate-pulse shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256"><path d="M208,144a15.78,15.78,0,0,1-10.42,14.94L146,178l-19.05,51.62a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88L78,110l19-51.62a15.92,15.92,0,0,1,29.88,0L146,110l51.62,19A15.78,15.78,0,0,1,208,144Z"/></svg>New</span>' : ''}
                        </span>
                    </p>
                </div>
                <div class="flex items-center gap-2 md:gap-6">
                    <div class="text-neutral-400 text-sm md:text-base">
                        <div class="flex items-center gap-1 md:gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM32,192V64H224V192Z"/></svg>
                            <span class="hidden md:inline">Articles</span>
                        </div>
                    </div>
                    <div class="hidden md:block">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>
                    </div>
                </div>
            </div>
            <a href="/blog/${slug}" class="absolute bottom-0 left-0 right-0 top-0 h-full w-full">
                <span class="sr-only">Read post</span>
            </a>
        `;

        return div;
    };

    // Insert new posts into the existing DOM structure (blog page with year containers)
    const insertNewPosts = (posts: CleveWriting[]) => {
        posts.forEach(post => {
            const postYear = new Date(post.created_at).getFullYear();
            const yearContainer = document.querySelector(`[data-year="${postYear}"]`);

            if (yearContainer) {
                const postsContainer = yearContainer.querySelector('[data-posts-container]');
                if (postsContainer) {
                    // Insert at the correct position based on date
                    const postElement = createPostElement(post, true);
                    const existingPosts = postsContainer.querySelectorAll('[data-post-date]');
                    const postDate = new Date(post.created_at).getTime();

                    let inserted = false;
                    for (const existing of existingPosts) {
                        const existingDate = parseInt(existing.getAttribute('data-post-date') || '0');
                        if (postDate > existingDate) {
                            postsContainer.insertBefore(postElement, existing);
                            inserted = true;
                            break;
                        }
                    }

                    if (!inserted) {
                        postsContainer.appendChild(postElement);
                    }

                    // Trigger animation
                    requestAnimationFrame(() => {
                        postElement.classList.remove('opacity-0', 'translate-y-2');
                    });
                }
            }
        });
    };

    // Create a post element that matches the BlogPostItem structure
    const createPostElement = (post: CleveWriting, isNew: boolean): HTMLElement => {
        const div = document.createElement('div');
        div.className = 'list-item-image-hover-effect group relative flex flex-col justify-between gap-3 border-b border-neutral-300 py-3 md:flex-row md:gap-8 md:py-4 transition-all duration-500 opacity-0 translate-y-2';
        div.setAttribute('data-post-date', new Date(post.created_at).getTime().toString());
        div.setAttribute('data-new-post', 'true');

        const slug = slugify(post.title);
        const formattedDate = formatDate(post.created_at);
        const excerpt = post.content_markdown.substring(0, 200).replace(/[#*\n]/g, ' ').trim();

        div.innerHTML = `
            <div class="flex items-start justify-between gap-10 md:items-center">
                <div class="hidden font-mono md:block shrink-0">
                    ${formattedDate}
                </div>
                <p class="text-base flex flex-col">
                    <span class="font-bold flex items-center gap-2">
                        ${post.title}
                        ${isNew ? '<span class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256"><path d="M208,144a15.78,15.78,0,0,1-10.42,14.94L146,178l-19.05,51.62a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88L78,110l19-51.62a15.92,15.92,0,0,1,29.88,0L146,110l51.62,19A15.78,15.78,0,0,1,208,144Z"/></svg>New</span>' : ''}
                    </span>
                </p>
                <div class="mt-1 md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69l-58.35-58.34a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>
                </div>
            </div>
            <div class="flex items-center gap-3 md:gap-6">
                <div class="font-mono text-neutral-400 md:hidden">${formattedDate}</div>
                <div class="font-mono text-neutral-400 md:hidden">|</div>
                <div class="text-neutral-400">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM32,192V64H224V192Z"/></svg>
                        <span>Articles</span>
                    </div>
                </div>
                <div class="hidden md:block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69l-58.35-58.34a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/></svg>
                </div>
            </div>
            <a href="/blog/${slug}" class="absolute bottom-0 left-0 right-0 top-0 h-full w-full">
                <span class="sr-only">Read post</span>
            </a>
        `;

        return div;
    };

    if (!showBanner && newWritings.length === 0) {
        // Show subtle revalidation indicator
        return (
            <div className="flex items-center gap-2 text-xs text-neutral-400">
                {isRevalidating ? (
                    <>
                        <ArrowClockwise className="animate-spin" size={14} />
                        <span>Checking for updates...</span>
                    </>
                ) : lastFetched ? (
                    <span className="opacity-50">Live updates enabled</span>
                ) : null}
            </div>
        );
    }

    return (
        <>
            {/* New writings notification banner */}
            {showBanner && (
                <div className="fixed bottom-4 right-4 z-[9999] max-w-sm animate-slide-up">
                    <div className="bg-white border border-neutral-200 rounded-lg shadow-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <Sparkle className="text-amber-500" size={24} weight="fill" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900">
                                    {newWritings.length} new {newWritings.length === 1 ? 'writing' : 'writings'} found!
                                </p>
                                <p className="text-xs text-neutral-500 mt-1">
                                    {newWritings.slice(0, 5).map(w => w.title).join(', ')}
                                    {newWritings.length > 5 && ` and ${newWritings.length - 5} more...`}
                                </p>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="flex-shrink-0 text-neutral-400 hover:text-neutral-600"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <div className="mt-3 text-xs text-amber-600">
                            Posts have been added to the list above
                        </div>
                    </div>
                </div>
            )}

            {/* Revalidation indicator */}
            {isRevalidating && (
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <ArrowClockwise className="animate-spin" size={14} />
                    <span>Checking for updates...</span>
                </div>
            )}
        </>
    );
}
