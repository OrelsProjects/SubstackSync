import { ArrowRight } from "lucide-react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeInAnimation = {
  initial: { opacity: 0 },
  whileInView: "visible",
  viewport: { once: true },
  animate: { opacity: 1 },
  transition: { duration: 0.4 },
};

export default function Hero() {
  const MarqueeComponent = ({ children }: { children: React.ReactNode }) => (
    <>
      <Marquee speed={20} pauseOnHover className="md:!hidden">
        {children}
      </Marquee>
      <div className="hidden md:flex w-full justify-center">{children}</div>
    </>
  );
  return (
    <section className="relative bg-gradient-to-b from-muted/30 to-background py-20 px-4 sm:px-6 lg:px-8 h-screen flex items-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl leading-[3.4rem] sm:text-7xl sm:leading-[5.5rem] font-extrabold tracking-tight mb-6">
            <p>Add Substack subscribers</p>
            <p>
              to your mailing list
              <span className="relative whitespace-nowrap ml-3 sm:ml-4 md:ml-5">
                <motion.span
                  initial={{ scaleX: 0, transformOrigin: "0 50%" }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 1.25,
                    delay: 0.75,
                    ease: "easeInOut",
                  }}
                  className="absolute -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1  bg-gradient-to-r from-yellow-300 via-yellow-300/90 to-yellow-300/80 rounded-sm"
                />
                <span className="relative">automatically</span>
              </span>
            </p>
          </h1>

          <p className="text-lg sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            No more exports, no more Zapier headaches. 2 minutes setup and SubstackSync makes sure
            every new subscriber is instantly where they belong — your mailing
            list.
          </p>

          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg hover:shadow-xl">
            Start Automating Today
            <ArrowRight className="w-5 h-5" />
          </button>

          <motion.div {...fadeInAnimation} className="w-full mt-16">
            <p className="text-lg text-muted-foreground text-center mb-4">
              Works with:
            </p>
            <MarqueeComponent>
              <div className="w-full flex flex-row justify-between md:justify-center items-center gap-6 md:gap-20 overflow-auto">
                <Image
                  src="/services/kit.png"
                  alt="Kit"
                  width={80}
                  height={30}
                  className="grayscale opacity-50"
                />
              </div>
            </MarqueeComponent>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
