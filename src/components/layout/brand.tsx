import Link from "next/link";

export function Brand() {
  return (
    <Link className="inline-flex items-center gap-2 font-extrabold tracking-[-0.04em]" href="/">
      <span className="grid size-8 place-items-center rounded-xl bg-[#147df5] text-white">↗</span>
      <span className="text-lg">Tripways</span>
    </Link>
  );
}
