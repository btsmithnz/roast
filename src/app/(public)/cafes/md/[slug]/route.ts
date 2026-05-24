import {
  getCafePageData,
  getCafeStaticParams,
  type CafeView,
  type CoffeeView,
} from "@/lib/data";

const markdownHeaders = {
  "content-type": "text/markdown; charset=utf-8",
};

export async function generateStaticParams() {
  return getCafeStaticParams();
}

export async function GET(request: Request) {
  const slug = getSlugFromPathname(new URL(request.url).pathname);

  if (!slug) {
    return new Response("# Cafe not found\n", {
      headers: markdownHeaders,
      status: 404,
    });
  }

  const cafe = await getCafePageData(slug);

  if (!cafe) {
    return new Response("# Cafe not found\n", {
      headers: markdownHeaders,
      status: 404,
    });
  }

  return new Response(renderCafeMarkdown(cafe), {
    headers: markdownHeaders,
  });
}

function renderCafeMarkdown(cafe: CafeView) {
  const lines = [
    `# ${markdown(cafe.name)}`,
    "",
    markdown(cafe.description),
    "",
    `- Location: ${markdown(cafe.location)}`,
    `- Address: ${markdown(formatAddress(cafe))}`,
    `- Coffees: ${cafe.coffeeCount}`,
    `- Average score: ${formatScore(cafe.avgScore)}`,
    "",
    "## Coffees",
    "",
  ];

  if (cafe.coffees.length === 0) {
    lines.push("This cafe has not listed coffees yet.", "");
  } else {
    lines.push(...cafe.coffees.flatMap(renderCoffeeMarkdown));
  }

  return `${lines.join("\n").trim()}\n`;
}

function renderCoffeeMarkdown(coffee: CoffeeView) {
  const lines = [
    `### ${markdown(coffee.name)}`,
    "",
    markdown(coffee.description),
    "",
    `- Tasting notes: ${formatNotes(coffee.notes)}`,
    `- Intended body: ${coffee.body}/10`,
    `- Intended brightness: ${coffee.brightness}/10`,
    `- Average body: ${formatScore(coffee.avgBody)}`,
    `- Average brightness: ${formatScore(coffee.avgBrightness)}`,
    `- Average score: ${formatScore(coffee.avgScore)}`,
    `- Reviews: ${coffee.reviewCount}`,
    "",
    "#### Recent reviews",
    "",
  ];

  if (coffee.reviews.length === 0) {
    lines.push("No reviews yet.", "");
  } else {
    lines.push(
      ...coffee.reviews.slice(0, 2).flatMap((review) => [
        `> ${markdown(review.description, "No note provided.")}`,
        ">",
        `> Score: ${review.score}/10`,
        "",
      ]),
    );
  }

  return lines;
}

function formatAddress(cafe: CafeView) {
  return [cafe.addressLine1, cafe.addressLine2, cafe.location]
    .filter(Boolean)
    .join(", ");
}

function formatNotes(notes: string[]) {
  return notes.length > 0
    ? notes.map((note) => markdown(note)).join(", ")
    : "None listed";
}

function formatScore(value: number | null) {
  return value === null ? "Not rated yet" : `${formatNumber(value)}/10`;
}

function formatNumber(value: number) {
  return value.toFixed(1).replace(/\.0$/, "");
}

function getSlugFromPathname(pathname: string) {
  const segment = pathname.split("/").pop() ?? "";

  if (!segment.endsWith(".md")) {
    return null;
  }

  const slug = decodeURIComponent(segment.slice(0, -3));
  return slug || null;
}

function markdown(value: string | null | undefined, fallback = "") {
  const text = value?.trim() || fallback;

  return text
    .replace(/\r\n?/g, "\n")
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\*/g, "\\*")
    .replace(/_/g, "\\_")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
