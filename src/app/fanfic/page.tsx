import { FanFicIndex } from "./_components/FanFicIndex";

export const metadata = { title: "Fan Fiction" };
export const dynamic = "force-dynamic";
export const fetchCache = "only-no-store";
export const revalidate = 0;

export default async function FanFicPage() {
  return <FanFicIndex page={1} />;
}
