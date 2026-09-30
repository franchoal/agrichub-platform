import HeroSection from "./components/HeroSection";
import AboutAgricWiseSection from "./components/AboutAgricWiseSection";
import ServicesSection from "./components/ServicesSection";
import CommunityPreviewSection from "./components/CommunityPreviewSection";
import EcosystemSection from "./components/EcosystemSection";
import FinalCTASection from "./components/FinalCTASection";
import Footer from "../../components/common/Footer";

function LandingPage() {
return ( <main className="min-h-screen overflow-x-hidden bg-white"> <HeroSection /> <AboutAgricWiseSection /> <ServicesSection /> <CommunityPreviewSection /> <EcosystemSection /> <FinalCTASection /> <Footer /> </main>
);
}

export default LandingPage;
