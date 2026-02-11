"use client";

import { useState } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  companyName?: string;
  welcomeMessage?: string;
}

export default function WhatsAppButton({ 
  phoneNumber = "250787461999",
  companyName = "KIGALI PROPERTIES LINK REAL ESTATE",
  welcomeMessage = "Hello! 👋 This is Kigali Properties Link - Best Real Estate Agency in Rwanda! 🏠✨\n\n🌟 Find Your Dream Home\n💰 Sell or Rent Your Property Fast\n📍 Prime Locations in Kigali\n✅ Verified Properties Only\n\nWe're here 24/7 to help you! Can we assist you today?"
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const message = encodeURIComponent("Hello! 👋 I'm interested in your properties. Can you help me find my dream home in Kigali?");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const handleOpenChat = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* WhatsApp Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-[#25d366] text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform z-50"
        aria-label="Open chat"
      >
        <FaWhatsapp />
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-80 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#25d366] text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold text-sm">{companyName}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 bg-gray-50 max-h-80 overflow-y-auto">
            <div className="space-y-3">
              {/* Agency Message */}
              <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {welcomeMessage}
                </p>
              </div>
            </div>
          </div>

          {/* Open Chat Button */}
          <div className="p-4 bg-white border-t border-gray-200">
            <button
              onClick={handleOpenChat}
              className="w-full bg-[#25d366] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#20ba5a] transition-colors flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="text-lg" />
              <span>Open chat</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
