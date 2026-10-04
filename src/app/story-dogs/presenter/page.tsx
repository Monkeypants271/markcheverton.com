import { redirect } from 'next/navigation';
import { authenticated } from '@/lib/storydogs-server/auth';
import { StoryDogsExperience } from '../StoryDogsExperience';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Private StoryDogs Presenter', robots: { index: false, follow: false } };
export default async function Page() {
  if (!await authenticated()) redirect('/story-dogs/presenter/login');
  return <StoryDogsExperience version="presenter" aiConfigured={Boolean(process.env.STORYDOGS_OPENAI_API_KEY && process.env.STORYDOGS_OPENAI_MODEL)} />;
}
