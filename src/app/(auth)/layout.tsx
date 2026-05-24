import Link from "next/link";
import { CafeIcon } from "@hugeicons/core-free-icons";
import { AppIcon } from "@/components/app-icon";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[0.92fr_1.08fr]">
      <section className="hidden border-r bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-10">
        <Link className="flex items-center gap-3 font-heading text-2xl font-semibold" href="/">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
            <AppIcon icon={CafeIcon} />
          </span>
          Roast
        </Link>
        <div className="max-w-md">
          <div className="mb-8 grid aspect-[4/3] place-items-center rounded-2xl border border-primary-foreground/10 bg-[radial-gradient(circle_at_30%_20%,rgba(220,150,120,.35),transparent_34%),radial-gradient(circle_at_72%_72%,rgba(170,200,170,.28),transparent_36%),linear-gradient(135deg,rgba(255,255,255,.1),rgba(255,255,255,.03))]">
            <div className="grid size-48 place-items-center rounded-full border border-primary-foreground/20 bg-primary/40">
              <div className="size-24 rounded-full border-[18px] border-primary-foreground/80 border-r-accent border-b-secondary" />
            </div>
          </div>
          <p className="font-heading text-4xl leading-tight font-semibold">
            Keep your favourite cups close.
          </p>
          <p className="mt-4 text-sm leading-6 text-primary-foreground/70">
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
