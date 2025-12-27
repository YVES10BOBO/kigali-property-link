"use client";

export default function WhatsAppButton({ phoneNumber = "250788000000" }: { phoneNumber?: string }) {
  const message = encodeURIComponent("Hello! I'm interested in your properties.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 bg-[#25d366] text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform z-50"
      aria-label="Contact us on WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
