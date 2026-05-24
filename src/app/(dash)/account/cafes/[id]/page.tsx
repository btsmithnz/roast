import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import {
  Add01Icon,
  ArrowLeft01Icon,
  CafeIcon,
  Coffee01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { createCoffee, updateCafe, updateCoffee } from "@/app/actions";
import { AppIcon } from "@/components/app-icon";
import { CountrySelect } from "@/components/elements/country-select";
import { ScoreSlider } from "@/components/elements/score-slider";
import { SkeletonBlock } from "@/components/skeletons";
import { buttonVariants } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getManagedCafeData } from "@/lib/data";
import { cn } from "@/lib/utils";
import Form from "next/form";
import { SubmitButton } from "@/components/elements/submit-button";

export const metadata = {
  title: "Manage cafe",
};

export default function ManagedCafePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <Suspense fallback={<ManagedCafeSkeleton />}>
        {params.then(({ id }) => (
          <ManagedCafeContent id={id} />
        ))}
      </Suspense>
    </main>
  );
}

async function ManagedCafeContent({ id }: { id: string }) {
  const cafeId = Number.parseInt(id, 10);

  if (!Number.isFinite(cafeId)) {
    notFound();
  }

  const data = await getManagedCafeData(cafeId);

  if (!data) {
    redirect(`/sign-in?next=/account/cafes/${cafeId}`);
  }

  if (!data.cafe) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-stone-950/10 bg-stone-950 p-6 text-stone-50 shadow-xl shadow-stone-950/15 sm:p-8">
        <Link
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-stone-300 underline-offset-4 hover:text-white hover:underline"
          href="/account"
        >
          <AppIcon icon={ArrowLeft01Icon} size={16} />
          Account
        </Link>
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-rose-300">
              Cafe management
            </p>
            <h1 className="text-5xl leading-none sm:text-6xl">
              {data.cafe.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-300">
              Edit the cafe profile and keep its coffee list current.
            </p>
          </div>
          <Link
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "self-start lg:self-end",
            )}
            href={`/cafes/${data.cafe.slug}`}
          >
            <AppIcon icon={ViewIcon} />
            View public page
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <section className="rounded-lg border border-stone-950/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AppIcon icon={CafeIcon} />
            <h2 className="text-2xl text-stone-950">Cafe profile</h2>
          </div>
          <Form action={updateCafe} className="grid gap-3 md:grid-cols-2">
            <input name="cafeId" type="hidden" value={data.cafe.id} />
            <TextField
              label="Cafe name"
              name="name"
              required
              value={data.cafe.name}
            />
            <TextField
              label="Address line 1"
              name="addressLine1"
              required
              value={data.cafe.addressLine1}
            />
            <TextField
              label="Address line 2"
              name="addressLine2"
              value={data.cafe.addressLine2 ?? ""}
            />
            <TextField
              label="Suburb"
              name="suburb"
              required
              value={data.cafe.suburb}
            />
            <TextField
              label="State"
              name="state"
              value={data.cafe.state ?? ""}
            />
            <TextField
              label="Postcode"
              name="postcode"
              required
              value={data.cafe.postcode ?? ""}
            />
            <CountrySelect required value={data.cafe.country} />
            <TextareaField
              className="md:col-span-2"
              label="Description"
              name="description"
              required
              value={data.cafe.description ?? ""}
            />
            <SubmitButton className="md:col-span-2">Save cafe</SubmitButton>
          </Form>
        </section>

        <section className="rounded-lg border border-stone-950/10 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <AppIcon icon={Add01Icon} />
            <h2 className="text-2xl text-stone-950">Add coffee</h2>
          </div>
          <CoffeeForm cafeId={data.cafe.id} mode="create" />
        </section>
      </div>

      <section className="rounded-lg border border-stone-950/10 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <AppIcon icon={Coffee01Icon} />
          <h2 className="text-2xl text-stone-950">Coffees</h2>
        </div>
        <div className="grid gap-4">
          {data.coffees.map((coffee) => (
            <article
              className="rounded-lg border border-stone-950/10 bg-stone-50 p-4"
              key={coffee.id}
            >
              <div className="mb-4">
                <h3 className="text-2xl text-stone-950">{coffee.name}</h3>
                <p className="mt-1 text-sm text-stone-600">
                  {coffee.notes.length > 0
                    ? coffee.notes.join(", ")
                    : "No tasting notes yet"}
                </p>
              </div>
              <CoffeeForm cafeId={data.cafe.id} coffee={coffee} mode="edit" />
            </article>
          ))}
          {data.coffees.length === 0 ? (
            <p className="rounded-md bg-stone-50 p-4 text-sm leading-6 text-stone-600">
              No coffees listed yet. Add the first one above.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function CoffeeForm({
  cafeId,
  coffee,
  mode,
}: {
  cafeId: number;
  coffee?: {
    id: number;
    name: string;
    description: string | null;
    notes: string[];
    body: number;
    brightness: number;
  };
  mode: "create" | "edit";
}) {
  return (
    <Form
      action={mode === "create" ? createCoffee : updateCoffee}
      className="grid gap-3 md:grid-cols-2"
    >
      <input name="cafeId" type="hidden" value={cafeId} />
      {coffee ? (
        <input name="coffeeId" type="hidden" value={coffee.id} />
      ) : null}
      <TextField
        label="Coffee name"
        name="name"
        required
        value={coffee?.name}
      />
      <TextField
        label="Notes (comma-separated)"
        name="notes"
        required
        value={coffee?.notes.join(", ")}
      />
      <TextareaField
        className="md:col-span-2"
        label="Description"
        name="description"
        required
        value={coffee?.description ?? ""}
      />
      <div className="grid gap-5 rounded-lg border border-stone-950/10 bg-white p-4 md:col-span-2 md:grid-cols-2">
        <ScoreSlider
          defaultValue={coffee?.body ?? 5}
          fromLabel="Light"
          label="Body"
          name="body"
          toLabel="Full"
        />
        <ScoreSlider
          defaultValue={coffee?.brightness ?? 5}
          fromLabel="Mellow/Chocolatey"
          label="Brightness"
          name="brightness"
          toLabel="Fruity/Floral"
        />
      </div>
      <SubmitButton className="md:col-span-2" size="sm">
        {mode === "create" ? "Add coffee" : "Save coffee"}
      </SubmitButton>
    </Form>
  );
}

function TextField({
  label,
  name,
  required,
  value,
}: {
  label: string;
  name: string;
  required?: boolean;
  value?: string;
}) {
  return (
    <Field className="gap-1">
      <FieldLabel className="text-stone-700">{label}</FieldLabel>
      <Input defaultValue={value} name={name} required={required} type="text" />
    </Field>
  );
}

function TextareaField({
  label,
  name,
  required,
  value,
  className,
}: {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  className?: string;
}) {
  return (
    <Field className={cn("gap-1", className)}>
      <FieldLabel className="text-stone-700">{label}</FieldLabel>
      <Textarea defaultValue={value} name={name} required={required} />
    </Field>
  );
}

function ManagedCafeSkeleton() {
  return (
    <div className="grid gap-6">
      <SkeletonBlock className="h-64 rounded-lg bg-stone-300" />
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonBlock className="h-96 rounded-lg" />
        <SkeletonBlock className="h-96 rounded-lg" />
      </div>
      <SkeletonBlock className="h-[420px] rounded-lg" />
    </div>
  );
}
