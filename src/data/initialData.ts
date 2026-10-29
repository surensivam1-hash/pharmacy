import { Medicine, Supplier, Sale, PharmacySettings } from '../types/pharmacy';

export const initialMedicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    category: 'Analgesics',
    batchNo: 'BAT-2026-001',
    expiryDate: '2028-05-15',
    stock: 450,
    unitPrice: 0.25,
    purchasePrice: 0.15,
    supplier: 'MedCorp Pharma',
    location: 'Shelf A-1'
  },
  {
    id: 'med-2',
    name: 'Amoxicillin 250mg',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotics',
    batchNo: 'BAT-2026-002',
    expiryDate: '2027-11-20',
    stock: 120,
    unitPrice: 0.80,
    purchasePrice: 0.50,
    supplier: 'BioHealth Distributors',
    location: 'Shelf B-3'
  },
  {
    id: 'med-3',
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    category: 'Analgesics',
    batchNo: 'BAT-2025-089',
    expiryDate: '2026-12-10',
    stock: 15, // Low stock
    unitPrice: 0.40,
    purchasePrice: 0.25,
    supplier: 'MedCorp Pharma',
    location: 'Shelf A-2'
  },
  {
    id: 'med-4',
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    category: 'Gastrointestinal',
    batchNo: 'BAT-2026-014',
    expiryDate: '2026-04-05', // Expiring soon or expired test
    stock: 85,
    unitPrice: 1.20,
    purchasePrice: 0.75,
    supplier: 'Apex Pharma Ltd',
    location: 'Shelf C-1'
  },
  {
    id: 'med-5',
    name: 'Metformin 500mg',
    genericName: 'Metformin Hydrochloride',
    category: 'Antidiabetic',
    batchNo: 'BAT-2026-022',
    expiryDate: '2029-01-30',
    stock: 320,
    unitPrice: 0.50,
    purchasePrice: 0.30,
    supplier: 'Global Therapeutics',
    location: 'Shelf D-4'
  },
  {
    id: 'med-6',
    name: 'Amlodipine 5mg',
    genericName: 'Amlodipine Besylate',
    category: 'Cardiovascular',
    batchNo: 'BAT-2026-035',
    expiryDate: '2028-09-12',
    stock: 210,
    unitPrice: 0.65,
    purchasePrice: 0.40,
    supplier: 'Apex Pharma Ltd',
    location: 'Shelf C-3'
  },
  {
    id: 'med-7',
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine Hydrochloride',
    category: 'Antihistamine',
    batchNo: 'BAT-2026-041',
    expiryDate: '2028-06-18',
    stock: 290,
    unitPrice: 0.30,
    purchasePrice: 0.18,
    supplier: 'MedCorp Pharma',
    location: 'Shelf A-4'
  },
  {
    id: 'med-8',
    name: 'Vitamin C 1000mg',
    genericName: 'Ascorbic Acid',
    category: 'Vitamins & Supplements',
    batchNo: 'BAT-2026-055',
    expiryDate: '2029-03-22',
    stock: 500,
    unitPrice: 0.15,
    purchasePrice: 0.08,
    supplier: 'BioHealth Distributors',
    location: 'Shelf E-1'
  },
  {
    id: 'med-9',
    name: 'Atorvastatin 20mg',
    genericName: 'Atorvastatin Calcium',
    category: 'Cardiovascular',
    batchNo: 'BAT-2026-067',
    expiryDate: '2027-10-15',
    stock: 18, // Low stock
    unitPrice: 1.50,
    purchasePrice: 0.95,
    supplier: 'Global Therapeutics',
    location: 'Shelf C-5'
  },
  {
    id: 'med-10',
    name: 'Salbutamol Inhaler',
    genericName: 'Albuterol Sulfate',
    category: 'Respiratory',
    batchNo: 'BAT-2026-078',
    expiryDate: '2028-02-28',
    stock: 65,
    unitPrice: 6.50,
    purchasePrice: 4.20,
    supplier: 'Apex Pharma Ltd',
    location: 'Shelf F-2'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'MedCorp Pharma',
    contactPerson: 'Sarah Jenkins',
    phone: '+1 (555) 234-5678',
    email: 'orders@medcorppharma.com',
    address: '104 Industrial Parkway, Boston, MA',
    rating: 4.8,
    categories: 'Analgesics, Antihistamines'
  },
  {
    id: 'sup-2',
    name: 'BioHealth Distributors',
    contactPerson: 'David Ross',
    phone: '+1 (555) 345-6789',
    email: 'sales@biohealthdist.com',
    address: '782 Science Blvd, Chicago, IL',
    rating: 4.6,
    categories: 'Antibiotics, Vitamins'
  },
  {
    id: 'sup-3',
    name: 'Apex Pharma Ltd',
    contactPerson: 'Elena Rostova',
    phone: '+1 (555) 456-7890',
    email: 'elena@apexpharma.net',
    address: '445 Medical Center Dr, Houston, TX',
    rating: 4.9,
    categories: 'Cardiovascular, Respiratory, Gastrointestinal'
  },
  {
    id: 'sup-4',
    name: 'Global Therapeutics',
    contactPerson: 'Marcus Vance',
    phone: '+1 (555) 890-1234',
    email: 'mvance@globaltherapeutics.org',
    address: '900 Biotech Way, San Francisco, CA',
    rating: 4.7,
    categories: 'Antidiabetics, Cardiovascular'
  }
];

export const initialSales: Sale[] = [
  {
    id: 'sale-1',
    invoiceNo: 'INV-2026-1001',
    date: '2026-10-28 09:30',
    items: [
      { medicineId: 'med-1', medicineName: 'Paracetamol 500mg', quantity: 2, unitPrice: 0.25, total: 0.50 },
      { medicineId: 'med-8', medicineName: 'Vitamin C 1000mg', quantity: 1, unitPrice: 0.15, total: 0.15 }
    ],
    subtotal: 0.65,
    discount: 0.00,
    tax: 0.03,
    total: 0.68,
    paymentMethod: 'Cash',
    customerName: 'Walk-in Customer',
    cashier: 'Dr. John Doe'
  },
  {
    id: 'sale-2',
    invoiceNo: 'INV-2026-1002',
    date: '2026-10-28 10:15',
    items: [
      { medicineId: 'med-2', medicineName: 'Amoxicillin 250mg', quantity: 1, unitPrice: 0.80, total: 0.80 },
      { medicineId: 'med-7', medicineName: 'Cetirizine 10mg', quantity: 2, unitPrice: 0.30, total: 0.60 }
    ],
    subtotal: 1.40,
    discount: 0.10,
    tax: 0.07,
    total: 1.37,
    paymentMethod: 'Credit Card',
    customerName: 'Emily Watson',
    cashier: 'Dr. John Doe'
  },
  {
    id: 'sale-3',
    invoiceNo: 'INV-2026-1003',
    date: '2026-10-28 11:45',
    items: [
      { medicineId: 'med-10', medicineName: 'Salbutamol Inhaler', quantity: 1, unitPrice: 6.50, total: 6.50 }
    ],
    subtotal: 6.50,
    discount: 0.00,
    tax: 0.33,
    total: 6.83,
    paymentMethod: 'Mobile Pay',
    customerName: 'Robert Fox',
    cashier: 'Jane Smith'
  },
  {
    id: 'sale-4',
    invoiceNo: 'INV-2026-1004',
    date: '2026-10-28 13:20',
    items: [
      { medicineId: 'med-5', medicineName: 'Metformin 500mg', quantity: 3, unitPrice: 0.50, total: 1.50 },
      { medicineId: 'med-6', medicineName: 'Amlodipine 5mg', quantity: 2, unitPrice: 0.65, total: 1.30 }
    ],
    subtotal: 2.80,
    discount: 0.00,
    tax: 0.14,
    total: 2.94,
    paymentMethod: 'Insurance',
    customerName: 'Michael Brown',
    cashier: 'Jane Smith'
  }
];

export const initialSettings: PharmacySettings = {
  pharmacyName: 'CityCare Professional Pharmacy',
  tagline: 'Your Trusted Health & Wellness Partner',
  phone: '+1 (800) 555-CARE',
  email: 'support@citycarepharmacy.com',
  address: '742 Evergreen Terrace, Medical District, Springfield',
  taxRate: 5,
  currency: '$',
  lowStockThreshold: 20,
  theme: 'emerald'
};
