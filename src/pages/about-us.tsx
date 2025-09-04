export default function AboutUs() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      <section className="space-y-6 text-center">
        <h1 className="text-4xl font-bold text-[#3f3d56]">About TaxMateAI</h1>
        <p className="text-lg text-gray-700">
          At TaxMateAI, we're redefining tax management with artificial intelligence.
          Whether you're a self-employed professional, freelancer, or small business owner, 
          we offer secure and efficient tools to help simplify your finances.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#6C63FF]">Our Services</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>AI-Powered Tax Filing</li>
          <li>Smart Deduction Detection</li>
          <li>24/7 Live Chat Tax Support</li>
          <li>Secure Document Storage</li>
          <li>Real-Time Report Generation</li>
        </ul>
      </section>

      <section className="space-y-6 mt-16">
        <h2 className="text-2xl font-semibold text-[#6C63FF]">What Our Users Say</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow text-gray-800">
            <p className="italic">"TaxMateAI made my self-assessment tax return a breeze! Highly recommend!"</p>
            <p className="font-semibold mt-2">– Sarah, Freelance Designer</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-gray-800">
            <p className="italic">"As a taxi driver, I used to dread tax season. Now I file everything with confidence."</p>
            <p className="font-semibold mt-2">– Imran, Self-employed Driver</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-gray-800">
            <p className="italic">"The AI support is phenomenal and available whenever I need it."</p>
            <p className="font-semibold mt-2">– Claire, Jewellery Business Owner</p>
          </div>
        </div>
      </section>
    </main>
  );
}
