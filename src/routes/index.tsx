import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer, FloatingChatCTA } from "@/components/layout";
import { ScrollProgress } from "@/components/motion";
import { Hero, Ticker, TrustBar, ProductPreview, Testimonials, Services, FAQ, FinalCTA } from "@/components/home-sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HIPROFEET — Business Growth Intelligence for Nigerian Founders" },
      { name: "description", content: "Strategic growth diagnostics for Nigerian businesses. Identify the exact bottleneck limiting your revenue — then deploy the right fix in 2–5 days." },
      { property: "og:title", content: "HIPROFEET — Business Growth Intelligence for Nigerian Founders" },
      { property: "og:description", content: "Diagnose the real constraint on your growth. Analytical, specific, naira-priced. Built for Nigerian operators." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <TrustBar />
        <ProductPreview />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Services />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingChatCTA />
    </>
  );
}
