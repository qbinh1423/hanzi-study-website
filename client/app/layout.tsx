import type { Metadata } from "next";
import { Poppins, Inter, Ma_Shan_Zheng, Noto_Serif_TC } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const poppins = Poppins({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-poppins" });
const inter = Inter({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-inter" });
const maShanZheng = Ma_Shan_Zheng({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ma-shan-zheng",
});
const notoSerifTraditionalChinese = Noto_Serif_TC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-noto-serif-traditional-chinese",
});

export const metadata: Metadata = {
  title: "Hanzi Study",
  description: "An app for learning Chinese characters, practicing writing, and memorizing vocabulary using a specific method.",
  icons: {
    icon: "/images/icon_app.png",
    shortcut: "/images/icon_app.png",
    apple: "/images/icon_app.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${maShanZheng.variable} ${notoSerifTraditionalChinese.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('theme');
                if (saved === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}