import { useEffect } from "react";

import { CategoryCarousel } from "./CategoryCarousel";
import { CraftSection } from "./CraftSection";
import { HomeHeader } from "./HomeHeader";
import { HomeHero } from "./HomeHero";
import "./home.css";
import { ProductGrid } from "./ProductGrid";
import { SiteFooter } from "./SiteFooter";
import { StreetSection } from "./StreetSection";
import { SubscribeSection } from "./SubscribeSection";

const PAGE_TITLE = "KULT STUDIO · Drop 04 Hyperstructure · Tienda Oficial";
const PAGE_DESCRIPTION =
  "Lanzamiento Drop 04 de KULT STUDIO. Heavyweight French Terry & Algodón Orgánico 280 GSM con silueta oversized en Bogotá y Medellín.";

/** Portada principal: ensambla todas las secciones de referencia/index.html. */
export function HomePage() {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content");

    document.title = PAGE_TITLE;
    description?.setAttribute("content", PAGE_DESCRIPTION);

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== null) {
        description.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <div className="home-page">
      <HomeHeader />
      <main>
        <HomeHero />
        <ProductGrid />
        <CraftSection />
        <CategoryCarousel />
        <StreetSection />
        <SubscribeSection />
      </main>
      <SiteFooter />
    </div>
  );
}
