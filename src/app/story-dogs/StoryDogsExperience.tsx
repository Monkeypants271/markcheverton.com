import localFont from 'next/font/local';
import Link from 'next/link';
import { StoryDogsVersionNavigation } from './StoryDogsVersionNavigation';
import { StoryDogsBuilder } from './StoryDogsBuilder';
import './story-dogs.css';
const headingFont = localFont({ src: './fonts/Fredoka-Bold.ttf', weight: '700', style: 'normal', display: 'swap', variable: '--font-storydogs-heading' });
export function StoryDogsExperience({ version = 'kids', aiConfigured = false }: { version?: 'kids' | 'presenter'; aiConfigured?: boolean }) {
  return <div className={`storydogs-page ${headingFont.variable}`}><div className="sd-shell">
    <StoryDogsVersionNavigation version={version} authenticated={version === 'presenter'} />
    {version === 'presenter' && <div className="sd-version-intro sd-no-print"><h2>Private Presenter StoryDogs</h2><p>Only this signed-in version adds AI punctuation to completed phrases while you dictate. Words awaiting punctuation appear in a separate preview; click Stop Dictation to finish the last phrase. {aiConfigured ? 'AI punctuation is configured; service availability depends on your provider.' : 'AI punctuation is not configured yet. Dictation and typing still work; raw words stay editable.'}</p><p>When configured, OpenAI receives only the newly dictated passage, never audio or your complete story. It adds punctuation and capitalization only. <a href="https://developers.openai.com/api/docs/guides/your-data" target="_blank" rel="noopener noreferrer">OpenAI data handling (opens in a new tab)</a>: API content is not used for training by default; abuse-monitoring retention may apply. Requests use store: false.</p></div>}
    <StoryDogsBuilder version={version} />
    <section className="sd-resources sd-no-print" aria-labelledby="educators-title">
      <h2 id="educators-title">Keep the stories coming!</h2>
      <div className="sd-more-ideas"><a className="sd-button sd-gold" href="/writing-resources/prompts" target="_blank" rel="noopener noreferrer">Want More Story Ideas? <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a><p>Explore more prompts to spark your next story.</p></div>
      <div className="sd-links"><Link href="/writing-resources">Explore writing resources →</Link><Link href="/for-educators">Teaching resources →</Link><Link href="/fanfic/submit">Story submission instructions →</Link></div>
      <div className="sd-visit"><h3>Bring StoryDogs to your school.</h3><p>Meet Mark and build a story together during an author visit.</p><a href="https://chevertonauthorvisits.com" target="_blank" rel="noopener noreferrer">Explore author visits <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></div>
    </section>
  </div></div>;
}
