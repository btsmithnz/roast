import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Roast",
    template: "%s | Roast",
  },
  description:
    "Find coffee shops and coffees by tasting notes, atmosphere, body, brightness, and the reviews of people who care too much in the best way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth antialiased"
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
