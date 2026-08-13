import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRoutePage } from "@/features/route-page/application/get-route-page";
import { RoutePageScreen } from "@/features/route-page/presentation/route-page-screen";

export const revalidate = 86400; // ISR: re-render at most once every 24 h
type Props = { params: Promise<{ routeSlug: string }> };

async function load(slug: string) {
  try { return await getRoutePage(slug); }
  catch (error) { if (error instanceof Error && error.message === "ERR_PAGE_NOT_FOUND") notFound(); throw error; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = await load((await params).routeSlug);
  return { title: { absolute: model.seo.title }, description: model.seo.description };
}

export default async function Page({ params }: Props) {
  const model = await load((await params).routeSlug);
  return <RoutePageScreen model={model} />;
}
