export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-navy">
      <h1 className="font-display text-4xl font-black mb-6">Privacy Policy</h1>
      <div className="prose text-sm text-navy-80 space-y-4 font-body leading-relaxed">
        <p>Veruthe Alla Kudumba Unit respects your privacy. We collect minimal personal information solely for the purpose of communicating event updates and booking confirmations.</p>
        <h3 className="font-display text-lg font-bold text-navy pt-4">Data Collection</h3>
        <p>We store your full name, email address, phone number, and account interests. We do not store sensitive payment credentials or banking information.</p>
        <h3 className="font-display text-lg font-bold text-navy pt-4">Sharing</h3>
        <p>We do not sell or rent your personal information to third parties.</p>
      </div>
    </div>
  );
}
