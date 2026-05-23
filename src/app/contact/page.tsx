import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Get in touch with Mark.">
        I read and personally respond to every email. Please type your email
        address carefully so I can reply.
      </PageHeader>

      <Container className="py-16">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6 text-[var(--color-ink-soft)]">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                Email
              </h2>
              <p className="mt-2">
                MarktheMinecraftAuthor
                <span className="text-[var(--color-muted)]"> (at) </span>gmail
                <span className="text-[var(--color-muted)]"> (dot) </span>com
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
                Mail (fan art & letters)
              </h2>
              <address className="mt-2 not-italic">
                Gameknight Publishing<br />
                5 Southside Drive, Suite 11 #318<br />
                Clifton Park, NY 12065
              </address>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Letters are forwarded through agent Holly Root at Root Literary.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-surface)] p-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary)]">
              Send a message
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              [Form will be wired up in a later phase — for now use the email
              address on the left.]
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
