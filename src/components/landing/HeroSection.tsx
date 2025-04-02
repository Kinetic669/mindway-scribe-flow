
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="mindway-container">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 bg-gradient-to-r from-mindway-primary to-mindway-primary/70 bg-clip-text text-transparent">
            Therapy sessions reimagined
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your therapy practice with our intuitive, mobile-first digital notebook for more structured, effective live sessions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base h-12 px-8">
              <Link to="/demo/session">Try Live Session Demo</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base h-12 px-8">
              <Link to="/dashboard">Enter Therapist App</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
