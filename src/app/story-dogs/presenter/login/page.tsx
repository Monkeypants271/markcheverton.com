import Link from 'next/link';
import { authenticated, configuration } from '@/lib/storydogs-server/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';
import '../../story-dogs.css';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'StoryDogs Presenter Login', robots: { index: false, follow: false } };
export default async function Page() {
  if (await authenticated()) redirect('/story-dogs/presenter');
  return <div className="storydogs-page"><div className="sd-login"><h1>Presenter Login</h1><p>Private access for Mark’s presentations. Kids and teachers can use StoryDogs without logging in.</p><LoginForm configured={Boolean(await configuration())} /><Link href="/story-dogs/teachers">Back to StoryDogs for Teachers</Link></div></div>;
}
