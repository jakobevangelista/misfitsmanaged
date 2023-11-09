export const runtime = "edge";
import Hero from "@/components/landingPage/Hero";
import LogoSection from "@/components/landingPage/LogoSection";
import FeatureSection from "@/components/landingPage/FeatureSection";
import FAQ from "@/components/landingPage/FAQ";
import Contact from "@/components/landingPage/contact";
import { api } from "@/trpc/server";

export default async function Page() {
  const testTrpc = await api.post.hello.query({ text: "deeznuts" });
  return (
    <>
      <Hero />
      <LogoSection />
      <FeatureSection />
      <FAQ />
      <Contact />
      {testTrpc.greeting}
    </>
  );
}
