// src/components/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-semibold text-[#3f3d56]">
          TaxMate<span className="text-[#6C63FF]">AI</span>
        </div>

        {/* Center links */}
        <div className="space-x-6 text-sm font-medium hidden md:flex">
          <Link href="/" className="hover:text-[#6C63FF]">Home</Link>
          <Link href="/get-started" className="hover:text-[#6C63FF]">Get Started</Link>
          <Link href="/signup" className="hover:text-[#6C63FF]">Sign Up</Link>
          <Link href="/about-us" className="hover:text-[#6C63FF]">About Us</Link>
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex space-x-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm border border-[#6C63FF] text-[#6C63FF] rounded-md hover:bg-[#f7f6ff] transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm bg-[#6C63FF] text-white rounded-md hover:bg-[#5952d4] transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
