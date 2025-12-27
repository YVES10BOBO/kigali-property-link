"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white fixed w-full top-0 z-50 shadow-md">
      <div className="container-custom py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Kigali<span className="text-secondary">PropertiesLink</span>
        </Link>
        
        <ul className="hidden md:flex gap-8 list-none">
          <li>
            <Link href="/" className="text-dark font-medium hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/properties" className="text-dark font-medium hover:text-primary transition-colors">
              Properties
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-dark font-medium hover:text-primary transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-dark font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </li>
        </ul>
        
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
          List Property
        </button>
      </div>
    </nav>
  );
}
