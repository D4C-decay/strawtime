import { Catalog } from "./components/Catalog";
import { Contact } from "./components/Contact";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HowToOrder } from "./components/HowToOrder";
import { Interlude } from "./components/Interlude";
import { Ribbon } from "./components/Ribbon";
import { Story } from "./components/Story";
import { WhatsAppFab } from "./components/WhatsAppFab";
import { BorderGlow } from "./components/reactbits/BorderGlow";
import { ClickSpark } from "./components/reactbits/ClickSpark";

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
        <Interlude />
        <HowToOrder />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <WhatsAppFab />
      <BorderGlow />
      <ClickSpark />
    </>
  );
}
