import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E0E12] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-black font-black text-2xl flex items-center justify-center mb-6 shadow-[4px_4px_0px_#ffffff]">
        404
      </div>
      <h2 className="text-3xl font-black font-headline uppercase tracking-tight mb-2">
        SCENE NOT FOUND
      </h2>
      <p className="text-zinc-400 text-sm max-w-md mb-6 font-mono">
        The stage or asset you are looking for does not exist or has been shifted in the production schedule.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all shadow-[2px_2px_0px_#ffffff]"
      >
        Return to Stage
      </Link>
    </div>
  );
}
