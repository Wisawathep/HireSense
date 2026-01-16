import { Geist, Geist_Mono, Quicksand } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400"]
})

export const metadata = {
  title: "HireSense | AI-Powered Resume Analysis",
  description: "HireSense | AI-Powered Resume Analysis for HR",
};

export default function RootLayout({ children }) {
  return (
    <html lang="end" className={`${[quicksand].variable}`}>
      <body className="font-quicksand antialiased">
        {children}
      </body>
    </html>
  );
}
