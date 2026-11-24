import { cookies, headers } from "next/headers";
import { getInitialHomeData } from "@/components/home/server";
import { HomeTheaterController } from "@/components/home/HomeTheaterController";
import { LOCALE_COOKIE_NAME, isValidLocale, type Locale } from "@art-work/types";

export const revalidate = 60;

async function resolveServerLocale(): Promise<Locale> {
  const headerStore = await headers();
  const headerLocale = headerStore.get("x-artwork-locale");
  if (isValidLocale(headerLocale)) return headerLocale;
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  return isValidLocale(cookieLocale) ? cookieLocale : "en";
}

export default async function Home() {
  const locale = await resolveServerLocale();
  const initialData = await getInitialHomeData(locale);

  return <HomeTheaterController initialData={initialData} />;
}
