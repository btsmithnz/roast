import Link from "next/link";
import { CafeIcon } from "@hugeicons/core-free-icons";
import { AppIcon } from "@/components/app-icon";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[0.92fr_1.08fr]">
      <section className="hidden border-r border-stone-950/10 bg-stone-950 text-stone-50 lg:flex lg:flex-col lg:justify-between lg:p-10">
        <Link className="flex items-center gap-3 font-heading text-2xl" href="/">
          <span className="grid size-10 place-items-center rounded-lg bg-rose-500 text-white">
            <AppIcon icon={CafeIcon} />
          </span>
          Roast
        </Link>
        <div className="max-w-md">
          <div className="mb-8 grid aspect-[4/3] place-items-center rounded-lg border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,.32),transparent_32%),radial-gradient(circle_at_70%_70%,rgba(14,165,233,.26),transparent_34%),linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.04))]">
            <div className="grid size-48 place-items-center rounded-full border border-white/20 bg-stone-950/40">
              <div className="size-24 rounded-full border-[18px] border-amber-100/80 border-r-rose-400 border-b-sky-400" />
            </div>
          </div>
          <p className="font-heading text-4xl leading-tight">
            Keep your favourite cups close.
          </p>
          <p className="mt-4 text-sm leading-6 text-stone-300">
            Track cafes, coffees, tasting notes, and the kind of room you want
            to sit in before the first sip.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        {children}
      </section>
    </main>
  );
}
