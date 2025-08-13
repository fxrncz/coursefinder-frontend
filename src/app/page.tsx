import Image from "next/image";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import TopCurvedShape from "./components/TopCurvedShape";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <TopCurvedShape />
      <Footer />
    </>
  );
}
