
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="py-20 md:py-28 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl">
        A smarter way to run your therapy sessions
      </h1>
      <p className="text-gray-600 text-lg md:text-xl max-w-xl mb-8">
        Mindway helps therapists create structured, engaging, and effective sessions with intuitive digital tools.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <Button asChild size="lg" className="min-w-40">
          <Link to="/demo/session/prep">
            Try Live Session Demo <ArrowRight size={16} className="ml-2" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="min-w-40">
          <Link to="/dashboard">
            Enter App
          </Link>
        </Button>
      </div>
    </section>
  );
};
