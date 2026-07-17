import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-container grid min-h-[60vh] place-items-center py-20 text-center">
      <div><p className="eyebrow">404 · Unknown route</p><h1 className="mt-4 text-5xl font-extrabold tracking-[-0.05em]">That airport is outside this fixture.</h1><p className="mx-auto mt-5 max-w-xl leading-7 text-[#52627a]">Use SGN, SIN, BKK, LHR, or CDG while testing the local Route Discovery foundation.</p><Link className="mt-8 inline-block rounded-full bg-[#147df5] px-6 py-3 font-bold text-white" href="/">Back home</Link></div>
    </section>
  );
}
