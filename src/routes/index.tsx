import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav, Footer, FloatingChatCTA } from "@/components/layout";
import { ScrollProgress } from "@/components/motion";
import { Hero, Ticker, TrustBar, ProductPreview, Testimonials, HowItWorks, Positioning, Qualifier, FAQ, FinalCTA } from "@/components/home-sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HIPROFEET — Free Customer Acquisition Diagnosis for Nigerian Businesses" },
      { name: "description", content: "Find out in 3 minutes why your business isn't getting enough customers. Free confidential diagnosis and personalized growth report — built for Nigerian operators." },
      { property: "og:title", content: "HIPROFEET — Free Customer Acquisition Diagnosis" },
      { property: "og:description", content: "Identify the exact bottleneck limiting your growth. Free 3-minute diagnosis and personalized report by HIPROFEET." },
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
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingChatCTA />
      {/* Discreet footer link for existing clients */}
      <div className="sr-only">
        <Link to="/services">Existing clients: browse growth services</Link>
      </div>
    </>
  );
}
