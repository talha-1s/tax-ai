import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { FaRobot, FaChartLine, FaShieldAlt, FaMagic, FaPlug, FaSmileBeam } from "react-icons/fa";

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
        <section className="relative bg-[#f4f5f7] py-20 md:py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16">

            {/* Text Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1d1d1f] mb-6">
                Simplify Your Taxes with <span className="text-[#6C63FF]">AI</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-800 mb-8 max-w-xl">
                Upload your statements, expenses, and receipts. Let our AI organise everything and estimate your UK tax instantly. No spreadsheets. No stress.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <Link href="/get-started" className="px-6 py-3 bg-[#6C63FF] text-white rounded-md font-medium hover:bg-[#5a53d6] transition">
                  Get Started
                </Link>
                <Link href="/about-us" className="px-6 py-3 border border-[#6C63FF] text-[#6C63FF] rounded-md font-medium hover:bg-[#eaeaf0] transition">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="md:w-1/2 flex justify-center relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#6C63FF] opacity-10 rounded-full"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#6C63FF] opacity-10 rounded-full"></div>

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

        {/* AI Capabilities Section (with grey background) */}
        <section className="py-20 bg-[#f4f5f7]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1d1d1f]">
              What Our AI Can Do for You
            </h2>
            <div className="grid gap-10 md:grid-cols-3">
              {[
                { icon: <FaRobot size={32} className="text-[#6C63FF]" />, title: "Smart Categorisation", desc: "Automatically sort income, expenses, and deductions from your uploads." },
                { icon: <FaMagic size={32} className="text-[#6C63FF]" />, title: "Deduction Finder", desc: "Discover overlooked deductions with intelligent suggestions." },
                { icon: <FaPlug size={32} className="text-[#6C63FF]" />, title: "Bank Integrations", desc: "Connect your accounts for seamless transaction syncing." },
                { icon: <FaChartLine size={32} className="text-[#6C63FF]" />, title: "Real-Time Estimates", desc: "Get instant projections based on your financial data." },
                { icon: <FaShieldAlt size={32} className="text-[#6C63FF]" />, title: "Encrypted & Private", desc: "Your data is stored securely and never shared." },
                { icon: <FaSmileBeam size={32} className="text-[#6C63FF]" />, title: "Stress-Free Filing", desc: "Generate reports and file with confidence, backed by AI." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-white shadow-md rounded-xl p-8 text-center hover:-translate-y-1 hover:shadow-lg transition-transform duration-300">
                  <div className="mb-4 flex justify-center">{icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-[#1d1d1f]">{title}</h3>
                  <p className="text-gray-700">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose TaxMateAI Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1d1d1f]">
              Why Choose TaxMateAI?
            </h2>
            <div className="grid gap-10 md:grid-cols-3">
              {[
                { emoji: "📂", title: "Automated Sorting", desc: "Our AI categorises your income, expenses, and deductions automatically, saving you hours of manual work." },
                { emoji: "📊", title: "Instant Tax Estimates", desc: "Receive immediate estimates of your tax liability, helping you plan ahead with confidence." },
                { emoji: "🔒", title: "Secure & Private", desc: "All your data is encrypted and stored securely, accessible only to you." },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="bg-[#f4f5f7] shadow-md rounded-xl p-8 text-center hover:-translate-y-1 hover:shadow-lg transition-transform duration-300">
                  <div className="text-[#6C63FF] text-6xl mb-4">{emoji}</div>
                  <h3 className="text-xl font-semibold mb-3">{title}</h3>
                  <p className="text-gray-700">{desc}</p>
                </div>
              ))}
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
            <Link href="/signup" className="px-8 py-3 bg-white text-[#6C63FF] rounded-md font-medium hover:bg-gray-100 transition">
              Create an Account
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
