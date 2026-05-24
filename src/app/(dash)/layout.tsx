import Link from "next/link";
import Form from "next/form";
import { CafeIcon, Home01Icon } from "@hugeicons/core-free-icons";
import { AppIcon } from "@/components/app-icon";
import { signOut } from "@/app/actions";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/components/elements/submit-button";

export default function AccountLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            className="flex items-center gap-2 font-heading text-xl font-semibold"
            href="/"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <AppIcon icon={CafeIcon} />
            </span>
            Roast
          </Link>
          <div className="flex items-center gap-2">
            <Link
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              href="/"
            >
              <AppIcon icon={Home01Icon} />
              Home
            </Link>
            <Form action={signOut}>
              <SubmitButton size="sm" variant="outline">
                Sign out
              </SubmitButton>
            </Form>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}
