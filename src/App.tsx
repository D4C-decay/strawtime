import { Catalog } from "./components/Catalog";
import { Contact } from "./components/Contact";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HowToOrder } from "./components/HowToOrder";
import { Ribbon } from "./components/Ribbon";
import { Story } from "./components/Story";
import { WhatsAppFab } from "./components/WhatsAppFab";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar a la carta
      </a>

      <Header />

      <main id="contenido" tabIndex={-1}>
        <Hero />
        <Ribbon />
        <Catalog />
        <Story />
        <HowToOrder />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFab />
    </>
  );
}
