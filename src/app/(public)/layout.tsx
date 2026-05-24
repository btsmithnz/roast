import Link from "next/link";
import { Suspense } from "react";
import {
  CafeIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { AppIcon } from "@/components/app-icon";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentSession } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-stone-950/10 bg-background/88 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link className="flex items-center gap-2 font-heading text-xl" href="/">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <AppIcon icon={CafeIcon} />
            </span>
            Roast
          </Link>
          <Suspense fallback={<AuthButtonFallback />}>
            <AuthButton />
          </Suspense>
        </nav>
      </header>
      {children}
    </>
  );
}

async function AuthButton() {
  const session = await getCurrentSession();

  if (session?.user) {
    return (
      <Link
        className={cn(buttonVariants({ variant: "default", size: "sm" }))}
        href="/account"
      >
        <AppIcon icon={UserIcon} />
        Account
      </Link>
    );
  }

  return (
    <Link
      className={cn(buttonVariants({ variant: "default", size: "sm" }))}
      href="/sign-in"
    >
      <AppIcon icon={UserIcon} />
      Sign in
    </Link>
  );
}

function AuthButtonFallback() {
  return (
    <Skeleton
      className={cn(
        buttonVariants({ variant: "secondary", size: "sm" }),
        "w-28 rounded-4xl",
      )}
    />
  );
}
