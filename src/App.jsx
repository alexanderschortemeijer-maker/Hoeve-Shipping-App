import React, { useState, useMemo, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  Minus, 
  CheckCircle2,
  Anchor,
  X,
  ClipboardList,
  Wrench,
  Camera,
  ImagePlus,
  Ship,
  Filter
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, setDoc, updateDoc } from "firebase/firestore";

// ENTER YOUR OWN FIREBASE CONFIG DATA HERE:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase directly in this file
let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn("Please enter your own Firebase credentials to activate the database.");
}

const SHIPS = ['Rapida', 'Rapido'];
const CATEGORIES = [
  'Fuel & Water', 
  'Oil & Lubrication', 
  'Air Filters', 
  'Engine Parts', 
  'Fluids & Testing', 
  'Safety', 
  'Other'
];

const INITIAL_PARTS = [
  // --- FUEL & WATER ---
  { id: 3, ship: 'Rapida', name: 'Fleetguard FS19914 (Fuel/Water Sep)', category: 'Fuel & Water', stock: 4, threshold: 2, image: '/IMG_20260205_112241.jpg' },
  { id: 4, ship: 'Rapida', name: 'Fleetguard FF5626 (Fuel Filter)', category: 'Fuel & Water', stock: 2, threshold: 1, image: '/IMG_20260205_111853.jpg' },
  { id: 13, ship: 'Rapida', name: 'Yanmar Fuel Filter 129A00-55800', category: 'Fuel & Water', stock: 1, threshold: 1, image: '/IMG_20260205_112305.jpg' },
  { id: 16, ship: 'Rapida', name: 'Fleetguard FF5638 (Fuel Filter)', category: 'Fuel & Water', stock: 4, threshold: 1, image: '/IMG_20260205_111507.jpg' },
  { id: 19, ship: 'Rapida', name: 'Fleetguard FS19861', category: 'Fuel & Water', stock: 1, threshold: 1, image: '/IMG_20260205_111144.jpg' },
  { id: 20, ship: 'Rapida', name: 'White Water Filter Cartridge', category: 'Fuel & Water', stock: 2, threshold: 1, image: '/IMG_20260205_111124.jpg' },
  { id: 21, ship: 'Rapida', name: 'Separ Filter SWK-2000/10', category: 'Fuel & Water', stock: 3, threshold: 1, image: '/IMG_20260203_083810.jpg' },
  { id: 22, ship: 'Rapida', name: 'Fleetguard FF5626 (Fuel Filter)', category: 'Fuel & Water', stock: 7, threshold: 2, image: '/IMG_20260203_083135.jpg' },
  { id: 24, ship: 'Rapida', name: 'Fleetguard FS19861 (Fuel/Water Sep)', category: 'Fuel & Water', stock: 7, threshold: 2, image: '/IMG_20260203_083308.jpg' },
  { id: 27, ship: 'Rapida', name: 'Fleetguard FS19914 (Fuel/Water Sep)', category: 'Fuel & Water', stock: 7, threshold: 2, image: '/IMG_20260203_084057.jpg' },
  { id: 34, ship: 'Rapida', name: 'John Deere Water Separator (RE62419)', category: 'Fuel & Water', stock: 1, threshold: 1, image: '/IMG_20260203_082618.jpg' },
  { id: 38, ship: 'Rapida', name: 'Separ Filter Element 01030', category: 'Fuel & Water', stock: 1, threshold: 1, image: '/IMG_20260203_083751.jpg' },
  { id: 41, ship: 'Rapida', name: 'Parker Racor Filter 2020V30', category: 'Fuel & Water', stock: 1, threshold: 1, image: '/IMG_20260202_084350.jpg' },

  // --- OIL & LUBRICATION ---
  { id: 1, ship: 'Rapida', name: 'Fleetguard LF3402 (Lube Filter)', category: 'Oil & Lubrication', stock: 2, threshold: 1, image: '/IMG_20260205_111738.jpg' },
  { id: 2, ship: 'Rapida', name: 'Fleetguard LF3996 (Lube Filter)', category: 'Oil & Lubrication', stock: 2, threshold: 1, image: '/IMG_20260205_111809.jpg' },
  { id: 15, ship: 'Rapida', name: 'Fleetguard LF16243 (Lube Filter)', category: 'Oil & Lubrication', stock: 3, threshold: 1, image: '/IMG_20260205_111525.jpg' },
  { id: 35, ship: 'Rapida', name: 'Donaldson P550008 (Lube Filter)', category: 'Oil & Lubrication', stock: 3, threshold: 1, image: '/IMG_20260202_085301.jpg' },
  { id: 37, ship: 'Rapida', name: 'Fleetguard LF16243 (Lube Filter)', category: 'Oil & Lubrication', stock: 3, threshold: 1, image: '/IMG_20260203_082937.jpg' },
  { id: 39, ship: 'Rapida', name: 'Mann Filter W 75/3', category: 'Oil & Lubrication', stock: 1, threshold: 1, image: '/IMG_20260203_083840.jpg' },

  // --- AIR FILTERS ---
  { id: 6, ship: 'Rapida', name: 'Yanmar Air Filter 129935-12520', category: 'Air Filters', stock: 1, threshold: 1, image: '/IMG_20260205_112200.jpg' },
  { id: 7, ship: 'Rapida', name: 'Parker Filter CCV55248-08', category: 'Air Filters', stock: 5, threshold: 1, image: '/IMG_20260205_112139.jpg' },
  { id: 8, ship: 'Rapida', name: 'Red Oval Air Filter', category: 'Air Filters', stock: 4, threshold: 1, image: '/IMG_20260205_112418.jpg' },
  { id: 9, ship: 'Rapida', name: 'Donaldson Secondary Filter', category: 'Air Filters', stock: 1, threshold: 1, image: '/IMG_20260205_131824.jpg' },
  { id: 10, ship: 'Rapida', name: 'Scania Engine Air Filter', category: 'Air Filters', stock: 1, threshold: 1, image: '/IMG_20260205_131217.jpg' },
  { id: 11, ship: 'Rapida', name: 'Main Air Intake Filter (Large)', category: 'Air Filters', stock: 1, threshold: 1, image: '/IMG_20260205_131857.jpg' },
  { id: 17, ship: 'Rapida', name: 'Fleetguard AF25557 (Air Filter)', category: 'Air Filters', stock: 1, threshold: 1, image: '/IMG_20260205_111430.jpg' },
  { id: 18, ship: 'Rapida', name: 'Fleetguard AH8899 (Air Filter)', category: 'Air Filters', stock: 5, threshold: 1, image: '/IMG_20260205_111345.jpg' },
  { id: 26, ship: 'Rapida', name: 'Fleetguard AF25557 (Air Filter)', category: 'Air Filters', stock: 1, threshold: 1, image: '/IMG_20260202_084832.jpg' },
  { id: 36, ship: 'Rapida', name: 'Black Mesh Air Filter', category: 'Air Filters', stock: 3, threshold: 1, image: '/IMG_20260202_085426.jpg' },

  // --- ENGINE PARTS ---
  { id: 5, ship: 'Rapida', name: 'Hatz Diesel Filter 502 515 00', category: 'Engine Parts', stock: 12, threshold: 3, image: '/IMG_20260205_111601.jpg' },
  { id: 12, ship: 'Rapida', name: 'Scania Centrifugal Housing', category: 'Engine Parts', stock: 1, threshold: 1, image: '/IMG_20260205_131234.jpg' },
  { id: 28, ship: 'Rapida', name: 'Anglo Belgian Corp 620.051.1105.02 (V10)', category: 'Engine Parts', stock: 5, threshold: 1, image: '/IMG_20260202_085141.jpg' },
  { id: 32, ship: 'Rapida', name: 'Filter Elements Kit F11-1413', category: 'Engine Parts', stock: 2, threshold: 1, image: '/IMG_20260202_084438.jpg' },
  { id: 33, ship: 'Rapida', name: 'UFI Filters ERA32NCD (77301-32-P25)', category: 'Engine Parts', stock: 2, threshold: 1, image: '/IMG_20260202_085539.jpg' },
  { id: 40, ship: 'Rapida', name: 'Anglo Belgian Corp 620.031.1104.04 (V12)', category: 'Engine Parts', stock: 5, threshold: 1, image: '/IMG_20260202_084554.jpg' },

  // --- FLUIDS & TESTING ---
  { id: 29, ship: 'Rapida', name: 'Castrol Labcheck Kit 6 Samples', category: 'Fluids & Testing', stock: 6, threshold: 1, image: '/IMG_20260203_084359.jpg' },
  { id: 42, ship: 'Rapida', name: 'Imbema Cleton Grease SF01', category: 'Fluids & Testing', stock: 1, threshold: 1, image: '/IMG_20260203_082556.jpg' },

  // --- SAFETY ---
  { id: 31, ship: 'Rapida', name: 'Sekur DIRIN 230 A2B2E2K2P3', category: 'Safety', stock: 5, threshold: 1, image: '/IMG_20260203_083615.jpg' },

  // --- OTHER ---
  { id: 14, ship: 'Rapida', name: 'Orange Filter Element', category: 'Other', stock: 4, threshold: 1, image: '/IMG_20260205_112017.jpg' },
  { id: 23, ship: 'Rapida', name: 'Large Metal Mesh Filter Cartridge', category: 'Other', stock: 1, threshold: 1, image: '/IMG_20260202_084147.jpg' },
  { id: 25, ship: 'Rapida', name: 'Small Orange Filter Element', category: 'Other', stock: 3, threshold: 1, image: '/IMG_20260203_082828.jpg' },
  { id: 30, ship: 'Rapida', name: 'Large Pleated Paper Cartridge', category: 'Other', stock: 1, threshold: 1, image: '/IMG_20260202_084340.jpg' },
  
  // --- TEST DATA FOR RAPIDO ---
  { id: 43, ship: 'Rapido', name: 'Sample Air Filter', category: 'Air Filters', stock: 5, threshold: 2, image: null }
];


export default function App() {
  const [selectedShip, setSelectedShip] = useState('Rapida'); 
  const [view, setView] = useState('inventory');
  
  const [parts, setParts] = useState([]); 
  const [reports, setReports] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); 
  
  // State for Add Report
  const [newReport, setNewReport] = useState({ title: '', description: '', image: null });
  const [showAddModal, setShowAddModal] = useState(false);

  // State for Add Part
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [newPart, setNewPart] = useState({ name: '', category: CATEGORIES[0], stock: 1, threshold: 1, image: null });

  // --- DATABASE CONNECTION FOR INVENTORY ---
  useEffect(() => {
    if (!db) return; 
    const unsubscribe = onSnapshot(collection(db, 'parts'), (snapshot) => {
      if (snapshot.empty) {
        // Upload initial parts if database is empty
        INITIAL_PARTS.forEach(async (part) => {
          await setDoc(doc(db, 'parts', part.id.toString()), part);
        });
      } else {
        const partsData = snapshot.docs.map(doc => ({ id: Number(doc.id), ...doc.data() }));
        setParts(partsData.sort((a, b) => a.id - b.id));
      }
    });
    return () => unsubscribe();
  }, []);

  // --- DATABASE CONNECTION FOR REPORTS ---
  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(collection(db, 'reports'), (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({ id: Number(doc.id), ...doc.data() }));
      setReports(reportsData.sort((a, b) => b.id - a.id));
    });
    return () => unsubscribe();
  }, []);

  // Search & Ship & Category filter logic
  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      const matchesShip = part.ship === selectedShip || (!part.ship && selectedShip === 'Rapida');
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
      return matchesShip && matchesSearch && matchesCategory;
    });
  }, [parts, searchTerm, selectedCategory, selectedShip]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
       return report.ship === selectedShip || (!report.ship && selectedShip === 'Rapida');
    });
  }, [reports, selectedShip]);

  // Update stock
  const updateStock = async (id, delta) => {
    if (!db) return;
    const partToUpdate = parts.find(p => p.id === id);
    if (partToUpdate) {
      const partRef = doc(db, 'parts', id.toString());
      await updateDoc(partRef, {
        stock: Math.max(0, partToUpdate.stock + delta)
      });
    }
  };

  // --- FUNCTIONS FOR REPORTS ---
  const handleAddReport = async (e) => {
    e.preventDefault();
    if (!newReport.title || !newReport.description || !db) return;

    const newId = Date.now();
    const report = {
      id: newId,
      ship: selectedShip,
      ...newReport,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Open'
    };

    await setDoc(doc(db, 'reports', newId.toString()), report);
    setNewReport({ title: '', description: '', image: null });
    setShowAddModal(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReport(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- FUNCTIONS FOR INVENTORY ---
  const handleAddPart = async (e) => {
    e.preventDefault();
    if (!newPart.name || !db) return;

    const newId = Date.now();
    const part = {
      id: newId,
      ship: selectedShip,
      name: newPart.name,
      category: newPart.category,
      stock: parseInt(newPart.stock, 10) || 0,
      threshold: parseInt(newPart.threshold, 10) || 0,
      image: newPart.image
    };

    await setDoc(doc(db, 'parts', newId.toString()), part);
    setNewPart({ name: '', category: selectedCategory === 'All' ? CATEGORIES[0] : selectedCategory, stock: 1, threshold: 1, image: null });
    setShowAddPartModal(false);
  };

  const handlePartImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPart(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- UI RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-[#0f172a] text-white shadow-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg shadow-inner flex items-center justify-center">
              <Anchor size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">Hoeve Shipping</h1>
              <p className="text-[10px] uppercase tracking-widest text-blue-400 font-semibold mt-1">Fleet Maintenance</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm border border-white/5 w-full sm:w-auto">
            <button 
              onClick={() => setView('inventory')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg transition-all text-sm font-medium ${view === 'inventory' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <Package size={16} />
              Inventory
            </button>
            <button 
              onClick={() => setView('reports')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-lg transition-all text-sm font-medium ${view === 'reports' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <ClipboardList size={16} />
              Reports
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* --- SHIP SELECTION BAR --- */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-200/50 p-1.5 rounded-full inline-flex shadow-inner">
            {SHIPS.map(ship => (
              <button
                key={ship}
                onClick={() => setSelectedShip(ship)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black tracking-wide transition-all duration-300 ${
                  selectedShip === ship
                    ? 'bg-white text-blue-600 shadow-md transform scale-100'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 scale-95'
                }`}
              >
                <Ship size={18} className={selectedShip === ship ? "text-blue-500" : "text-slate-400"} />
                {ship.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {view === 'inventory' ? (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Inventory</h2>
                <p className="text-slate-500">Manage your spare parts for {selectedShip}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setNewPart(prev => ({ ...prev, category: selectedCategory === 'All' ? CATEGORIES[0] : selectedCategory }));
                    setShowAddPartModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add Part</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
              <div className="relative group w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by name..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Horizontally scrollable category filter */}
              <div className="flex overflow-x-auto gap-2 pb-2 mt-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`whitespace-nowrap py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedCategory === 'All' 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Filter size={16} className={selectedCategory === 'All' ? 'text-white' : 'text-slate-400'}/>
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                      selectedCategory === cat 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParts.length > 0 ? filteredParts.map(part => (
                <div key={part.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-[16/9] relative bg-slate-200 flex items-center justify-center overflow-hidden">
                    {part.image ? (
                      <img 
                        src={part.image} 
                        alt={part.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Camera size={48} className="mb-2 opacity-30" />
                        <span className="text-xs font-bold uppercase tracking-widest">No Photo</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter text-slate-700 shadow-sm border border-slate-100">
                        {part.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="h-12 flex items-start">
                      <h3 className="font-bold text-lg text-slate-800 leading-tight line-clamp-2">{part.name}</h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">In Stock</p>
                        <p className={`text-3xl font-black ${part.stock <= part.threshold ? 'text-rose-500' : 'text-slate-800'}`}>
                          {part.stock}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button 
                          onClick={() => updateStock(part.id, -1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-90"
                        >
                          <Minus size={18} />
                        </button>
                        <button 
                          onClick={() => updateStock(part.id, 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-90"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full bg-white border border-slate-200 border-dashed rounded-[2rem] py-16 text-center flex flex-col items-center">
                  <Package size={48} className="text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-slate-600">No items found</h3>
                  <p className="text-slate-400 text-sm mt-1">The list for {selectedShip} is empty in this category.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Fault Reports</h2>
                <p className="text-slate-500">Logbook for vessel {selectedShip}</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-5 sm:px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">New Report</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>

            {filteredReports.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Active Issues</h3>
                <p className="text-slate-500 mt-2 text-sm max-w-xs">Everything is working properly on the {selectedShip}. Use the button above to report a new issue.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map(report => (
                  <div key={report.id} className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                    {report.image && (
                      <div className="w-full sm:w-32 h-40 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
                        <img src={report.image} alt={report.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-bold text-lg text-slate-800">{report.title}</h3>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0">
                          {report.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">"{report.description}"</p>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest pt-2">{report.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- ADD PART MODAL --- */}
      {showAddPartModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Add Part</h2>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Vessel: {selectedShip}</p>
              </div>
              <button onClick={() => setShowAddPartModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPart} className="p-6 sm:p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Part Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. V-belt 1250mm"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium placeholder:text-slate-400 text-sm"
                  value={newPart.name}
                  onChange={(e) => setNewPart({...newPart, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Current Stock</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm"
                    value={newPart.stock}
                    onChange={(e) => setNewPart({...newPart, stock: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Low Stock Alert</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm"
                    value={newPart.threshold}
                    onChange={(e) => setNewPart({...newPart, threshold: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Type / Category</label>
                <select 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm"
                  value={newPart.category}
                  onChange={(e) => setNewPart({...newPart, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Part Photo</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePartImageUpload}
                    className="hidden" 
                    id="part-photo-upload"
                  />
                  <label 
                    htmlFor="part-photo-upload" 
                    className={`flex flex-col items-center justify-center w-full ${newPart.image ? 'h-48' : 'h-32'} border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 transition-all active:scale-[0.98] overflow-hidden`}
                  >
                    {newPart.image ? (
                      <div className="relative w-full h-full p-2 group/img">
                        <img src={newPart.image} className="w-full h-full object-cover rounded-lg shadow-sm" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-lg m-2">
                          <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Change Photo</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 text-blue-500 group-hover:scale-110 transition-transform">
                          <ImagePlus size={20} />
                        </div>
                        <span className="text-sm font-bold text-blue-700">Add a photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] text-sm"
                >
                  Save Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD REPORT MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Maintenance Log</h2>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">Vessel: {selectedShip}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddReport} className="p-6 sm:p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Issue Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Broken valve..."
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium placeholder:text-slate-400 text-sm"
                  value={newReport.title}
                  onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Details</label>
                <textarea 
                  rows="3"
                  placeholder="Describe the issue..."
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium placeholder:text-slate-400 text-sm resize-none"
                  value={newReport.description}
                  onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Photo Evidence</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden" 
                    id="report-photo-upload"
                  />
                  <label 
                    htmlFor="report-photo-upload" 
                    className={`flex flex-col items-center justify-center w-full ${newReport.image ? 'h-48' : 'h-36'} border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 transition-all active:scale-[0.98] overflow-hidden`}
                  >
                    {newReport.image ? (
                      <div className="relative w-full h-full p-2 group/img">
                        <img src={newReport.image} className="w-full h-full object-cover rounded-lg shadow-sm" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center rounded-lg m-2">
                          <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Change Photo</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 text-blue-500 group-hover:scale-110 transition-transform">
                          <Camera size={24} />
                        </div>
                        <span className="text-sm font-bold text-blue-700">Click to upload a photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest shadow-md shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] text-sm"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}