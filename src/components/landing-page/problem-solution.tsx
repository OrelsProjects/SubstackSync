import { AlertCircle, CheckCircle } from "lucide-react";

export default function ProblemSolution() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why SubstackSync Exists
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-xl shadow-sm border border-destructive/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  The Problem
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Growing on Substack is great — until you realize your new fans
                  aren&apos;t landing in your email tool. Most creators hack together
                  clunky automations or spend hours copy-pasting subscriber
                  lists.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-xl shadow-sm border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  The Solution
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  SubstackSync does it instantly. No setup drama. No
                  babysitting. Every subscriber flows from Substack to your
                  mailing list automatically, so you can focus on writing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
