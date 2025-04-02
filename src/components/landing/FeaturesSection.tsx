
import { FileText, Pen, Heart, Clock, Share2, HelpCircle } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: <FileText className="w-8 h-8 text-mindway-primary" />,
      title: "Rich Text Notes",
      description: "Create structured, categorized notes with custom types and color coding."
    },
    {
      icon: <Pen className="w-8 h-8 text-mindway-primary" />,
      title: "Handwritten Notes",
      description: "Draw, sketch, or write naturally with stylus support for a more personal touch."
    },
    {
      icon: <Clock className="w-8 h-8 text-mindway-primary" />,
      title: "Session Timeline",
      description: "See the complete chronological flow of your session with automatic timestamps."
    },
    {
      icon: <Heart className="w-8 h-8 text-mindway-primary" />,
      title: "Therapy Tools",
      description: "Access evidence-based exercises and activities for more effective sessions."
    },
    {
      icon: <Share2 className="w-8 h-8 text-mindway-primary" />,
      title: "Client Sharing",
      description: "Seamlessly share exercises with clients via secure links, no app required."
    },
    {
      icon: <HelpCircle className="w-8 h-8 text-mindway-primary" />,
      title: "Guided Sessions",
      description: "Follow structured session flows or create your own custom approaches."
    }
  ];

  return (
    <section className="py-16 bg-mindway-gray">
      <div className="mindway-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Designed for therapists, by therapists</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mindway combines the flexibility of a physical notebook with the power of digital tools to enhance your therapy practice.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-4 p-3 bg-mindway-primary/10 inline-block rounded-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
