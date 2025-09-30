import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Check, X, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const TriangleTooltip = () => (
  <TooltipProvider>
    <Tooltip delayDuration={50}>
      <TooltipContent>
        <span>
          Technically &apos;no-code,&apos; but you&apos;ll often need regex
          filters, JSON paths, or scripting steps to get Substack data parsed
          correctly.
        </span>
      </TooltipContent>
      <TooltipTrigger>
        <AlertTriangle className="w-6 h-6 text-muted-foreground mx-auto" />
      </TooltipTrigger>
    </Tooltip>
  </TooltipProvider>
);

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function Comparison() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          {...fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            SubstackSync vs. The Rest
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for Substack creators, not general automation
          </p>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-card rounded-xl shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-muted">
                <th className="text-left p-4 sm:p-6 text-muted-foreground font-semibold">
                  Feature
                </th>
                <th className="p-4 sm:p-6 text-foreground font-bold bg-primary/10">
                  SubstackSync
                </th>
                <th className="p-4 sm:p-6 text-muted-foreground font-semibold">
                  Make.com
                </th>
                <th className="p-4 sm:p-6 text-muted-foreground font-semibold">
                  Zapier
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-4 sm:p-6 text-muted-foreground font-medium">
                  Purpose-built for Substack
                </td>
                <td className="p-4 sm:p-6 text-center bg-primary/10">
                  <Check className="w-6 h-6 text-primary mx-auto" />
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <X className="w-6 h-6 text-destructive mx-auto" />
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <X className="w-6 h-6 text-destructive mx-auto" />
                </td>
              </tr>
              <tr className="bg-muted/50">
                <td className="p-4 sm:p-6 text-muted-foreground font-medium">
                  Setup time
                </td>
                <td className="p-4 sm:p-6 text-center bg-primary/10">
                  <span className="text-primary font-semibold">
                    Under 2 min
                  </span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <span className="text-muted-foreground font-semibold">
                    hours
                  </span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <span className="text-muted-foreground font-semibold">
                    hours
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-6 text-muted-foreground font-medium">
                  No-code required
                </td>
                <td className="p-4 sm:p-6 text-center bg-primary/10">
                  <Check className="w-6 h-6 text-primary mx-auto" />
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <TriangleTooltip />
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <TriangleTooltip />
                </td>
              </tr>
              <tr className="bg-muted/50">
                <td className="p-4 sm:p-6 text-muted-foreground font-medium">
                  Starting cost
                </td>
                <td className="p-4 sm:p-6 text-center bg-primary/10">
                  <span className="text-primary font-semibold">$10/month</span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <span className="text-muted-foreground font-semibold">
                    Higher for volume
                  </span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <span className="text-muted-foreground font-semibold">
                    Higher for volume
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-6 text-muted-foreground font-medium">
                  Reliability
                </td>
                <td className="p-4 sm:p-6 text-center bg-primary/10">
                  <span className="text-sm text-primary font-medium">
                    Direct detection
                  </span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <span className="text-sm text-muted-foreground">
                    Depends on scenarios
                  </span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <span className="text-sm text-muted-foreground">
                    Depends on zaps
                  </span>
                </td>
              </tr>
              <tr className="bg-muted/50">
                <td className="p-4 sm:p-6 text-muted-foreground font-medium">
                  Support for ESPs
                </td>
                <td className="p-4 sm:p-6 text-center bg-primary/10">
                  <span className="text-sm text-primary font-medium">
                    Newsletter-focused
                  </span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <span className="text-sm text-muted-foreground">
                    Broad connectors
                  </span>
                </td>
                <td className="p-4 sm:p-6 text-center">
                  <span className="text-sm text-muted-foreground">
                    Broad connectors
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <motion.div 
          {...fadeInUp}
          className="text-center mt-12"
        >
          <p className="text-xl font-semibold text-foreground">
            SubstackSync: Built for writers, not automation nerds.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
