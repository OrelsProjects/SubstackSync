// app/terms/page.tsx
import React from "react";

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-8">
        Terms of Service & Privacy Policy
      </h1>

      {/* Terms of Service */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
        <p className="mb-4 text-sm text-gray-500">
          Last Updated: 29th September 2025
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">1. Eligibility</h3>
        <p>
          You must be at least 18 years old and legally capable of entering into
          a contract.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          2. Service Description
        </h3>
        <p>
          {`Our app integrates with Gmail to help users manage new subscribers
          from Substack. 
          - We access incoming Substack notification emails via
          Gmail API. 
          - We parse the email body to extract subscriber details
          (name and email), since Substack includes this info only inside the
          message content. 
          - These details are stored securely in our system only
          to provide functionality for the user, such as syncing with their
          email service provider and showing subscriber history inside the app.
          - We do not use this data for any other purpose, nor do we sell or share
          it. 
          - Users can disconnect at any time, which stops data collection and
          removes stored data.`}
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          3. User Responsibilities
        </h3>
        <ul className="list-disc list-inside">
          <li>Comply with GDPR, CCPA, CAN-SPAM, and other laws.</li>
          <li>Have proper consent to transfer subscriber info.</li>
          <li>Ensure accuracy of your integrations.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Acceptable Use</h3>
        <p>
          No spam, unlawful activity, reverse engineering, or system abuse.
          Violations may result in suspension.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          5. Subscription & Payment
        </h3>
        <p>
          Pricing is posted on our website. Fees are billed in advance,
          non-refundable except as required by law.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">6. Data Ownership</h3>
        <p>
          Subscriber data remains your property. We act only as a processor. You
          grant us a limited license to process data solely for providing the
          Service.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          7. Third-Party Services
        </h3>
        <p>
          We integrate with Substack and ESPs. We’re not responsible for their
          availability or policies.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          8. Service Availability
        </h3>
        <p>
          We do not guarantee uptime or error-free operation. Features may be
          modified or suspended at our discretion.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          9. Limitation of Liability
        </h3>
        <p>
          To the fullest extent permitted by law, our liability is limited to
          the fees you paid in the past 12 months.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">10. Indemnification</h3>
        <p>
          You agree to indemnify us from claims arising from your use of the
          Service.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">11. Termination</h3>
        <p>
          We may suspend or terminate your account for violations. You may
          cancel anytime.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">12. Governing Law</h3>
        <p>These Terms are governed by the laws of [Insert Jurisdiction].</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">13. Changes</h3>
        <p>
          We may update these Terms at any time. Continued use means acceptance.
        </p>
      </section>

      {/* Privacy Policy */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
        <p className="mb-4 text-sm text-gray-500">
          Last Updated: [Insert Date]
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          1. Information We Collect
        </h3>
        <ul className="list-disc list-inside">
          <li>Account details: name, email, payment info.</li>
          <li>
            Subscriber details from Substack integrations (transient processing
            only).
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">2. How We Use Info</h3>
        <p>
          To operate syncing, secure accounts, provide support, and improve
          performance.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          3. Data Processing Role
        </h3>
        <p>
          We act as Data Processor for subscriber data. You are the Data
          Controller and must ensure lawful processing.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">4. Data Retention</h3>
        <p>
          We don’t permanently store subscriber lists. Account data is kept
          while active or legally required.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h3>
        <p>
          We use TLS encryption, access controls, and industry-standard
          safeguards.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">6. Sharing</h3>
        <p>
          We share data only with: (i) platforms you connect, (ii) service
          providers, (iii) legal authorities when required.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          7. International Transfers
        </h3>
        <p>
          Your data may be processed in other countries with different data
          protection laws.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">8. Your Rights</h3>
        <p>
          Depending on your location, you may request access, correction,
          deletion, or portability of your personal data.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          9. Children’s Privacy
        </h3>
        <p>
          Not for individuals under 18. We do not knowingly collect children’s
          data.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">10. Changes</h3>
        <p>
          We may update this Policy. You will be notified of material changes.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">11. Contact</h3>
        <p>
          Questions? Email us at{" "}
          <a
            href="mailto:support@substacksync.com"
            className="text-blue-600 underline"
          >
            support@substacksync.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
