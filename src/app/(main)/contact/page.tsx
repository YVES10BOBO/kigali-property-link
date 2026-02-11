"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/utils/toast";
import {
  FaPaperPlane,
  FaLocationArrow,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaSearch,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

// Note: Metadata for client components should be in a separate metadata export
// For now, we'll handle this in the layout or use a wrapper
export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [showTrackModal, setShowTrackModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          inquiry_type: formData.subject === 'property-inquiry' ? 'general' : 'general',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      showSuccess('Thank you! Your message has been sent successfully. We will get back to you soon.');
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error: any) {
      showError('Failed to submit your message. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container-custom py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-dark mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with us. We're here to help you find your perfect property in Kigali.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-dark mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-2 text-dark">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-2 text-dark">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                        placeholder="0788 XXX XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-dark">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-dark">Subject *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="property-inquiry">Property Inquiry</option>
                      <option value="viewing-request">Request Property Viewing</option>
                      <option value="general-question">General Question</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-dark">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-primary outline-none resize-y"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <button
                      type="submit"
                      className="w-full md:flex-1 bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      <FaPaperPlane />
                      Send Message
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTrackModal(true)}
                      className="w-full md:w-auto text-primary font-semibold flex items-center justify-center gap-2 underline-offset-4 hover:underline"
                    >
                      <FaLocationArrow />
                      Track my inquiry
                    </button>
                  </div>
                </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-dark mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">Phone</h4>
                    <a href="tel:+250787461999" className="text-gray-600 hover:text-primary transition-colors">
                      +250 787461999
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">Email</h4>
                    <a href="mailto:info@kigalipropertieslink.com" className="text-gray-600 hover:text-primary transition-colors">
                      info@kigalipropertieslink.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaWhatsapp className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">WhatsApp</h4>
                    <a
                      href="https://wa.me/250787461999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Chat with us
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark mb-1">Location</h4>
                    <p className="text-gray-600">
                      Kigali, Rwanda
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
                <div className="pt-4 border-t border-white/20 mt-4">
                  <p className="text-sm">
                    <FaInfoCircle className="mr-2" />
                    Available 24/7 via WhatsApp
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-dark mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="https://wa.me/250787461999?text=Hello! I'm interested in your properties."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#25d366] text-white rounded-lg hover:bg-[#20ba5a] transition-colors"
                >
                  <FaWhatsapp className="text-2xl" />
                  <span className="font-semibold">Chat on WhatsApp</span>
                </a>
                <a
                  href="tel:+250787461999"
                  className="flex items-center gap-3 p-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
                >
                  <FaPhone className="text-xl" />
                  <span className="font-semibold">Call Us Now</span>
                </a>
                <a
                  href="/properties"
                  className="flex items-center gap-3 p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <FaSearch className="text-xl" />
                  <span className="font-semibold">Browse Properties</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Track Inquiry / Login Modal */}
      <Modal
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        title="Track your inquiry"
      >
        <p className="text-gray-600 text-sm mb-4">
          To track your inquiries and see their status, please log in to your client account.
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setShowTrackModal(false);
              router.push("/login?redirect=/client");
            }}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            <FaSignInAlt />
            Log in to my account
          </button>
          <button
            type="button"
            onClick={() => {
              setShowTrackModal(false);
              router.push("/register?redirect=/client");
            }}
            className="w-full border border-primary text-primary py-2.5 rounded-lg font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
          >
            <FaUserPlus />
            Create a new account
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          After logging in, go to <span className="font-semibold">My Inquiries</span> to see all messages you
          sent using this email.
        </p>
      </Modal>
    </div>
  );
}
