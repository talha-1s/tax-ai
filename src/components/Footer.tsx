"use client";

import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-12">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} TaxMateAI. All rights reserved.</p>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-2 sm:mt-0">
          {/* Legal links */}
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-[#6C63FF]">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#6C63FF]">Terms</Link>
            <Link href="#" className="hover:text-[#6C63FF]">Support</Link>
          </div>

          {/* Contact info */}
          <div className="flex items-center space-x-4">
            <a href="mailto:info@taxmateai.com" className="hover:text-[#6C63FF]">
              info@taxmateai.com
            </a>
            <a
              href="https://www.instagram.com/taxmateai/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#6C63FF]"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
