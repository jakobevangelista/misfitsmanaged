import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
export const runtime = "edge";
import Hero from "@/components/landingPage/Hero";
import LogoSection from "@/components/landingPage/LogoSection";
import FeatureSection from "@/components/landingPage/FeatureSection";
import FAQ from "@/components/landingPage/FAQ";
import Contact from "@/components/landingPage/contact";

export default function Page() {
  return (
    <>
      <Hero />
      <LogoSection />
      <FeatureSection />
      <FAQ />
      <Contact />
    </>
  );
}
