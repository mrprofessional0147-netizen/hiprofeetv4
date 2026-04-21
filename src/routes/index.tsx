import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/layout";
import { Hero, Ticker, HowItWorks, Testimonials, Services, FinalCTA } from "@/components/home-sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HIPROFEET — Free AI Business Growth Partner" },
      { name: "description", content: "Free AI business diagnosis for Nigerian entrepreneurs. Get clarity in 3 minutes — then expert execution from ₦8,000." },
      { property: "og:title", content: "HIPROFEET — Free AI Business Growth Partner" },
      { property: "og:description", content: "Free AI business diagnosis. Find what's limiting your growth — and how to fix it. Built for Nigerian entrepreneurs." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <HowItWorks />
        <Testimonials />
        <Services />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
