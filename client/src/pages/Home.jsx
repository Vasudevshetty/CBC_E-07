import Features from "../components/Home/Features";
import Hero from "../components/Home/Hero";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,_#B200FF,_black)] ">
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}

export default Home;
