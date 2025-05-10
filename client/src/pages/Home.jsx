import Features from "../components/Home/Features";
import Footer from "../components/Home/Footer";
import Hero from "../components/Home/Hero";
import NavBar from "../components/NavBar";

function Home() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,_#B200FF,_black)] ">
      <NavBar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

export default Home;
