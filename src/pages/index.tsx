// src/pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>TaxMate AI</title>
        <meta
          name="description"
          content="AI-powered tax assistant for self-employed individuals in the UK"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-[#f2f4f7] text-[#1d1d1f] flex flex-col">
        {/* Hero Section */}
        <section className="relative bg-white py-20 shadow-sm overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <pattern
                  id="pattern-bg"
                  x="0"
                  y="0"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="10" cy="10" r="1" fill="#e5e7eb" />
                  <circle cx="30" cy="30" r="1" fill="#e5e7eb" />
                  <circle cx="50" cy="50" r="1" fill="#e5e7eb" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#pattern-bg)" />
            </svg>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl font-bold text-[#3f3d56] mb-4">
                Simplify Your Taxes with{" "}
                <span className="text-[#6C63FF]">AI</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Upload your statements, expenses, and receipts. Let our AI
                organize everything and estimate your UK tax instantly.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <Link
                  href="/get-started"
                  className="px-6 py-3 bg-[#6C63FF] text-white rounded-md font-medium hover:bg-[#5a53d6] transition"
                >
                  Get Started
                </Link>
                <Link
                  href="/about-us"
                  className="px-6 py-3 border border-[#6C63FF] text-[#6C63FF] rounded-md font-medium hover:bg-[#f2f0ff] transition"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/images/data-analysis.jpg"
                alt="Data Analysis"
                width={500}
                height={400}
                className="rounded-xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#3f3d56]">
              Why Choose TaxMateAI?
            </h2>
            <div className="grid gap-10 md:grid-cols-3">
              <div className="bg-white shadow-lg rounded-xl p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300">
                <div className="text-[#6C63FF] text-5xl mb-4">📂</div>
                <h3 className="text-xl font-semibold mb-3">Automated Sorting</h3>
                <p className="text-gray-600">
                  AI categorizes income, expenses, and deductions from your
                  documents automatically.
                </p>
              </div>
              <div className="bg-white shadow-lg rounded-xl p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300">
                <div className="text-[#6C63FF] text-5xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-3">Tax Estimates</h3>
                <p className="text-gray-600">
                  Get an instant estimate of your tax liability based on your
                  financial data.
                </p>
              </div>
              <div className="bg-white shadow-lg rounded-xl p-8 text-center hover:-translate-y-2 hover:shadow-2xl transition-transform duration-300">
                <div className="text-[#6C63FF] text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
                <p className="text-gray-600">
                  Your data is encrypted and stored securely, accessible only to
                  you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="bg-[#6C63FF] text-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to simplify your tax process?
            </h2>
            <p className="mb-8">
              Sign up today and let AI handle the hard work for you.
            </p>
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-[#6C63FF] rounded-md font-medium hover:bg-gray-100 transition"
            >
              Create an Account
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
