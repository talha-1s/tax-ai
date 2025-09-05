import Link from "next/link";
import { FaFileInvoiceDollar, FaLightbulb, FaLock, FaPlug, FaCheckCircle, FaRocket, FaSmile } from "react-icons/fa";
import { motion } from "framer-motion";

export default function GetStarted() {
  const features = [
    { title: "Automated Reports", desc: "Generate real-time tax reports using our AI engine.", icon: <FaFileInvoiceDollar size={28} className="text-[#6C63FF]" /> },
    { title: "Smart Deduction Finder", desc: "Never miss a deduction again with AI-powered suggestions.", icon: <FaLightbulb size={28} className="text-[#6C63FF]" /> },
    { title: "Secure Data Handling", desc: "All your financial data is encrypted and safe with us.", icon: <FaLock size={28} className="text-[#6C63FF]" /> },
    { title: "Easy Integrations", desc: "Connect your bank accounts and apps seamlessly.", icon: <FaPlug size={28} className="text-[#6C63FF]" /> },
  ];

  const steps = [
    { title: "Connect Your Accounts", desc: "Securely link your bank and financial accounts to start tracking your taxes automatically.", icon: <FaCheckCircle size={28} className="text-[#6C63FF]" /> },
    { title: "Smart Analysis", desc: "Our AI reviews your transactions and suggests deductions, credits, and reports tailored for you.", icon: <FaRocket size={28} className="text-[#6C63FF]" /> },
    { title: "File with Confidence", desc: "Generate reports and filings quickly while ensuring accuracy and compliance.", icon: <FaSmile size={28} className="text-[#6C63FF]" /> },
  ];

  const testimonials = [
    { name: "Jane D.", text: "TaxMateAI made filing my taxes so simple! I saved hours and got better deductions than before." },
    { name: "Mark S.", text: "I never thought AI could help with taxes, but this tool is a game-changer. Highly recommend!" },
    { name: "Aisha K.", text: "Secure, intuitive, and efficient. TaxMateAI is my go-to for all financial reporting needs." },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 space-y-32 bg-[#f4f5f7]">

      {/* Hero Section */}
     <motion.section 
  className="text-center space-y-6 bg-white rounded-3xl p-14 shadow-2xl"
  initial="hidden" animate="visible" variants={fadeUp}
>
  <h1 className="text-5xl sm:text-6xl font-extrabold text-[#3f3d56] leading-snug">
    Welcome to <span className="text-[#6C63FF]">TaxMateAI</span>
  </h1>
  <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
    Your smart tax assistant powered by artificial intelligence. <span className="font-medium text-[#6C63FF]">Automate</span>, <span className="font-medium text-[#6C63FF]">simplify</span>, and <span className="font-medium text-[#6C63FF]">save more</span>.
  </p>
  <div className="mt-8">
    <Link 
      href="/signup" 
      className="bg-[#6C63FF] text-white px-10 py-4 rounded-full font-semibold hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
    >
      Sign Up
    </Link>
  </div>
</motion.section>


      {/* Features Section */}
      <motion.section 
        id="features" 
        className="space-y-12"
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-[#1d1d1f] text-center sm:text-left">Key Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ title, desc, icon }, idx) => (
            <motion.div 
              key={title} 
              className="bg-[#e9ebf0] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition hover:scale-105"
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-4">
                {icon}
                <h3 className="font-semibold text-[#6C63FF] text-lg">{title}</h3>
              </div>
              <p className="text-gray-700">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        id="how-it-works" 
        className="space-y-12"
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-[#1d1d1f] text-center sm:text-left">How It Works</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ title, desc, icon }, idx) => (
            <motion.div 
              key={title} 
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition hover:scale-105 text-center"
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">{icon}</div>
              <h3 className="font-semibold text-[#6C63FF] text-lg">{title}</h3>
              <p className="text-gray-700 mt-2">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        id="testimonials" 
        className="space-y-12"
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-[#1d1d1f] text-center sm:text-left">What Our Users Say</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ name, text }, idx) => (
            <motion.div 
              key={name} 
              className="bg-[#e9ebf0] p-6 rounded-2xl shadow-md hover:shadow-xl transition hover:scale-105 text-center"
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-700 mb-4 italic">"{text}"</p>
              <p className="font-semibold text-[#6C63FF]">{name}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </main>
  );
}
