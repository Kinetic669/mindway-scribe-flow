
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-16 bg-mindway-primary">
      <div className="mindway-container">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your therapy practice?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of therapists using Mindway to improve client engagement and session outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-mindway-primary text-base h-12 px-8">
              <Link to="/demo/session">Try Live Session Demo</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-base h-12 px-8">
              <Link to="/dashboard">Enter Therapist App</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
