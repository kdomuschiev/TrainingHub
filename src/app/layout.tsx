import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrainingHub",
  description: "Личен тренировъчен дневник с екип от AI треньори.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  );
}
