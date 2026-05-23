import { FanFicIndex } from "./_components/FanFicIndex";

export const metadata = { title: "Fan Fiction" };

export default async function FanFicPage() {
  return <FanFicIndex page={1} />;
}
