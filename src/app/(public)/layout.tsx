import Link from "next/link";
import { Suspense } from "react";
import {
  CafeIcon,
  Location01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { AppIcon } from "@/components/app-icon";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentSession } from "@/lib/data";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link className="flex items-center gap-2 font-heading text-xl font-semibold" href="/">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <AppIcon icon={CafeIcon} />
            </span>
            Roast
          </Link>
          <div className="ml-2 hidden items-center gap-1 text-sm font-medium text-muted-foreground sm:flex">
            <Link className="rounded-full px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground" href="/">
              Explore
            </Link>
            <Link className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground" href="/nearby">
              <AppIcon icon={Location01Icon} size={16} />
              Nearby
            </Link>
          </div>
          <div className="ml-auto">
            <Suspense fallback={<Skeleton className="h-8 w-24 rounded-full" />}>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}

async function AuthButton() {
  const session = await getCurrentSession();
  const signedIn = Boolean(session?.user);

  return (
    <Link
      className={buttonVariants({ variant: "default", size: "sm" })}
      href={signedIn ? "/account" : "/sign-in"}
    >
      <AppIcon icon={UserIcon} />
      {signedIn ? "Account" : "Sign in"}
    </Link>
  );
}
