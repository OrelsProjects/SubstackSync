import { ArrowRight, Shield, Lock, CheckCircle } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-6">
          Substack growth is hard.
          <br />
          Syncing subscribers shouldn&apos;t be.
        </h2>

        <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
          Start automating your subscriber sync today and never lose a lead
          again.
        </p>

        <button className="inline-flex items-center gap-2 bg-background text-primary px-10 py-5 rounded-lg text-xl font-semibold hover:bg-background/90 transition-all hover:scale-105 shadow-2xl mb-12">
          Start Automating Today
          <ArrowRight className="w-6 h-6" />
        </button>

        <div className="flex flex-wrap justify-center items-center gap-8 text-primary-foreground/80">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Secure Gmail API</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <span className="text-sm font-medium">GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">99.9% Uptime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
