import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Misfits Managed",
  description: "Where Misfits are Managed",
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "white" },
  //   { media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
  icons: {
    icon: "/croppedMisfitsLogo.png",
  },
  display: "standalone",
  name: "Misfits Managed",
  short_name: "MM",
  start_url: "/",
  id: "/",
  background_color: "#EFE1B2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`dark ${GeistSans.className} scroll-smooth`}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <body>
            {children}
            <Toaster />
          </body>
        </ThemeProvider>
      </html>
    </ClerkProvider>
  );
}
