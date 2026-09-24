import Hero from '../components/home/Hero.jsx';
import Categories from '../components/home/Categories.jsx';
import HowItWorks from '../components/home/HowItWorks.jsx';
import FeaturedListings from '../components/home/FeaturedListings.jsx';
import EarningsCalculator from '../components/home/EarningsCalculator.jsx';
import Safety from '../components/home/Safety.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import Faq from '../components/home/Faq.jsx';
import CtaBanner from '../components/home/CtaBanner.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <HowItWorks />
      <FeaturedListings />
      <EarningsCalculator />
      <Safety />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  );
}
