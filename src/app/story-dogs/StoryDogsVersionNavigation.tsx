import Link from 'next/link';

export function StoryDogsVersionNavigation({ version, authenticated = false }: { version: 'kids' | 'presenter'; authenticated?: boolean }) {
  return <nav className="sd-version-nav sd-no-print" aria-label="StoryDogs versions">
    <Link className="sd-version-button" href="/story-dogs" aria-current={version === 'kids' ? 'page' : undefined}>Public StoryDogs</Link>
    <Link className="sd-version-button" href="/story-dogs/presenter" aria-current={version === 'presenter' ? 'page' : undefined}>Private StoryDogs</Link>
    {authenticated && <form action="/api/story-dogs/presenter/logout" method="post"><button className="sd-button" type="submit">Log Out</button></form>}
  </nav>;
}
