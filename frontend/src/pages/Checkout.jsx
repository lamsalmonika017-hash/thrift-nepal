import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Upload, ArrowRight, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, paymentsAPI } from '../api/client';
import toast from 'react-hot-toast';

const STEPS = ['Details', 'Payment', 'Confirm'];

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    delivery_address: '',
    delivery_phone: user?.phone || '',
    notes: '',
  });
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!user) return <div className="min-h-screen pt-28 flex items-center justify-center"><Link to="/login" className="btn-primary">Login to Checkout</Link></div>;
  if (items.length === 0) return <div className="min-h-screen pt-28 flex items-center justify-center"><p className="text-tn-muted">Your cart is empty. <Link to="/products" className="text-tn-orange underline">Shop now</Link></p></div>;

  const handlePlaceOrder = async () => {
    if (!form.delivery_address.trim()) { toast.error('Please enter delivery address'); return; }
    setLoading(true);
    try {
      const orderItems = items.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price }));
      const res = await ordersAPI.create({
        items: orderItems,
        total_amount: total,
        delivery_address: form.delivery_address,
        delivery_phone: form.delivery_phone,
        notes: form.notes,
      });
      setOrderId(res.data.orderId);
      setStep(1);
      window.scrollTo(0, 0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmitPayment = async () => {
    if (!screenshot) { toast.error('Please upload payment screenshot'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('order_id', orderId);
      formData.append('amount', total);
      formData.append('screenshot', screenshot);
      await paymentsAPI.submit(formData);
      await clearCart();
      setStep(2);
      window.scrollTo(0, 0);
      toast.success('Payment submitted! Admin will verify soon. ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < step ? 'bg-green-500 text-white' : i === step ? 'bg-tn-orange text-white' : 'bg-tn-card text-tn-muted border border-tn-border'
              }`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === step ? 'text-tn-text' : 'text-tn-muted'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-green-500' : 'bg-tn-border'}`} />}
            </div>
          ))}
        </div>

        {/* Step 0: Details */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-tn-dark border border-tn-border rounded-3xl p-6 mb-6">
              <h2 className="font-display font-bold text-xl text-tn-text mb-5">Delivery Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">Delivery Address / Hostel Name *</label>
                  <textarea required value={form.delivery_address} onChange={e => setForm(f => ({ ...f, delivery_address: e.target.value }))}
                    placeholder="e.g. Room 204, Boys Hostel, Pulchowk Campus"
                    rows={3} className="input-field resize-none" />
                </div>
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">Contact Phone</label>
                  <input value={form.delivery_phone} onChange={e => setForm(f => ({ ...f, delivery_phone: e.target.value }))}
                    placeholder="98XXXXXXXX" className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-tn-muted font-medium mb-1.5 block">Notes (optional)</label>
                  <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Any special instructions..." className="input-field" />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-tn-dark border border-tn-border rounded-3xl p-6 mb-6">
              <h2 className="font-display font-bold text-xl text-tn-text mb-4">Order Items</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-tn-card rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">📦</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-tn-text line-clamp-1">{item.title}</p>
                      <p className="text-xs text-tn-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-tn-orange">रू {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-tn-border pt-3 flex justify-between font-bold">
                <span className="text-tn-text">Total</span>
                <span className="text-tn-orange text-lg">रू {Number(total).toLocaleString()}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Proceed to Payment <ArrowRight className="w-5 h-5" /></>}
            </button>
          </motion.div>
        )}

        {/* Step 1: eSewa Payment */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-tn-dark border border-tn-border rounded-3xl p-6 mb-6">
              <h2 className="font-display font-bold text-xl text-tn-text mb-2">Pay via eSewa</h2>
              <p className="text-tn-muted text-sm mb-6">Scan the QR code below with your eSewa app and pay रू {Number(total).toLocaleString()}</p>

              {/* eSewa QR */}
              <div className="flex flex-col items-center bg-tn-card rounded-2xl p-6 mb-6 border border-tn-border">
                <div className="bg-white rounded-2xl p-4 mb-4 shadow-lg">
                  <img src="/uploads/esewa-qr.png" alt="eSewa QR Code" className="w-52 h-52 object-contain" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">e</div>
                  <span className="font-bold text-tn-text text-lg">eSewa</span>
                </div>
                <p className="font-bold text-tn-text text-xl">Monika Lamsal</p>
                <p className="text-tn-muted font-mono text-sm">9749332717</p>
                <div className="mt-3 bg-tn-orange/10 border border-tn-orange/30 rounded-xl px-4 py-2">
                  <p className="text-tn-orange font-bold text-xl text-center">रू {Number(total).toLocaleString()}</p>
                  <p className="text-xs text-tn-muted text-center mt-0.5">Amount to pay</p>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-400 font-medium text-sm">Important Instructions</p>
                    <ul className="text-tn-muted text-xs mt-1.5 space-y-1">
                      <li>1. Open eSewa app → Scan QR or Pay to Number</li>
                      <li>2. Enter exact amount: <strong className="text-tn-text">रू {Number(total).toLocaleString()}</strong></li>
                      <li>3. Take a screenshot of the payment confirmation</li>
                      <li>4. Upload the screenshot below</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Upload Screenshot */}
              <div>
                <label className="text-sm font-medium text-tn-text mb-3 block">Upload Payment Screenshot *</label>
                <label className="block border-2 border-dashed border-tn-border hover:border-tn-orange rounded-2xl p-6 text-center cursor-pointer transition-colors group">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  {preview ? (
                    <div>
                      <img src={preview} alt="Payment screenshot" className="max-h-40 mx-auto rounded-xl mb-2 object-contain" />
                      <p className="text-xs text-tn-muted">Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-tn-muted group-hover:text-tn-orange mx-auto mb-2 transition-colors" />
                      <p className="text-tn-muted text-sm">Click to upload screenshot</p>
                      <p className="text-xs text-tn-muted/60 mt-1">JPG, PNG, WEBP accepted</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button onClick={handleSubmitPayment} disabled={loading || !screenshot}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Submit Payment <CheckCircle className="w-5 h-5" /></>}
            </button>
          </motion.div>
        )}

        {/* Step 2: Success */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="bg-tn-dark border border-green-500/30 rounded-3xl p-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </motion.div>
              <h2 className="font-display font-bold text-2xl text-tn-text mb-3">Order Placed! 🎉</h2>
              <p className="text-tn-muted mb-2">Your payment screenshot has been submitted.</p>
              <p className="text-tn-muted text-sm mb-8">Admin will verify your eSewa payment within a few hours. You'll be notified once confirmed.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/orders" className="btn-primary">View My Orders</Link>
                <Link to="/products" className="btn-secondary">Continue Shopping</Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
