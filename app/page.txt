import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layaout/Footer";
import Navbar from "@/components/Navbar";
import { Features } from "@/components/sections/Features";
import { Pricing } from "@/components/sections/Pricing";
import Image from "next/image";

export default function Home() {
  return (
  
   <main className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
