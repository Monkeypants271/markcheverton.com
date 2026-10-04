import localFont from 'next/font/local';
import Link from 'next/link';
import { StoryDogsBuilder } from './StoryDogsBuilder';
import './story-dogs.css';
const headingFont = localFont({ src: './fonts/Fredoka-Bold.ttf', weight: '700', style: 'normal', display: 'swap', variable: '--font-storydogs-heading' });
export function StoryDogsExperience({ version = 'kids', aiConfigured = false }: { version?: 'kids' | 'teachers' | 'presenter'; aiConfigured?: boolean }) {
  return <div className={`storydogs-page ${headingFont.variable}`}><div className="sd-shell">
    <div className="sd-version-nav sd-no-print"><Link href="/story-dogs">StoryDogs for Kids</Link><Link href="/story-dogs/teachers">For Teachers</Link>{version === 'presenter' && <form action="/api/story-dogs/presenter/logout" method="post"><button className="sd-button" type="submit">Logout</button></form>}</div>
    {version === 'teachers' && <div className="sd-version-intro sd-no-print"><h2>StoryDogs for Teachers & Librarians</h2><p>Lead a group story by projecting the questions and recording students’ choices, or let students build individual stories at their own pace. Typing works without any microphone equipment. Each version saves its own draft in this browser.</p></div>}
    {version === 'presenter' && <div className="sd-version-intro sd-no-print"><h2>Private Presenter StoryDogs</h2><p>Only this signed-in version can request AI punctuation after you click Stop Dictation. {aiConfigured ? 'AI punctuation is configured; service availability depends on your provider.' : 'AI punctuation is not configured yet. Dictation and typing still work; raw words stay editable.'}</p><p>When configured, OpenAI receives only the newly dictated passage, never audio or your complete story. It adds punctuation and capitalization only. <a href="https://developers.openai.com/api/docs/guides/your-data" target="_blank" rel="noopener noreferrer">OpenAI data handling (opens in a new tab)</a>: API content is not used for training by default; abuse-monitoring retention may apply. Requests use store: false. Use Undo to restore the raw passage.</p></div>}
    <StoryDogsBuilder version={version} />
    <section className="sd-resources sd-no-print" aria-labelledby="educators-title">
      <h2 id="educators-title">{version === 'teachers' ? 'Teaching resources' : 'Keep the stories coming!'}</h2>
      {version === 'teachers' && <p>Print the seven-page teacher guide for step-by-step explanations, teaching scripts, discussion questions, and Pip’s connected example.</p>}
      <a className="sd-button" href="/downloads/storydogs-teacher-guide.pdf" download target="_blank" rel="noopener noreferrer">Download Printable Teacher Guide (PDF)</a>
      <div className="sd-more-ideas"><a className="sd-button sd-gold" href="/writing-resources/prompts" target="_blank" rel="noopener noreferrer">Want More Story Ideas? <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a><p>Explore more prompts to spark your next story.</p></div>
      <div className="sd-links"><Link href="/writing-resources">Explore writing resources →</Link><Link href="/for-educators">Teaching resources →</Link><Link href="/fanfic/submit">Story submission instructions →</Link></div>
      <div className="sd-visit"><h3>Bring StoryDogs to your school.</h3><p>Meet Mark and build a story together during an author visit.</p><a href="https://chevertonauthorvisits.com" target="_blank" rel="noopener noreferrer">Explore author visits <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></div>
      {version === 'teachers' && <footer className="sd-presenter-link"><Link href="/story-dogs/presenter/login">Presenter Login</Link></footer>}
    </section>
  </div></div>;
}
