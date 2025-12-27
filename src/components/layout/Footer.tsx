import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container-custom text-center">
        <div className="flex justify-center gap-6 mb-6">
          <a
            href="#"
            className="text-white text-2xl hover:text-primary transition-colors"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook"></i>
          </a>
          <a
            href="#"
            className="text-white text-2xl hover:text-primary transition-colors"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="#"
            className="text-white text-2xl hover:text-primary transition-colors"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="#"
            className="text-white text-2xl hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
        
        <div className="flex justify-center gap-8 mb-6 flex-wrap">
          <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/properties" className="text-gray-400 hover:text-primary transition-colors">
            Properties
          </Link>
          <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">
            Contact
          </Link>
          <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
            Privacy Policy
          </Link>
        </div>
        
        <p className="text-gray-500">
          © 2025 Kigali Properties Link. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
