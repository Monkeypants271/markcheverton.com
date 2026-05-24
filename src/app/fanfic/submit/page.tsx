import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";
import { SubmitForm } from "./SubmitForm";

export const metadata = { title: "Submit a Story" };

export default function SubmitStoryPage() {
  return (
    <>
      <PageHeader eyebrow="Fan Fiction" title="Share your story.">
        Mark reads every story personally. If he posts yours, it shows up on
        the Fan Fiction page for kids around the world to read.
      </PageHeader>

      <Container className="py-16">
        <div className="mx-auto max-w-3xl">
          <SubmitForm />
        </div>
      </Container>
    </>
  );
}
