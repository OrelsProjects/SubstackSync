import { useState } from "react";
import {
  Mail,
  Users,
  Clock,
  XCircle,
  CheckCircle2,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const slideIn = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function InteractiveDemo() {
  const [isWithTool, setIsWithTool] = useState(false);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          {...fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            See The Difference
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Toggle between manual work and automated bliss
          </p>

          <div className="inline-flex items-center gap-4 bg-card rounded-full p-2 shadow-lg">
            <button
              onClick={() => setIsWithTool(false)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                !isWithTool
                  ? "bg-red-500 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Without SubstackSync
              </span>
            </button>
            <button
              onClick={() => setIsWithTool(true)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                isWithTool
                  ? "bg-green-500 text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                With SubstackSync
              </span>
            </button>
          </div>
        </motion.div>

        <div className="relative">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div
              className={`transform transition-all duration-500 ${
                isWithTool
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 absolute"
              }`}
            >
              {isWithTool && (
                <div className="bg-card rounded-2xl shadow-2xl p-8 border-4 border-green-200">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      <CheckCircle2 className="w-4 h-4" />
                      THE SOLUTION
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Growing your list effortlessly
                    </h3>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-r from-green-50 to-card p-4 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <Mail className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-1">
                            New Subscriber Detected
                          </p>
                          <p className="text-sm text-muted-foreground">
                            sarah.chen@example.com subscribed to your newsletter
                          </p>
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            ✓ Auto-synced to Kit
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-card p-4 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <Mail className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-1">
                            New Subscriber Detected
                          </p>
                          <p className="text-sm text-muted-foreground">
                            mike.taylor@example.com subscribed to your
                            newsletter
                          </p>
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            ✓ Auto-synced to Kit
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-card p-4 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <Mail className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-1">
                            New Subscriber Detected
                          </p>
                          <p className="text-sm text-muted-foreground">
                            james.wilson@example.com subscribed to your
                            newsletter
                          </p>
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            ✓ Auto-synced to Kit
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-xl border-2 border-green-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-green-700" />
                        <span className="font-semibold text-foreground">
                          Your Mailing List
                        </span>
                      </div>
                      <span className="text-3xl font-bold text-green-700">
                        1,247
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        +3 subscribers synced today
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      Time spent managing:{" "}
                      <strong className="text-green-600">0 minutes</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`transform transition-all duration-500 ${
                !isWithTool
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 absolute"
              }`}
            >
              {!isWithTool && (
                <div className="bg-card rounded-2xl shadow-2xl p-8 border-4 border-red-200">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      <XCircle className="w-4 h-4" />
                      THE PROBLEM
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Manually managing subscribers
                    </h3>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-r from-red-50 to-card p-4 rounded-lg border border-red-200">
                      <div className="flex items-start gap-3">
                        <Mail className="w-8 h-8 text-muted-foreground flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-1">
                            Unread Notification
                          </p>
                          <p className="text-sm text-muted-foreground">
                            sarah.chen@example.com subscribed to your newsletter
                          </p>
                          <p className="text-xs text-red-600 mt-1 font-medium">
                            ⚠ Not in your mailing list yet
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-card p-4 rounded-lg border border-red-200">
                      <div className="flex items-start gap-3">
                        <Mail className="w-8 h-8 text-muted-foreground flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-1">
                            Unread Notification
                          </p>
                          <p className="text-sm text-muted-foreground">
                            mike.taylor@example.com subscribed to your
                            newsletter
                          </p>
                          <p className="text-xs text-red-600 mt-1 font-medium">
                            ⚠ Not in your mailing list yet
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-card p-4 rounded-lg border border-red-200">
                      <div className="flex items-start gap-3">
                        <Mail className="w-8 h-8 text-muted-foreground flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-1">
                            Unread Notification
                          </p>
                          <p className="text-sm text-muted-foreground">
                            james.wilson@example.com subscribed to your
                            newsletter
                          </p>
                          <p className="text-xs text-red-600 mt-1 font-medium">
                            ⚠ Not in your mailing list yet
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-100 to-red-50 p-6 rounded-xl border-2 border-red-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-red-700" />
                        <span className="font-semibold text-foreground">
                          Your Mailing List
                        </span>
                      </div>
                      <span className="text-3xl font-bold text-red-700">
                        1,244
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-red-700">
                      <BarChart3 className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Missing 3 new subscribers
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      Time spent this week:{" "}
                      <strong className="text-red-600">~2 hours</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <div
                className={`bg-card rounded-2xl shadow-xl p-8 transition-all duration-500 ${
                  isWithTool
                    ? "border-4 border-green-300"
                    : "border-4 border-red-300"
                }`}
              >
                <h4 className="text-xl font-bold text-foreground mb-6">
                  {isWithTool ? "What You Get" : "What You Deal With"}
                </h4>

                {isWithTool ? (
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Instant Sync
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Every subscriber appears in your mailing list within
                          seconds
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Personalized Automation
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Set unique automations, like tags and segments for
                          each type of subscriber
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Zero Manual Work
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Focus on writing, not copy-pasting emails
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          No Lost Leads
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Every single subscriber is captured and synced
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Peace of Mind
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Set it and forget it automation
                        </p>
                      </div>
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Manual CSV Exports
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Download subscriber list from Substack weekly
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Copy-Paste Hell
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Import emails one by one into your ESP
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Lost Subscribers
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Miss leads between manual syncs
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">
                          Time Wasted
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Spend hours each week on tedious admin work
                        </p>
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          {...fadeInUp}
          className="mt-12 text-center"
        >
          <p className="text-lg text-muted-foreground mb-6">
            {isWithTool
              ? "This is what automation should feel like. Effortless."
              : "Sound familiar? There's a better way."}
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg">
            Stop The Manual Work
          </button>
        </motion.div>
      </div>
    </section>
  );
}
