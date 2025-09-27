"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Poppins } from "@/utils/fonts";
import { cn } from "@/lib/utils";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Loader, Mail, Undo, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import Marquee from "react-fast-marquee";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const fadeInAnimation = {
  initial: { opacity: 0 },
  whileInView: "visible",
  viewport: { once: true },
  animate: { opacity: 1 },
  transition: { duration: 0.4 },
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
      "Currently, SubstackSync integrates with Substack, and email marketing tools including Mailchimp, ActiveCampaign, HubSpot, Sendinblue, and Constant Contact.<br/> We are will continually add more integrations based on user feedback.",
  },
  {
    question:
      "Do I need any technical skills or coding knowledge to use SubstackSync?",
    answer:
      "No technical skills or coding knowledge are required. SubstackSync is designed to be user-friendly with an intuitive interface. Setting up integrations is as simple as a few clicks, and we provide step-by-step guides to assist you.",
  },
  {
    question: "How secure is SubstackSync?",
    answer:
      "We take data security very seriously. SubstackSync will never read private emails. We only read emails from Substack to detect new subscribers. We do not store any content for personal use.",
  },
  {
    question:
      "Will SubstackSync interfere with my existing workflows or tools?",
    answer:
      "No, SubstackSync is designed to enhance your existing workflows, not disrupt them. It operates in the background, automating subscriber additions without requiring changes to your current processes or tools.",
  },
  {
    question: "How often does SubstackSync sync new subscribers?",
    answer:
      "SubstackSync syncs new subscribers in real-time or near real-time. As soon as a subscriber signs up on your content platform, they are automatically added to your specified mailing list.",
  },
];

const reviews = [
  {
    name: "Anfernee",
    text: "Anfernee is a solopreneur who has helped over 15,000 fellow solopreneurs.",
    about:
      "Helping more than 15,000 solopreneurs get more done and earn more with Notion and AI solutions | Post about solopreneurship, productivity, Notion and AI.",
    img: "/reviews/anfernee.jpg",
    url: "https://substack.com/@anferneeck",
  },
  {
    name: "David Mcllroy",
    text: "With over 13,000 subscribers, David is interested in the product.",
    about:
      "I help writers make a living from their words. ✍️ Constantly experimenting, always transparent. Full-time solopreneur, writer and newsletter growth nerd. Lives in Northern Ireland.",
    img: "/reviews/david-mcllroy.jpg",
    url: "https://substack.com/@thedavidmcilroy",
  },
  {
    name: "Maya Sayvanova",
    text: "I'm absolutely interested in SubstackSync! It will make our lives much easier.",
    about:
      "6-Figure Writer & Marketing Strategist | Featured in Business Insider | Blogger with 250K views",
    img: "/reviews/maya-sayvanova.jpg",
    url: "https://substack.com/@mayasayvanova",
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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const loadingRef = useRef<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (loadingRef.current) return;
    e.preventDefault();
    try {
      loadingRef.current = true;
      setLoading(true);
      await axios.post("/api/register", { email });
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

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

  const scrollToInput = () => {
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
    // wait 400ms for the scroll to complete before focusing
    setTimeout(() => inputRef.current?.querySelector("input")?.focus(), 600);
  };

  const MarqueeComponent = ({ children }: { children: React.ReactNode }) => (
    <>
      <Marquee speed={20} pauseOnHover className="md:!hidden">
        {children}
      </Marquee>
      <div className="hidden md:flex w-full justify-center">{children}</div>
    </>
  );

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background via-background to-muted text-foreground flex flex-col items-center justify-start relative overflow-x-hidden py-8 pb-4",
        Poppins.className
      )}
    >
      {/* Abstract background shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 left-1/3 w-1/2 h-1/2 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="w-full bg-background/80 backdrop-blur-md shadow-md z-50 fixed top-0 left-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold text-primary">SubstackSync</span>
          </Link>
          <nav className="hidden md:flex md:items-center space-x-6">
            <Link
              href="#features"
              onClick={(e) => scrollToSection(e, "howItWorks")}
              className="text-muted-foreground hover:text-primary"
            >
              How it works
            </Link>
            <Link
              href="#FAQ"
              onClick={(e) => scrollToSection(e, "FAQ")}
              className="text-muted-foreground hover:text-primary"
            >
              FAQ
            </Link>
            <Link
              href="#interested"
              onClick={(e) => scrollToSection(e, "interested")}
              className="text-muted-foreground hover:text-primary"
            >
              Who&apos;s Interested
            </Link>
            <Button
              onClick={() => window.location.href = '/login'}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Get Started
            </Button>
          </nav>
          <Button
            onClick={() => window.location.href = '/login'}
            className="md:hidden bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Get Started
          </Button>
        </div>
      </header>

      <div className="container mx-auto z-10 flex flex-col items-center space-y-20 mt-24 px-4 sm:px-8">
        {/* Hero Section with CTA */}
        <motion.section
          {...fadeInAnimation}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl leading-[3.4rem] sm:text-5xl sm:leading-[4rem] font-extrabold tracking-tight mb-6">
            <span>Add Substack subscribers to your mailing list</span>
            <span className="relative whitespace-nowrap ml-3 sm:ml-4 md:ml-5">
              <motion.span
                // Animate fill, as if it starts from the left and fills all the way to the right. Anchor - left
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
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            SubstackSync automates your subscriber workflow, allowing content
            creators to focus on what matters most - creating exceptional
            content.
          </p>
          <Button
            onClick={() => window.location.href = '/login'}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-7 py-6"
          >
            Start Automating Today <ArrowRight className="ml-0 !h-5 !w-5" />
          </Button>
        </motion.section>

        {/* Companies Marquee */}
        <motion.section {...fadeInAnimation} className="w-full">
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
        </motion.section>

        {/* Features Section */}
        <motion.section {...animationProps} className="w-full" id="features">
          <h2 className="text-3xl font-bold text-center text-primary mb-8">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Automatic List Updates",
                description:
                  "New subscribers are added instantly without manual input",
              },
              {
                title: "Multi-Platform Integration",
                description:
                  "Seamlessly works with Mailchimp, ActiveCampaign, and more",
              },
              {
                title: "Time-Saving Automation",
                description: "Eliminate manual data entry and reduce errors",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-card/20 backdrop-filter backdrop-blur-lg bg-opacity-20 border border-border shadow-xl rounded-xl overflow-hidden"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-primary">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section {...animationProps} className="w-full" id="howItWorks">
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

        {/* Interested Users Section */}
        {/* <motion.section
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          className="mt-16"
          id="interested"
        >
          <h2 className="text-3xl font-bold text-center text-primary mb-8">
            Who&apos;s Interested
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div key={index} variants={testimonialAnimation}>
                <Card className="h-full bg-card/20 backdrop-filter backdrop-blur-lg bg-opacity-20 border border-border shadow-xl rounded-xl overflow-hidden">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <Image
                        src={review.img}
                        alt={review.name}
                        width={60}
                        height={60}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{review.name}</h3>
                        <a
                          href={review.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          View Profile
                        </a>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 flex-grow">
                      {review.text}
                    </p>
                    <p className="text-sm text-muted-foreground/80 italic">
                      {review.about}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section> */}

        <FAQSection />

        {/* Get Early Access Section */}
        <motion.section
          ref={inputRef}
          {...animationProps}
          className="w-full max-w-md mb-16"
        >
          <Card className="bg-card/20 backdrop-filter backdrop-blur-lg bg-opacity-20 border border-border shadow-xl rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">
                Get Early Access
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Be among the first to revolutionize your workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 border-border text-foreground placeholder-muted-foreground"
                  />
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {loading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" /> Join the Waitlist
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="mr-2 h-6 w-6" />
                    <span className="text-lg font-semibold">
                      Thank you for your interest!
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    We&apos;ll keep you updated on our launch.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Footer */}
        <motion.footer {...fadeInAnimation} className="text-center mb-8">
          <p className="text-sm text-muted-foreground">
            Supercharge your content creation workflow with our automated
            subscriber management tool.
          </p>
          <div className="flex items-center justify-center mt-2 text-primary">
            <Zap className="mr-1 h-4 w-4" />
            <span className="font-semibold">Built for Substack!</span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
