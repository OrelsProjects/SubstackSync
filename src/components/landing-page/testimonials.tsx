import { User } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "As a Substack writer, I was tired of losing leads — now they're all in my list automatically.",
      author: "Sarah M.",
      role: "Newsletter Creator",
    },
    {
      quote:
        "Zapier took me an hour to set up and kept breaking. SubstackSync just worked.",
      author: "James T.",
      role: "Content Writer",
    },
    {
      quote:
        "I can finally focus on writing instead of wrestling with automation tools. Game changer.",
      author: "Alex R.",
      role: "Indie Author",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            What Writers Are Saying
          </h2>
          <p className="text-lg text-muted-foreground">
            Real feedback from creators who automated their workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-border"
            >
              <div className="mb-6">
                <p className="text-muted-foreground leading-relaxed italic">
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
