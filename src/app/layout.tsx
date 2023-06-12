import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"; // implement after
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Misfits Managed",
  description: "Where Misfits are Managed",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/croppedMisfitsLogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#EA0607",
        },
      }}
    >
      <html lang="en" className="dark">
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
        <body className={`${inter.className}`}>{children}</body>
        {/* </ThemeProvider> */}
      </html>
    </ClerkProvider>
  );
}
