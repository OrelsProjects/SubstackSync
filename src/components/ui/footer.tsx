import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Information */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="text-2xl font-bold text-primary">
                SubstackSync
              </span>
            </div>

            <p className="text-sm text-muted-foreground max-w-sm">
              SubstackSync automates your subscriber workflow, allowing content
              creators to focus on what matters most - creating exceptional
              content. Save time, increase engagement, and grow your audience
              with our powerful automation tools.
            </p>

            {/* Social Media Icons */}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SubstackSync. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link
                href="/tos"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              {/* Email: support@substacksync.com */}
              <Link
                href="mailto:support@substacksync.com"
                className="hover:text-primary transition-colors"
              >
                Contact me
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
