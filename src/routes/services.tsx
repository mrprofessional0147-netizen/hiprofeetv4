import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav, Footer } from "@/components/layout";
import { Services } from "@/components/home-sections";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Growth Services — HIPROFEET" },
      { name: "description", content: "Facebook Ads, Instagram Ads, TikTok, reviews, website builds and more — for Nigerian businesses ready to execute." },
      { property: "og:title", content: "Growth Services — HIPROFEET" },
      { property: "og:description", content: "Naira-priced growth services for Nigerian operators. Direct, professional, delivered fast." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="bg-ink pt-24">
        <section className="border-b border-white/5 px-5 py-14 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="text-[11px] font-bold uppercase tracking-[3px] text-sky">For existing clients & operators who know what they need</div>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">Growth Services</h1>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Not sure what you need? <Link to="/diagnosis" className="text-sky hover:underline">Take the free diagnosis first →</Link>
            </p>
          </div>
        </section>
        <Services />
      </main>
      <Footer />
    </>
  );
}
