import Link from "next/link";
import { Suspense } from "react";
import {
  Coffee01Icon,
  Mail01Icon,
  SquareLock01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { signUpWithEmail } from "@/app/actions";
import { AppIcon } from "@/components/app-icon";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SubmitButton } from "@/components/elements/submit-button";
import Form from "next/form";

export const metadata = {
  title: "Sign up",
};

type SignUpSearchParams = Promise<{ error?: string }>;

export default function SignUpPage({
  searchParams,
}: {
  searchParams?: SignUpSearchParams;
}) {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <SignUpForm searchParams={searchParams ?? Promise.resolve({})} />
    </Suspense>
  );
}

async function SignUpForm({ searchParams }: { searchParams: SignUpSearchParams }) {
  const params = await searchParams;

  return (
    <div className="w-full max-w-md">
      <Link className="mb-10 flex items-center gap-2 font-heading text-xl lg:hidden" href="/">
        <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <AppIcon icon={Coffee01Icon} />
        </span>
        Roast
      </Link>
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Start tasting
        </p>
        <h1 className="text-4xl leading-tight font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Build your cafe shortlist, collect standout coffees, and review the
          cups that stay with you.
        </p>
      </div>
      {params?.error ? (
        <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {params.error}
        </div>
      ) : null}
      <Form action={signUpWithEmail} className="grid gap-4">
        <Field className="gap-2">
          <FieldLabel>Name</FieldLabel>
          <span className="relative">
            <AppIcon
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              icon={UserIcon}
            />
            <Input
              autoComplete="name"
              className="pl-9"
              name="name"
              required
              type="text"
            />
          </span>
        </Field>
        <Field className="gap-2">
          <FieldLabel>Email</FieldLabel>
          <span className="relative">
            <AppIcon
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              icon={Mail01Icon}
            />
            <Input
              autoComplete="email"
              className="pl-9"
              name="email"
              required
              type="email"
            />
          </span>
        </Field>
        <Field className="gap-2">
          <FieldLabel>Password</FieldLabel>
          <span className="relative">
            <AppIcon
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              icon={SquareLock01Icon}
            />
            <Input
              autoComplete="new-password"
              className="pl-9"
              minLength={8}
              name="password"
              required
              type="password"
            />
          </span>
        </Field>
        <SubmitButton className="mt-2 h-11" size="lg">
          Sign up
        </SubmitButton>
      </Form>
      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-semibold text-foreground underline-offset-4 hover:underline" href="/sign-in">
          Sign in
        </Link>
      </p>
    </div>
  );
}

function AuthFormSkeleton() {
  return (
    <div className="w-full max-w-md">
      <Skeleton className="mb-8 h-32" />
      <div className="grid gap-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12 rounded-full" />
      </div>
    </div>
  );
}
