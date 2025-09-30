import { motion } from "framer-motion";
import { Undo } from "lucide-react";

const animationProps = {
  initial: { opacity: 0, scale: 1, y: 20 },
  whileInView: "visible",
  viewport: { once: true },
  transition: { duration: 0.6 },
  variants: {
    visible: { opacity: 1, scale: 1, y: 0 },
    hidden: { opacity: 0, scale: 0 },
  },
};
export default function HowItWorks() {
  return (
    <motion.section
      {...animationProps}
      className="w-full"
      id="howItWorks"
    >
      <h2 className="text-3xl font-bold text-center text-primary mb-8">
        How It Works
      </h2>

      <ol className="space-y-4 max-w-5xl mx-auto">
        <li className="flex items-center">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 font-bold">
            1
          </span>

          <span className="text-muted-foreground relative">
            <span>New Substack subscriber signs up to your newsletter</span>

            <Undo className="hidden lg:block absolute h-11 w-11 text-primary top-[2px] -right-12  -scale-x-100 -rotate-[-64deg]" />
          </span>
        </li>

        <li className="flex items-center lg:justify-center">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 font-bold">
            2
          </span>

          <span className="text-muted-foreground relative">
            <span>SubstackSync detects the new subscriber email</span>

            <Undo className="hidden lg:block absolute h-11 w-11 text-primary top-[2px] -right-12  -scale-x-100 -rotate-[-64deg]" />
          </span>
        </li>

        <li className="flex items-center lg:justify-end">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 font-bold">
            3
          </span>

          <span className="text-muted-foreground">
            Subscriber is automatically added to your mailing list 🎉
          </span>
        </li>
      </ol>
    </motion.section>
  );
}
