import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  FileText, 
  CheckCircle,
  Pill,
  Printer,
  X
} from 'lucide-react';
import { Medicine, CartItem, Sale, PharmacySettings } from '../types/pharmacy';
import confetti from 'canvas-confetti';

interface PosViewProps {
  medicines: Medicine[];
  settings: PharmacySettings;
  onCompleteSale: (newSale: Sale, updatedMedicines: Medicine[]) => void;
}

export default function PosView({ medicines, settings, onCompleteSale }: PosViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit Card' | 'Insurance' | 'Mobile Pay'>('Cash');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const categories = ['All', ...Array.from(new Set(medicines.map(m => m.category)))];

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          med.genericName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || med.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const addToCart = (med: Medicine) => {
    if (med.stock <= 0) {
      alert('Medicine is out of stock!');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === med.id);
      if (existing) {
        if (existing.quantity >= med.stock) {
          alert('Cannot exceed available stock!');
          return prev;
        }
        return prev.map(item => 
          item.medicine.id === med.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { medicine: med, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (medId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.medicine.id === medId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.medicine.stock) {
            alert('Exceeds available stock!');
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (medId: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== medId));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.medicine.unitPrice * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * settings.taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount;

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const saleItems = cart.map(item => ({
      medicineId: item.medicine.id,
      medicineName: item.medicine.name,
      quantity: item.quantity,
      unitPrice: item.medicine.unitPrice,
      total: item.medicine.unitPrice * item.quantity
    }));

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      invoiceNo,
      date: now,
      items: saleItems,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod,
      customerName: customerName || 'Walk-in Customer',
      cashier: 'Chief Pharmacist'
    };

    // Calculate updated medicine stocks
    const updatedMedicines = medicines.map(med => {
      const cartItem = cart.find(ci => ci.medicine.id === med.id);
      if (cartItem) {
        return { ...med, stock: Math.max(0, med.stock - cartItem.quantity) };
      }
      return med;
    });

    onCompleteSale(newSale, updatedMedicines);
    setCompletedSale(newSale);
    setShowReceiptModal(true);

    // Trigger confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }

    // Reset cart
    setCart([]);
    setDiscountPercent(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      {/* Left: Medicine Catalog & Search */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col h-full shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search medicines by name or generic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 pl-10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Medicine Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          {filteredMedicines.map((med) => (
            <div
              key={med.id}
              onClick={() => addToCart(med)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                med.stock <= 0 
                  ? 'bg-slate-100 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{med.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    med.stock <= 20 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    Stock: {med.stock}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{med.genericName}</p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {settings.currency}{med.unitPrice.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{med.location}</span>
              </div>
            </div>
          ))}
          {filteredMedicines.length === 0 && (
            <div className="col-span-2 text-center py-12 text-slate-400 text-xs">
              No medicines found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Right: Shopping Cart & Checkout */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col h-full shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Current Cart</h3>
          </div>
          <span className="text-xs font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-600 px-2 py-0.5 rounded-full">
            {cart.reduce((acc, i) => acc + i.quantity, 0)} items
          </span>
        </div>

        {/* Customer Input */}
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Customer Name / ID</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 dark:divide-slate-800">
          {cart.map((item) => (
            <div key={item.medicine.id} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
              <div className="flex-1 overflow-hidden">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.medicine.name}</h4>
                <p className="text-[11px] text-emerald-600 font-medium">
                  {settings.currency}{item.medicine.unitPrice.toFixed(2)} each
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.medicine.id, -1)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 text-xs font-bold tabular-nums text-slate-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.medicine.id, 1)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.medicine.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-xs">
              Cart is empty. Click medicines from the left catalog to add.
            </div>
          )}
        </div>

        {/* Totals & Checkout Panel */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Subtotal</span>
            <span className="font-mono text-slate-900 dark:text-white">{settings.currency}{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Discount (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-14 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-xs text-right text-slate-900 dark:text-white"
              />
            </div>
            <span className="font-mono text-emerald-600">-{settings.currency}{discountAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tax ({settings.taxRate}%)</span>
            <span className="font-mono text-slate-900 dark:text-white">+{settings.currency}{taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
            <span>Grand Total</span>
            <span className="text-emerald-600 dark:text-emerald-400 text-base font-mono">
              {settings.currency}{grandTotal.toFixed(2)}
            </span>
          </div>

          {/* Payment Method Selector */}
          <div className="grid grid-cols-4 gap-1 pt-2">
            {(['Cash', 'Credit Card', 'Insurance', 'Mobile Pay'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-semibold transition-colors text-center truncate ${
                  paymentMethod === method
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-xl text-xs font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              cart.length === 0
                ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete Sale & Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {showReceiptModal && completedSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center font-bold mb-2">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{settings.pharmacyName}</h3>
              <p className="text-[11px] text-slate-500">{settings.address}</p>
              <p className="text-[11px] text-slate-500">Phone: {settings.phone}</p>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Invoice: <strong className="text-slate-900 dark:text-white">{completedSale.invoiceNo}</strong></span>
                <span>Date: {completedSale.date}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Customer: <strong className="text-slate-900 dark:text-white">{completedSale.customerName}</strong></span>
                <span>Payment: <strong className="text-slate-900 dark:text-white">{completedSale.paymentMethod}</strong></span>
              </div>

              <table className="w-full mt-3 text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Price</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {completedSale.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 text-slate-900 dark:text-white font-medium">{item.medicineName}</td>
                      <td className="py-1.5 text-center text-slate-600 dark:text-slate-300">{item.quantity}</td>
                      <td className="py-1.5 text-right text-slate-600 dark:text-slate-300">{settings.currency}{item.unitPrice.toFixed(2)}</td>
                      <td className="py-1.5 text-right font-bold text-slate-900 dark:text-white">{settings.currency}{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{settings.currency}{completedSale.subtotal.toFixed(2)}</span>
                </div>
                {completedSale.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{settings.currency}{completedSale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Tax ({settings.taxRate}%)</span>
                  <span>+{settings.currency}{completedSale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t">
                  <span>Grand Total</span>
                  <span className="text-emerald-600">{settings.currency}{completedSale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Cashier: {completedSale.cashier}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
