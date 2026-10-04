import Link from 'next/link';
import { authenticated, configuration, presenterEmail } from '@/lib/storydogs-server/auth';
import { redirect } from 'next/navigation';
import { StoryDogsVersionNavigation } from '../../StoryDogsVersionNavigation';
import { LoginForm } from './LoginForm';
import '../../story-dogs.css';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'StoryDogs Presenter Login', robots: { index: false, follow: false } };
export default async function Page() {
  if (await authenticated()) redirect('/story-dogs/presenter');
  const configured = Boolean(await configuration());
  return <div className="storydogs-page">
    <div className="sd-shell"><StoryDogsVersionNavigation version="presenter" /></div>
    <div className="sd-login">
      <h1>Presenter Login</h1>
      <p>Private access for Mark’s presentations. Kids and teachers can use StoryDogs without logging in.</p>
      {configured ? <LoginForm email={presenterEmail} /> : <section role="status">
        <h2>Private StoryDogs is temporarily unavailable</h2>
        {process.env.NODE_ENV !== 'production' && <p>For local setup, run <code>npm run storydogs:setup</code> from the project terminal, then refresh this page.</p>}
      </section>}
      <Link href="/story-dogs">Back to Public StoryDogs</Link>
    </div>
  </div>;
}
