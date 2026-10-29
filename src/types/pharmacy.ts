export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  batchNo: string;
  expiryDate: string;
  stock: number;
  unitPrice: number;
  purchasePrice: number;
  supplier: string;
  location: string; // e.g. Shelf A-1
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
  discount: number; // percentage or fixed
}

export interface Sale {
  id: string;
  invoiceNo: string;
  date: string;
  items: {
    medicineId: string;
    medicineName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'Cash' | 'Credit Card' | 'Insurance' | 'Mobile Pay';
  customerName: string;
  cashier: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  categories: string;
}

export interface PharmacySettings {
  pharmacyName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  taxRate: number; // percentage e.g. 5
  currency: string; // e.g. "$" or "Rs."
  lowStockThreshold: number;
  theme: 'emerald' | 'teal' | 'dark';
}
