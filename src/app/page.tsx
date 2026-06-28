import { Suspense } from "react";
import Hero from '@/components/Hero';
import WhatWeOffer from '@/components/WhatWeOffer';
import WhoWeAre from '@/components/WhoWeAre';
import ShopSection from '@/components/ShopSection';
import Contact from '@/components/Contact';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhoWeAre />
      <WhatWeOffer />
      <Suspense fallback={<div>Loading products...</div>}>
        <ShopSection />
      </Suspense>
      <Contact />
    </main>
  );
}
