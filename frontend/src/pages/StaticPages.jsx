import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Zap, Users, BookOpen, Laptop, Phone, Shirt } from 'lucide-react';

// ─── About Page ───────────────────────────────────────────────
export function About() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-tn-orange/10 border border-tn-orange/20 text-tn-orange text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            🇳🇵 Made for Nepali Students
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-tn-text mb-4">
            About <span className="text-gradient">ThriftNepal</span>
          </h1>
          <p className="text-tn-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Nepal's first dedicated student thrift marketplace — built by students, for students.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-tn-dark border border-tn-border rounded-3xl p-8 mb-8">
          <h2 className="font-display font-bold text-2xl text-tn-text mb-4">Our Story 📖</h2>
          <p className="text-tn-muted leading-relaxed mb-4">
            Every year, thousands of Nepali students graduate, leave hostels, or upgrade their gear — leaving behind perfectly good laptops, books, phones, and furniture with nowhere to go.
          </p>
          <p className="text-tn-muted leading-relaxed mb-4">
            ThriftNepal was born from a simple idea: what if students could easily buy and sell their used items to each other? No middlemen, no commission, just students helping students save money.
          </p>
          <p className="text-tn-muted leading-relaxed">
            From Pulchowk to Pokhara, from KU to TU — we're building Nepal's most trusted student-to-student marketplace. 🎓
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Heart, title: 'Student First', desc: 'Everything we build is designed around what students actually need — affordable, simple, and trustworthy.', color: 'text-red-400', bg: 'bg-red-500/10' },
            { icon: Shield, title: 'Safe & Trusted', desc: 'All sellers are verified students. Campus meetups keep transactions safe and personal.', color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: Zap, title: 'Zero Fees', desc: 'Listing is completely free forever. We believe students should keep 100% of what they earn.', color: 'text-tn-orange', bg: 'bg-tn-orange/10' },
          ].map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-tn-dark border border-tn-border rounded-2xl p-6">
                <div className={`w-12 h-12 ${v.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <h3 className="font-display font-bold text-lg text-tn-text mb-2">{v.title}</h3>
                <p className="text-tn-muted text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-tn-orange/10 to-tn-beige/10 border border-tn-orange/20 rounded-3xl p-8 mb-8">
          <h2 className="font-display font-bold text-2xl text-tn-text mb-6 text-center">ThriftNepal by Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10,000+', label: 'Students' },
              { value: '50,000+', label: 'Items Listed' },
              { value: '30+', label: 'Colleges' },
              { value: '₹2M+', label: 'Student Savings' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display font-bold text-3xl text-tn-orange">{s.value}</p>
                <p className="text-tn-muted text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/register" className="btn-primary inline-flex items-center gap-2">
            Join ThriftNepal Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── How It Works Page ────────────────────────────────────────
export function HowItWorks() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-tn-text mb-4">
            How It <span className="text-gradient">Works</span>
          </h1>
          <p className="text-tn-muted text-lg">Simple, safe, and student-friendly</p>
        </motion.div>

        {/* For Buyers */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-12">
          <h2 className="font-display font-bold text-2xl text-tn-text mb-6 flex items-center gap-2">
            🛒 For Buyers
          </h2>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Browse & Search', desc: 'Search for laptops, books, clothes, phones and more. Filter by category, condition, and price.' },
              { step: '02', title: 'Find Your Item', desc: 'View product details, photos, seller info and their college location for easy campus meetup.' },
              { step: '03', title: 'Add to Cart & Checkout', desc: 'Add items to cart and proceed to checkout. Enter your hostel/delivery address.' },
              { step: '04', title: 'Pay via eSewa', desc: 'Scan the eSewa QR code and pay the exact amount. Take a screenshot of the payment confirmation.' },
              { step: '05', title: 'Upload Screenshot', desc: 'Upload your eSewa payment screenshot. Admin verifies it within a few hours.' },
              { step: '06', title: 'Collect Your Item', desc: 'Once payment is verified, meet the seller on campus and collect your item safely.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex gap-4 bg-tn-dark border border-tn-border rounded-2xl p-5">
                <div className="w-10 h-10 bg-tn-orange rounded-xl flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-tn-text mb-1">{item.title}</h3>
                  <p className="text-tn-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* For Sellers */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-12">
          <h2 className="font-display font-bold text-2xl text-tn-text mb-6">💰 For Sellers</h2>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Create Free Account', desc: 'Sign up with your email. Add your college name so buyers know where to meet you.' },
              { step: '02', title: 'List Your Item', desc: 'Click Sell → add photos, set price, pick category and condition. Takes under 2 minutes.' },
              { step: '03', title: 'Wait for Buyers', desc: 'Your listing goes live instantly. Students browsing the marketplace will see your item.' },
              { step: '04', title: 'Buyer Pays via eSewa', desc: 'Buyer scans your eSewa QR and pays. Admin verifies the payment screenshot.' },
              { step: '05', title: 'Hand Over & Get Paid', desc: 'Meet the buyer on campus, hand over the item, and the payment is confirmed. Done! 🎉' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex gap-4 bg-tn-dark border border-tn-border rounded-2xl p-5">
                <div className="w-10 h-10 bg-tn-card border border-tn-border rounded-xl flex items-center justify-center font-display font-bold text-tn-orange text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-tn-text mb-1">{item.title}</h3>
                  <p className="text-tn-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* eSewa Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 mb-8">
          <h2 className="font-display font-bold text-2xl text-tn-text mb-4">📱 eSewa Payment</h2>
          <p className="text-tn-muted leading-relaxed mb-4">
            ThriftNepal uses eSewa — Nepal's most trusted digital wallet — for all payments. It's fast, safe, and every Nepali student already has it.
          </p>
          <ul className="space-y-2 text-sm text-tn-muted">
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> No cash needed</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Payment proof via screenshot</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Admin verified for safety</li>
            <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Zero transaction fees</li>
          </ul>
        </motion.div>

        <div className="text-center">
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            Start Browsing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────
export function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-tn-text mb-4">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-tn-muted text-lg">Have a question? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { emoji: '📧', title: 'Email Us', value: 'support@thriftnepal.com', desc: 'We reply within 24 hours' },
            { emoji: '📱', title: 'WhatsApp', value: '+977 9849XXXXXX', desc: 'Mon–Fri, 9am–6pm NST' },
            { emoji: '📍', title: 'Based In', value: 'Kathmandu, Nepal', desc: 'Serving all of Nepal' },
            { emoji: '🎓', title: 'Student Support', value: 'Campus Help Desk', desc: 'Available on all major campuses' },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-tn-dark border border-tn-border rounded-2xl p-6">
              <div className="text-3xl mb-3">{c.emoji}</div>
              <h3 className="font-display font-semibold text-tn-text mb-1">{c.title}</h3>
              <p className="text-tn-orange font-medium text-sm">{c.value}</p>
              <p className="text-tn-muted text-xs mt-1">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-tn-dark border border-tn-border rounded-3xl p-8">
          <h2 className="font-display font-bold text-xl text-tn-text mb-6">Send us a message</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-tn-muted font-medium mb-1.5 block">Your Name</label>
                <input placeholder="Ram Thapa" className="input-field" />
              </div>
              <div>
                <label className="text-xs text-tn-muted font-medium mb-1.5 block">Email</label>
                <input type="email" placeholder="ram@email.com" className="input-field" />
              </div>
            </div>
            <div>
              <label className="text-xs text-tn-muted font-medium mb-1.5 block">Subject</label>
              <input placeholder="How can we help?" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-tn-muted font-medium mb-1.5 block">Message</label>
              <textarea rows={5} placeholder="Tell us your issue or feedback..." className="input-field resize-none" />
            </div>
            <button className="w-full btn-primary py-3.5 flex items-center justify-center gap-2">
              Send Message <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
