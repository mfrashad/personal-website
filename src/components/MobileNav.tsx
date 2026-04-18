import React, { useState, useEffect, memo } from 'react';

const NAV_ITEMS = [
  { label: 'Home', href: '/', emoji: '👋' },
  { label: 'About', href: '/about', emoji: '🙂' },
  { label: 'Blog', href: '/blog', emoji: '💡' },
  { label: 'Books', href: '/books', emoji: '📚' },
  { label: 'Movies', href: '/movies', emoji: '🎬' },
  { label: 'Bookmarks', href: '/bookmarks', emoji: '🔖' },
  { label: 'Resources', href: '/resources', emoji: '🛠️' },
  { label: 'Postcards', href: '/postcards', emoji: '✉️' },
  { label: 'Speaking', href: '/speaking', emoji: '🎤' },
  { label: 'Create', href: '/create', emoji: '✨' },
  { label: 'Hobbies', href: '/hobbies', emoji: '❤️' },
  { label: 'Achievements', href: '/achievements', emoji: '🏆' },
  { label: 'Diving', href: '/diving', emoji: '🌊' },
  { label: 'Hackathons', href: '/hackathons', emoji: '💻' },
];

function matchesRoute(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

const NavItem = memo(function NavItem({ item, active }: { item: typeof NAV_ITEMS[0]; active: boolean }) {
  return (
    <a
      href={item.href}
      aria-label={item.label}
      title={item.label}
      className={[
        'flex items-center justify-center h-11 rounded-full transition-colors',
        active ? 'bg-white/15' : 'hover:bg-white/10',
      ].join(' ')}
    >
      <span className="text-[22px] leading-none select-none" role="img" aria-hidden="true">
        {item.emoji}
      </span>
    </a>
  );
});

export default function MobileNav() {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
    const onPageLoad = () => setPathname(window.location.pathname);
    document.addEventListener('astro:page-load', onPageLoad);
    return () => document.removeEventListener('astro:page-load', onPageLoad);
  }, []);

  return (
    <nav
      className="pointer-events-none fixed bottom-5 left-2 right-2 z-[99999] lg:hidden"
      aria-label="Mobile navigation"
    >
      {/* Peeking guest card — hidden on the postcards page itself */}
      {pathname !== '/postcards' && (
        <a
          href="/postcards"
          className="pointer-events-auto absolute bottom-full left-1/2 -translate-x-1/2 translate-y-2 rounded px-4 py-2.5 shadow-lg -rotate-3 hover:-translate-y-1 transition-transform"
          style={{
            backgroundColor: '#f5e6b8',
            backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.07) 0 1px, transparent 1px 14px)',
            zIndex: 0,
          }}
          aria-label="Sign the guestbook"
        >
          <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-600 leading-none mb-1">
            Guest Card
          </p>
          <p className="font-script text-lg italic text-neutral-800 leading-none whitespace-nowrap">
            Leave a note →
          </p>
        </a>
      )}

      <div className="pointer-events-auto relative w-full rounded-3xl shadow-lg" style={{ backgroundColor: '#141923', zIndex: 1 }}>
        <div className="grid grid-cols-7 py-1 px-1">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} item={item} active={matchesRoute(pathname, item.href)} />
          ))}
        </div>
      </div>
    </nav>
  );
}
