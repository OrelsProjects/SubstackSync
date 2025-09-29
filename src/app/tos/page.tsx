// app/terms/page.tsx
import React from "react";

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <p className="mb-4 text-sm text-gray-500">
        Last Updated: 29th September 2025
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">1. Eligibility</h2>
      <p>
        You must be at least 18 years old and legally capable of entering into a
        binding contract.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        2. Service Description
      </h2>
      <p>
        SubstackSync connects your Substack account with third-party email
        platforms. When a new subscriber joins your Substack, SubstackSync
        automatically adds that subscriber to your chosen platform. We do not
        sell or rent subscriber data. We process data only to perform the sync
        you authorize.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        3. User Responsibilities
      </h2>
      <ul className="list-disc list-inside">
        <li>Comply with GDPR, CCPA, CAN-SPAM, and other laws.</li>
        <li>Have proper consent to transfer subscriber info.</li>
        <li>Ensure accuracy of your integrations.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-2">4. Acceptable Use</h2>
      <p>
        No spam, unlawful activity, reverse engineering, or abuse of the
        Service. Violations may result in suspension or termination.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        5. Subscription & Payment
      </h2>
      <p>
        Pricing is displayed on our website. Fees are billed in advance,
        non-refundable except as required by law. Failure to pay may result in
        suspension.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">6. Data Ownership</h2>
      <p>
        Subscriber data remains your property. We act only as a processor. You
        grant us a limited license to process data solely for providing the
        Service.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        7. Third-Party Services
      </h2>
      <p>
        We integrate with Substack and ESPs. We are not responsible for their
        availability, actions, or policies.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        8. Service Availability
      </h2>
      <p>
        We do not guarantee uninterrupted or error-free operation. Features may
        be modified, suspended, or discontinued at our discretion.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">
        9. Limitation of Liability
      </h2>
      <p>
        To the fullest extent permitted by law, our liability is limited to the
        fees you paid in the past 12 months.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">10. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless SubstackSync, its affiliates,
        and employees against claims arising from your use of the Service.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">11. Termination</h2>
      <p>
        We may suspend or terminate your account for violations of these Terms.
        You may cancel your subscription at any time.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">12. Changes</h2>
      <p>
        We may update these Terms at any time. Continued use of the Service
        after changes take effect means acceptance.
      </p>
    </main>
  );
}
