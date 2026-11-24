import Link from "next/link";
import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME, getUiDictionary, isValidLocale } from "@art-work/types";

export default async function NotFound() {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getUiDictionary(locale).notFound;

  return (
    <div className="min-h-screen bg-[#0E0E12] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-black font-black text-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_#ffffff]">
        {t.code}
      </div>
      <h2 className="text-3xl font-black font-headline uppercase tracking-tight mb-2">
        {t.title}
      </h2>
      <p className="text-zinc-400 text-sm max-w-md mb-6 font-mono">
        {t.description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all shadow-[2px_2px_0px_#ffffff]"
        >
          {t.backHome}
        </Link>
        <Link
          href="/gallery"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all border border-white/20"
        >
          {t.exploreGallery}
        </Link>
      </div>
    </div>
  );
}
