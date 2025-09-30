export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        Last Updated 30 September 2025
      </p>

      {/* Overview */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Overview</h2>
        <p className="mb-4">
          SubstackSync connects to your Google account to read Substack
          notification emails in order to detect new subscribers, extract their
          name and email, and sync them to the email service providers you
          choose. This policy explains what we access, how we use it, how we
          share it, how we protect it, and how you can control it.
        </p>
      </section>

      {/* Data Accessed */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Data Accessed</h2>
        <p className="mb-3">Via the Gmail API we access only the following:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Email metadata from Substack notification emails (subject, sender,
            timestamp).
          </li>
          <li>
            Email body content strictly to extract subscriber name and email
            address.
          </li>
          <li>
            Google account email address used for authentication and linking
            your SubstackSync account.
          </li>
        </ul>
        <p className="mt-4">
          We do not access Gmail messages unrelated to Substack notifications,
          nor do we access your contacts, calendars, or Google Drive files.
        </p>
      </section>

      {/* Data Usage */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Data Usage</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Identify new Substack subscribers from your incoming Substack
            notification emails.
          </li>
          <li>
            Extract subscriber name and email for syncing to your connected
            email service provider.
          </li>
          <li>
            Display subscriber history and subscription events in your
            SubstackSync dashboard.
          </li>
          <li>Authenticate your account and secure access.</li>
        </ul>
        <p className="mt-4">
          We do not use Gmail data for advertising, profiling, or unrelated
          purposes.
        </p>
      </section>

      {/* Data Sharing */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Data Sharing</h2>
        <p className="mb-3">
          We never sell or rent your data. We share data only in these cases:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>With the email service providers you explicitly connect.</li>
          <li>
            With hosting and infrastructure providers that support our service
            under strict agreements.
          </li>
          <li>If required by law or to protect our rights.</li>
        </ul>
      </section>

      {/* Storage and Protection */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          Data Storage and Protection
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Data is stored in databases protected by authentication and access
            controls.
          </li>
          <li>Access to production systems is restricted and monitored.</li>
          <li>API tokens are stored securely and rotated when necessary.</li>
          <li>
            We implement reasonable technical and organizational measures to
            protect your data against unauthorized access or loss.
          </li>
        </ul>
      </section>

      {/* Retention and Deletion */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">
          Data Retention and Deletion
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Subscriber details and related events are kept while your account is
            active.
          </li>
          <li>
            When you disconnect Gmail or close your account, your Google-derived
            data is deleted within 7 days. Backups and logs are purged on a
            rolling basis within 90 days.
          </li>
          <li>
            You can request deletion at any time by emailing{" "}
            <a
              className="text-blue-600 underline"
              href="mailto:support@substacksync.com"
            >
              support@substacksync.com
            </a>
            . We respond to verified requests within 30 days.
          </li>
        </ul>
      </section>

      {/* User Controls */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Your Controls</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Disconnect Gmail at any time to stop access.</li>
          <li>
            Revoke Gmail access from your Google Account security settings.
          </li>
          <li>
            Request access, correction, or deletion of your personal data by
            contacting support.
          </li>
        </ul>
      </section>

      {/* Compliance Note */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Compliance Note</h2>
        <p>
          For subscriber data, you are the data controller and SubstackSync acts
          as a processor. We comply with applicable privacy laws and use Google
          user data only to provide the service you requested.
        </p>
      </section>

      {/* International Transfers */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">International Transfers</h2>
        <p>
          Data may be processed in other countries. We take reasonable measures
          to safeguard it during such transfers.
        </p>
      </section>

      {/* Children */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Children</h2>
        <p>
          SubstackSync is not intended for people under 18. We do not knowingly
          collect data from children.
        </p>
      </section>

      {/* Changes */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Changes</h2>
        <p>
          We may update this policy. If changes are material we will notify you
          through the app or email.
        </p>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Contact</h2>
        <p>
          Questions or requests:{" "}
          <a
            className="text-blue-600 underline"
            href="mailto:support@substacksync.com"
          >
            support@substacksync.com
          </a>
        </p>
      </section>
    </main>
  );
}
