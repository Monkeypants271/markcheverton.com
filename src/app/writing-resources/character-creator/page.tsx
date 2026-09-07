import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { CharacterCreator } from "./CharacterCreator";

export const metadata = { title: "Character Creator" };

export default function CharacterCreatorPage() {
  return <>
    <PageHeader eyebrow="Character Creator" title="Make a character people remember.">
      Answer a few fun questions, then get a character card you can use in your story.
    </PageHeader>
    <Container className="py-12 sm:py-16"><CharacterCreator /></Container>
  </>;
}
