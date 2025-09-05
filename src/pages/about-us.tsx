export default function AboutUs() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16 space-y-16 bg-[#f4f5f7]">

      {/* Hero Section */}
      <section className="space-y-6 text-center bg-white rounded-3xl p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-[#1d1d1f]">About TaxMateAI</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          At TaxMateAI, we're redefining tax management with artificial intelligence. Whether you're a self-employed professional, freelancer, or small business owner, we offer secure and efficient tools to simplify your finances.
        </p>
      </section>

      {/* Services Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#6C63FF]">Our Services</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "AI-Powered Tax Filing",
            "Smart Deduction Detection",
            "24/7 Live Chat Tax Support",
            "Secure Document Storage",
            "Real-Time Report Generation"
          ].map((service) => (
            <div key={service} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition hover:scale-105">
              <p className="text-gray-800 font-medium">{service}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#6C63FF]">What Our Users Say</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Sarah, Freelance Designer", text: "TaxMateAI made my self-assessment tax return a breeze! Highly recommend!" },
            { name: "Imran, Self-employed Driver", text: "As a taxi driver, I used to dread tax season. Now I file everything with confidence." },
            { name: "Claire, Jewellery Business Owner", text: "The AI support is phenomenal and available whenever I need it." }
          ].map(({ name, text }) => (
            <div key={name} className="bg-[#e9ebf0] p-6 rounded-2xl shadow-md hover:shadow-xl transition hover:scale-105">
              <p className="text-gray-700 mb-2 italic">"{text}"</p>
              <p className="font-semibold text-[#6C63FF]">{name}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
