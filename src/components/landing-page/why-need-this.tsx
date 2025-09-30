import { motion } from "framer-motion";
import { 
  Users, 
  Target, 
  Zap, 
  BarChart3, 
  ShoppingCart, 
  Shield,
  ArrowRight 
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true }
};

const reasons = [
  {
    icon: Users,
    title: "Own Your Audience",
    description: "Substack is great, but your list lives inside their system. If you ever want to move platforms or run parallel campaigns, you'll need those emails in your own tool."
  },
  {
    icon: Target,
    title: "Advanced Segmentation & Targeting",
    description: "Want to send emails only to your paid subs, or only to free readers who clicked last week? ESPs like Kit, Mailchimp, or ActiveCampaign let you filter, tag, and slice your list however you want."
  },
  {
    icon: Zap,
    title: "Automations You Can't Do in Substack",
    description: "Welcome sequences, re-engagement campaigns, abandoned cart flows — Substack can't handle these. ESPs are built for automation that grows sales and keeps readers engaged."
  },
  {
    icon: BarChart3,
    title: "Better Analytics",
    description: "Substack statistics are minimal at best. ESPs let you track subscriber behavior across all your campaigns, products, and funnels."
  },
  {
    icon: ShoppingCart,
    title: "Sell Beyond Substack",
    description: "Got a course, product, or service outside Substack? ESPs are built for multi-channel selling — emails, SMS, retargeting, and more."
  },
  {
    icon: Shield,
    title: "Future-Proof Your Business",
    description: "Platforms change. Rules change. Deliverability changes. By syncing subscribers automatically, you're not locked into one ecosystem. You're in control."
  }
];

export default function WhyNeedThis() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          {...fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Do I Need This?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            If you&apos;re thinking &quot;Substack already sends my emails, why bother syncing?&quot; — here&apos;s why smart creators use an ESP (Email Service Provider) alongside Substack:
          </p>
        </motion.div>

        <motion.div 
          {...staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              {...fadeInUp}
              className="bg-card p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-border group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <reason.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          {...fadeInUp}
          className="text-center bg-gradient-to-br from-primary/5 to-card p-12 rounded-2xl border border-primary/20"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Don&apos;t just write on Substack. Build an audience you truly own.
          </h3>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg">
            Start Automating Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
