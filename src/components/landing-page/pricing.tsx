import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: 0.2 }
};

export default function Pricing() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          {...fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, Predictable Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            No surprises. No price spikes as you grow.
          </p>
        </motion.div>

        <motion.div 
          {...scaleIn}
          className="max-w-lg mx-auto"
        >
          <div className="bg-gradient-to-br from-primary/5 to-card p-8 rounded-2xl shadow-xl border-2 border-primary/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Starter Plan
              </h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-primary">$10</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Up to 1,000 subscribers synced per month
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Instant synchronization</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">All major ESPs supported</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Email support</span>
              </li>
            </ul>

            <button className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center mt-6 text-muted-foreground">
              Need more?{" "}
              <a
                href="#"
                className="text-primary hover:underline font-semibold"
              >
                Contact us
              </a>{" "}
              for custom plans
            </p>
          </div>

          <motion.div 
            {...fadeInUp}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground">
              Predictable cost compared to Zapier/Make, where it skyrockets with
              volume
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
