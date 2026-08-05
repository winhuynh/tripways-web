import type { Metadata } from "next";
import { getHomepage } from "@/features/homepage/application/get-homepage";
import { HomepageScreen } from "@/features/homepage/presentation/homepage-screen";
import { searchRoutes } from "@/features/route-search/application/search-routes";
import type { RouteSearchScope } from "@/features/route-search/domain/route-search-model";

export const dynamic="force-dynamic";
export async function generateMetadata():Promise<Metadata>{const m=await getHomepage();return{title:{absolute:m.seo.title},description:m.seo.description,robots:m.indexable?undefined:{index:false,follow:false}}}
export default async function Page({searchParams}:{searchParams:Promise<{origin?:string}>}){const model=await getHomepage();const origin=(await searchParams).origin?.trim()??"";const scope:RouteSearchScope=origin===""?{type:"global"}:/^[A-Za-z0-9]{3}$/.test(origin)?{type:"origin_airport",key:origin.toUpperCase()}:{type:"origin_city",key:origin.toLowerCase().replace(/\s+/g,"-")};const discovery=await searchRoutes(scope,{max_stops:0});return <HomepageScreen model={model} discovery={discovery} origin={origin}/>}
