"use client";

import Header from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";
import HowItWorks from "@/components/landing-page/how-it-works";
import ProblemSolution from "@/components/landing-page/problem-solution";
import Comparison from "@/components/landing-page/comparison";
import Testimonials from "@/components/landing-page/testimonials";
import Pricing from "@/components/landing-page/pricing";
import FAQ from "@/components/landing-page/faq";
import FinalCTA from "@/components/landing-page/final-cta";
import WhyNeedThis from "@/components/landing-page/why-need-this";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Footer } from "@/components/ui/footer";
import { cn } from "@/lib/utils";
import InteractiveDemo from "@/components/landing-page/interactive-demo";

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

const testimonialAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const faqItems = [
  {
    question: "What is SubstackSync?",
    answer:
      "SubstackSync is an automated subscriber management tool designed for content creators. <br/>It automatically adds new subcribers from your Substack to your email marketing tool.",
  },
  {
    question: "How does SubstackSync work?",
    answer:
      "SubstackSync detects when a new subscriber directly from your Gmail.<br/> It then automatically adds the subscriber's email to your chosen mailing list in your email marketing tool.",
  },
  {
    question: "Which platforms does SubstackSync integrate with?",
    answer:
      "Currently, SubstackSync integrates with Substack and Kit (ConvertKit). I'll add more integrations based on user feedback.",
  },
  {
    question:
      "Do I need any technical skills or coding knowledge to use SubstackSync?",
    answer:
      "No technical skills or coding knowledge are required. SubstackSync is dead simple to use. Try it, you'll see.",
  },
  {
    question: "How secure is SubstackSync?",
    answer:
      "I take data security very seriously. SubstackSync will never read private emails. It only reads emails from Substack to detect new subscribers. I do not store any content for personal use.",
  },
  {
    question: "How often does SubstackSync sync new subscribers?",
    answer:
      "SubstackSync syncs new subscribers in real-time. As soon as a subscriber signs up on your content platform, they are automatically added to your specified mailing list.",
  },
];

function FAQSection() {
  return (
    <motion.section
      id="FAQ"
      {...animationProps}
      className="w-full max-w-3xl mx-auto my-20"
    >
      <h2 className="text-3xl font-bold text-center text-primary mb-8">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p dangerouslySetInnerHTML={{ __html: item.answer }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
}

export default function Home() {
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    section: string
  ) => {
    e.preventDefault(); // Prevent default anchor behavior

    const targetElement = document.getElementById(section);

    if (targetElement) {
      const offsetPosition = targetElement.offsetTop - 100;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const containerClassName = (odd: boolean, className?: string) =>
    cn("py-12 md:py-20", odd ? "bg-primary/10" : "bg-background", className);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div id="interactive-demo" className={containerClassName(true)}>
          <InteractiveDemo />
        </div>
        <div id="how-it-works" className={containerClassName(true)}>
          <HowItWorks />
        </div>
        <div id="why-need-this" className={containerClassName(false)}>
          <WhyNeedThis />
        </div>
        {/* <div id="problem-solution" className={containerClassName(true)}>
          <ProblemSolution />
        </div> */}
        <div id="comparison" className={containerClassName(false)}>
          <Comparison />
        </div>
        {/* <div id="testimonials" className={containerClassName(true)}>
          <Testimonials />
        </div> */}
        <div
          id="pricing"
          className={containerClassName(
            false,
            "bg-gradient-to-b from-primary/5 to-background"
          )}
        >
          <Pricing />
        </div>
        <div id="faq" className={containerClassName(true)}>
          <FAQ />
        </div>
        {/* <div id="final-cta" className={containerClassName(false)}>
          <FinalCTA />
        </div> */}
      </main>
      <Footer />
    </div>
  );
}
//   return (
//     <div
//       className={cn(
//         "min-h-screen bg-gradient-to-br from-background via-background to-muted text-foreground flex flex-col items-center justify-start relative overflow-x-hidden py-8 pb-4",
//         Poppins.className
//       )}
//     >
//       {/* Abstract background shapes */}
//       <div className="absolute inset-0 z-0 overflow-hidden">
//         <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//         <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//         <div className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Header */}
//       <header className="w-full bg-background/80 backdrop-blur-md shadow-md z-50 fixed top-0 left-0">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <Link href="/" className="flex items-center space-x-2">
//             <Image src="/logo.png" alt="Logo" width={40} height={40} />
//             <span className="text-xl font-bold text-primary">SubstackSync</span>
//           </Link>
//           <nav className="hidden md:flex md:items-center space-x-6">
//             <Link
//               href="#features"
//               onClick={(e) => scrollToSection(e, "howItWorks")}
//               className="text-muted-foreground hover:text-primary"
//             >
//               How it works
//             </Link>
//             <Link
//               href="#FAQ"
//               onClick={(e) => scrollToSection(e, "FAQ")}
//               className="text-muted-foreground hover:text-primary"
//             >
//               FAQ
//             </Link>
//             <Button
//               onClick={() => window.location.href = '/login'}
//               className="bg-primary hover:bg-primary/90 text-primary-foreground"
//             >
//               Get Started
//             </Button>
//           </nav>
//           <Button
//             onClick={() => window.location.href = '/login'}
//             className="md:hidden bg-primary hover:bg-primary/90 text-primary-foreground"
//           >
//             Get Started
//           </Button>
//         </div>
//       </header>

//       <div className="container mx-auto z-10 flex flex-col items-center space-y-20 mt-24 px-4 sm:px-8">
//         {/* Hero Section with CTA */}
//         <motion.section
//           {...fadeInAnimation}
//           className="text-center max-w-3xl mx-auto"
//         >
//           <h1 className="text-4xl leading-[3.4rem] sm:text-5xl sm:leading-[4rem] font-extrabold tracking-tight mb-6">
//             <span>Add Substack subscribers to your mailing list</span>
//             <span className="relative whitespace-nowrap ml-3 sm:ml-4 md:ml-5">
//               <motion.span
//                 // Animate fill, as if it starts from the left and fills all the way to the right. Anchor - left
//                 initial={{ scaleX: 0, transformOrigin: "0 50%" }}
//                 animate={{ scaleX: 1 }}
//                 transition={{
//                   duration: 1.25,
//                   delay: 0.75,
//                   ease: "easeInOut",
//                 }}
//                 className="absolute -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1  bg-gradient-to-r from-yellow-300 via-yellow-300/90 to-yellow-300/80 rounded-sm"
//               />
//               <span className="relative">automatically</span>
//             </span>
//           </h1>
//           <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
//             SubstackSync automates your subscriber workflow, allowing content
//             creators to focus on what matters most - creating exceptional
//             content.
//           </p>
//           <Button
//             onClick={() => window.location.href = '/login'}
//             className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-7 py-6"
//           >
//             Start Automating Today <ArrowRight className="ml-0 !h-5 !w-5" />
//           </Button>
//         </motion.section>

//         {/* Companies Marquee */}
//         <motion.section {...fadeInAnimation} className="w-full">
//           <p className="text-lg text-muted-foreground text-center mb-4">
//             Works with:
//           </p>
//           <MarqueeComponent>
//           <div className="w-full flex flex-row justify-between md:justify-center items-center gap-6 md:gap-20 overflow-auto">
//               <Image
//                 src="/services/kit.png"
//                 alt="Kit"
//                 width={80}
//                 height={30}
//                 className="grayscale opacity-50"
//               />
//             </div>
//           </MarqueeComponent>
//         </motion.section>

//         {/* Features Section */}
//         <motion.section {...animationProps} className="w-full" id="features">
//           <h2 className="text-3xl font-bold text-center text-primary mb-8">
//             Key Features
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 title: "Automatic List Updates",
//                 description:
//                   "New subscribers are added instantly without manual input",
//               },
//               {
//                 title: "Multi-Platform Integration",
//                 description:
//                   "Seamlessly works with Mailchimp, ActiveCampaign, and more",
//               },
//               {
//                 title: "Time-Saving Automation",
//                 description: "Eliminate manual data entry and reduce errors",
//               },
//             ].map((feature, index) => (
//               <Card
//                 key={index}
//                 className="bg-card/20 backdrop-filter backdrop-blur-lg bg-opacity-20 border border-border shadow-xl rounded-xl overflow-hidden"
//               >
//                 <CardHeader>
//                   <CardTitle className="text-xl text-primary">
//                     {feature.title}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground">{feature.description}</p>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </motion.section>

//         {/* How It Works Section */}
//         <motion.section {...animationProps} className="w-full" id="howItWorks">
//           <h2 className="text-3xl font-bold text-center text-primary mb-8">
//             How It Works
//           </h2>
//           <ol className="space-y-4 max-w-5xl mx-auto">
//             <li className="flex items-center">
//               <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 font-bold">
//                 1
//               </span>
//               <span className="text-muted-foreground relative">
//                 <span>New Substack subscriber signs up to your newsletter</span>
//                 <Undo className="hidden lg:block absolute h-11 w-11 text-primary top-[2px] -right-12  -scale-x-100 -rotate-[-64deg]" />
//               </span>
//             </li>
//             <li className="flex items-center lg:justify-center">
//               <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 font-bold">
//                 2
//               </span>
//               <span className="text-muted-foreground relative">
//                 <span>SubstackSync detects the new subscriber email</span>
//                 <Undo className="hidden lg:block absolute h-11 w-11 text-primary top-[2px] -right-12  -scale-x-100 -rotate-[-64deg]" />
//               </span>
//             </li>
//             <li className="flex items-center lg:justify-end">
//               <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 font-bold">
//                 3
//               </span>
//               <span className="text-muted-foreground">
//                 Subscriber is automatically added to your mailing list 🎉
//               </span>
//             </li>
//           </ol>
//         </motion.section>

//         <FAQSection />

//         {/* Hero Footer */}
//         <motion.footer {...fadeInAnimation} className="text-center mb-8">
//           <p className="text-sm text-muted-foreground">
//             Supercharge your content creation workflow with our automated
//             subscriber management tool.
//           </p>
//           <div className="flex items-center justify-center mt-2 text-primary">
//             <Zap className="mr-1 h-4 w-4" />
//             <span className="font-semibold">Built for Substack!</span>
//           </div>
//         </motion.footer>
//       </div>

//       {/* Main Site Footer */}
//       <Footer />
//     </div>
//   );
// }
