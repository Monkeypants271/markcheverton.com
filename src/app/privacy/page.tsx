import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How markcheverton.com collects, uses, and protects information from visitors, newsletter subscribers, and young writers who submit fan fiction.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <Container className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 text-[var(--color-ink-soft)] leading-relaxed">
          <p>
            This Privacy Policy explains what information markcheverton.com (the
            &ldquo;Site&rdquo;) collects, how it is used, and the choices you
            have. By using the Site you agree to the practices described here.
            If you have questions or requests, please reach Mark through the{" "}
            <Link
              href="/contact"
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              contact page
            </Link>
            .
          </p>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
              Information collected through contact forms
            </h2>
            <p className="mt-3">
              When you contact Mark, you may provide your name, email address,
              and any message you choose to send. This information is used only
              to respond to your message. It is never sold or rented.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
              Email signup and newsletter
            </h2>
            <p className="mt-3">
              If you sign up to receive free books or the newsletter, we collect
              your email address (and any name you provide) in order to deliver
              the free stories and send occasional updates about new releases,
              excerpts, and character-naming contests. Every email includes an
              unsubscribe link, and you can opt out at any time. Free books are
              delivered through BookFunnel, which may also process your email to
              send the files you requested.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
              Fan fiction, comments, and submissions from young writers
            </h2>
            <p className="mt-3">
              The Site lets readers submit fan fiction and comments. When you
              submit a story or comment, we collect the content you write, any
              name or pen name you choose to display, and (for fan fiction) an
              email address so Mark can reply about your submission. Approved
              submissions may be published publicly on the Site. Please do not
              include home addresses, phone numbers, school names, or other
              private details in anything you submit.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
              Children&apos;s privacy and parent permission
            </h2>
            <p className="mt-3">
              Many of our readers are children. We do not knowingly collect more
              personal information from a child than is needed to take part in a
              feature such as fan fiction or comments. Children should always ask
              a parent or guardian for permission before submitting anything
              online or signing up for the newsletter. If you are a parent or
              guardian and believe your child has provided personal information
              you would like removed, contact Mark through the{" "}
              <Link
                href="/contact"
                className="font-semibold text-[var(--color-accent)] hover:underline"
              >
                contact page
              </Link>{" "}
              and we will remove it promptly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
              Analytics and cookies
            </h2>
            <p className="mt-3">
              The Site may use cookies and analytics tools to understand how
              visitors use the pages so we can improve the experience. Analytics
              data is aggregated and is not used to personally identify
              individual visitors. You can disable cookies in your browser
              settings, though some features may not work as well.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
              Third-party services
            </h2>
            <p className="mt-3">
              We rely on trusted third-party services to operate the Site,
              including a web host, an analytics provider, an email/newsletter
              provider, BookFunnel for free-book delivery, and a forms and
              anti-spam provider. These services process only the information
              needed to perform their function and are expected to protect it.
              Outbound links to retailers such as Amazon are provided for your
              convenience; those sites have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
              Requesting deletion or removal of content
            </h2>
            <p className="mt-3">
              You can ask us to delete your information or remove a published
              comment or fan fiction submission at any time. Reach Mark through
              the{" "}
              <Link
                href="/contact"
                className="font-semibold text-[var(--color-accent)] hover:underline"
              >
                contact page
              </Link>{" "}
              with the details and we will take care of it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
              Contact
            </h2>
            <p className="mt-3">
              For any privacy questions or requests, use the{" "}
              <Link
                href="/contact"
                className="font-semibold text-[var(--color-accent)] hover:underline"
              >
                contact page
              </Link>
              . This policy may be updated from time to time; changes will be
              posted on this page.
            </p>
          </section>
        </div>
      </Container>
    </>
  );
}
