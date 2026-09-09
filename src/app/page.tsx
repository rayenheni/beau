import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Diagnostic from "@/components/Diagnostic";
import Bridal from "@/components/Bridal";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import ScrollUI from "@/components/ScrollUI";
import MobileBar from "@/components/MobileBar";
import ToastHost from "@/components/Toast";

export default function HomePage() {
  return (
    <main className="relative overflow-x-clip bg-ivory font-sans text-espresso">
      <div className="grain" aria-hidden />
      <Preloader />
      <CustomCursor />
      <ScrollUI />
      <ToastHost />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Diagnostic />
      <Bridal />
      <Gallery />
      <Testimonials />
      <Booking />
      <Contact />
      <Footer />
      <div className="h-16 bg-espresso sm:hidden" aria-hidden />
      <MobileBar />
    </main>
  );
}
