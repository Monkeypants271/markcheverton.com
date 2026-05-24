import { notFound } from "next/navigation";
import { FanFicIndex } from "../../_components/FanFicIndex";

export const metadata = { title: "Fan Fiction" };
export const dynamic = "force-dynamic";
export const fetchCache = "only-no-store";
export const revalidate = 0;

export default async function FanFicPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1) notFound();
  return <FanFicIndex page={pageNum} />;
}
