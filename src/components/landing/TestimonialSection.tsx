
export const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "Mindway has completely transformed how I conduct sessions. The ability to take rich notes while keeping the client engaged is invaluable.",
      author: "Dr. Sarah Chen",
      role: "Clinical Psychologist"
    },
    {
      quote: "The session timeline feature helps me track progress and themes over time. It's like having a research assistant during every session.",
      author: "Michael Rivera, LMFT",
      role: "Family Therapist"
    },
    {
      quote: "My clients love the interactive tools, and being able to share exercises directly to their devices has improved homework completion rates.",
      author: "Jessica Taylor",
      role: "CBT Specialist"
    }
  ];

  return (
    <section className="py-16">
      <div className="mindway-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What therapists are saying</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from professionals who have integrated Mindway into their practice.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-4 text-4xl text-mindway-primary">"</div>
              <p className="text-gray-700 mb-6 italic">{testimonial.quote}</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
