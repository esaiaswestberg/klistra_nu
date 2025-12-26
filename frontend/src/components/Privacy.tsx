export default function Privacy() {
  return (
    <div className="bg-surface/80 backdrop-blur-md rounded-xl p-8 border border-border-color shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-primary">Privacy Policy</h2>
      <div className="space-y-4 text-on-surface/90">
        <p>
          At Klistra.nu, we prioritize your privacy and security. We are committed to transparency regarding the data we collect and how we use it.
        </p>

        <h3 className="text-xl font-semibold mt-4 text-secondary">Data Collection</h3>
        <p>
          We do not collect any personal information about our users. We do not use cookies for tracking purposes.
        </p>
        <p>
          When you create a "Klister" (paste), we store the encrypted text content, encrypted file metadata, and the expiration time you specify.
        </p>

        <h3 className="text-xl font-semibold mt-4 text-secondary">Data Storage & Encryption</h3>
        <p>
          All data is stored using industry-standard, post-quantum resistant encryption.
        </p>
        <ul className="list-disc list-inside space-y-2 ml-4">
          <li><strong>Text:</strong> Encrypted using <code>XChaCha20-Poly1305</code> with keys derived via <code>Argon2id</code>.</li>
          <li><strong>Files:</strong> Encrypted locally in your browser using <code>AES-256-GCM</code> before upload. The decryption keys are stored within the encrypted paste metadata and are never accessible to us or the file storage provider.</li>
        </ul>
        <p className="mt-4">
          This "Zero-Knowledge" architecture ensures that only you and those you share the link with can access the raw content. We do not have access to your passwords, decryption keys, or the raw content of your pastes.
        </p>

        <h3 className="text-xl font-semibold mt-4 text-secondary">Data Retention</h3>
        <p>
          Pastes are automatically deleted from our servers once their expiration time is reached. We do not keep any backups of expired pastes.
        </p>

        <h3 className="text-xl font-semibold mt-4 text-secondary">Transport Security</h3>
        <p>
           All communication between your browser and our servers is encrypted using HTTPS. Additionally, we employ application-layer encryption for paste submission and retrieval to protect against interception.
        </p>

        <div className="mt-8 pt-4 border-t border-border-color">
           <button onClick={() => window.history.back()} className="text-primary hover:underline">Go Back</button>
        </div>
      </div>
    </div>
  );
}
