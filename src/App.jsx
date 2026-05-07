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
  ImagePlusd
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// ENTER YOUR OWN FIREBASE CONFIG DATA HERE:
const firebaseConfig = {
  apiKey: "AIzaSyBfkx42dG7Muox66zJ3j0qIMh6GbcFBGvE",
  authDomain: "hoeve-shipping.firebaseapp.com",
  projectId: "hoeve-shipping",
  storageBucket: "hoeve-shipping.firebasestorage.app",
  messagingSenderId: "132127904238",
  appId: "1:132127904238:web:8ec7672a18be595fe8beff",
  measurementId: "G-VE2JH8JCLL"

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

const INITIAL_PARTS = [
  // --- FRONT ENGINE ROOM ---
  { id: 1, name: 'Fleetguard LF3402 (Lube Filter)', category: 'Front Engine Room', stock: 2, threshold: 1, image: 'uploaded:IMG_20260205_111738.jpg-d82b33a5-4684-4e82-a74d-6383ae0248f8' },
  { id: 2, name: 'Fleetguard LF3996 (Lube Filter)', category: 'Front Engine Room', stock: 2, threshold: 1, image: 'uploaded:IMG_20260205_111809.jpg-0e423a3b-989a-4de1-804e-10e02de8be95' },
  { id: 3, name: 'Fleetguard FS19914 (Fuel/Water Sep)', category: 'Front Engine Room', stock: 4, threshold: 2, image: 'uploaded:IMG_20260205_112241.jpg-fa80a24f-0634-46b3-a94c-f8d02a0a7454' },
  { id: 4, name: 'Fleetguard FF5626 (Fuel Filter)', category: 'Front Engine Room', stock: 2, threshold: 1, image: 'uploaded:IMG_20260205_111853.jpg-d1784496-de3d-4f4f-88d7-de4471886945' },
  { id: 5, name: 'Hatz Diesel Filter 502 515 00', category: 'Front Engine Room', stock: 12, threshold: 3, image: 'uploaded:IMG_20260205_111601.jpg-149b7ef7-c231-4c68-9799-236e21bfda08' },
  { id: 6, name: 'Yanmar Air Filter 129935-12520', category: 'Front Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260205_112200.jpg-7e95e189-6072-4a42-99ca-ac8cbc994ae4' },
  { id: 7, name: 'Parker Filter CCV55248-08', category: 'Front Engine Room', stock: 5, threshold: 1, image: 'uploaded:IMG_20260205_112139.jpg-651e314e-3d94-42b1-8f64-66c75988d0bf' },
  { id: 8, name: 'Red Oval Air Filter', category: 'Front Engine Room', stock: 4, threshold: 1, image: 'uploaded:IMG_20260205_112418.jpg-294937be-e3c3-46e1-85e6-ca7556ae246c' },
  { id: 9, name: 'Donaldson Secondary Filter', category: 'Front Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260205_131824.jpg-7874ae81-827d-4d7c-9e49-8c8a911a3e6c' },
  { id: 10, name: 'Scania Engine Air Filter', category: 'Front Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260205_131217.jpg-d5a8f67e-471f-4c5a-a637-1aa0b5a0a004' },
  { id: 11, name: 'Main Air Intake Filter (Large)', category: 'Front Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260205_131857.jpg-09409ea6-a846-440f-a701-6674d876c6ee' },
  { id: 12, name: 'Scania Centrifugal Housing', category: 'Front Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260205_131234.jpg-ec9357d0-5114-4354-9def-a8e9bdc391ff' },
  { id: 13, name: 'Yanmar Fuel Filter 129A00-55800', category: 'Front Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260205_112305.jpg-d51bc66b-3786-4b54-befe-72eb2b113349' },
  { id: 14, name: 'Orange Filter Element', category: 'Front Engine Room', stock: 4, threshold: 1, image: 'uploaded:IMG_20260205_112017.jpg-14cdf463-0207-4da6-8e49-4ab089541e94' },
  { id: 15, name: 'Fleetguard LF16243 (Lube Filter)', category: 'Front Engine Room', stock: 3, threshold: 1, image: 'uploaded:IMG_20260205_111525.jpg-483a983d-89db-4209-a60b-6b5226adceb6' },
  { id: 16, name: 'Fleetguard FF5638 (Fuel Filter)', category: 'Front Engine Room', stock: 4, threshold: 1, image: 'uploaded:IMG_20260205_111507.jpg-d6b5c8b0-0977-4bdc-9a8f-559ab6753f23' },
  { id: 17, name: 'Fleetguard AF25557 (Air Filter)', category: 'Front Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260205_111430.jpg-2cf7883e-e132-48b3-ab8f-9890c7cade26' },
  { id: 18, name: 'Fleetguard AH8899 (Air Filter)', category: 'Front Engine Room', stock: 5, threshold: 1, image: 'uploaded:IMG_20260205_111345.jpg-e95dbfe3-959c-499a-96e8-40ad4eb45ee2' },
  { id: 19, name: 'Fleetguard FS19861', category: 'Front Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260205_111144.jpg-c7042051-493a-4224-9bf5-9bbbdd899439' },
  { id: 20, name: 'White Water Filter Cartridge', category: 'Front Engine Room', stock: 2, threshold: 1, image: 'uploaded:IMG_20260205_111124.jpg-2dcc2268-3eec-4159-ba27-c1964f8033b6' },

  // --- BACK ENGINE ROOM (Deduplicated and accurately counted) ---
  { id: 21, name: 'Separ Filter SWK-2000/10', category: 'Back Engine Room', stock: 3, threshold: 1, image: 'uploaded:IMG_20260203_083810.jpg-343cad8f-9722-4cc3-9136-2ee35d087255' },
  { id: 22, name: 'Fleetguard FF5626 (Fuel Filter)', category: 'Back Engine Room', stock: 7, threshold: 2, image: 'uploaded:IMG_20260203_083135.jpg-e4b0fe0c-8747-435a-ada4-5d5e47f63fea' },
  { id: 23, name: 'Large Metal Mesh Filter Cartridge', category: 'Back Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260202_084147.jpg-030935e6-60cc-4c75-94c0-2b14f5f94a09' },
  { id: 24, name: 'Fleetguard FS19861 (Fuel/Water Sep)', category: 'Back Engine Room', stock: 7, threshold: 2, image: 'uploaded:IMG_20260203_083308.jpg-dd7fc168-965e-4758-9acf-c0c91b38f3aa' },
  { id: 25, name: 'Small Orange Filter Element', category: 'Back Engine Room', stock: 3, threshold: 1, image: 'uploaded:IMG_20260203_082828.jpg-61c4b042-96ae-4e09-80c5-b7236a63568b' },
  { id: 26, name: 'Fleetguard AF25557 (Air Filter)', category: 'Back Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260202_084832.jpg-16be7402-a260-4aa3-a9ad-75317db6cb92' },
  { id: 27, name: 'Fleetguard FS19914 (Fuel/Water Sep)', category: 'Back Engine Room', stock: 7, threshold: 2, image: 'uploaded:IMG_20260203_084057.jpg-e728a7f5-6847-48be-85a2-483c5f0508ac' },
  { id: 28, name: 'Anglo Belgian Corp 620.051.1105.02 (V10)', category: 'Back Engine Room', stock: 5, threshold: 1, image: 'uploaded:IMG_20260202_085141.jpg-4dc41bd9-d3ab-4817-a90b-deef58af1f89' },
  { id: 29, name: 'Castrol Labcheck Kit 6 Samples', category: 'Back Engine Room', stock: 6, threshold: 1, image: 'uploaded:IMG_20260203_084359.jpg-e488622a-b47e-4dbf-a633-fda0747c0c96' },
  { id: 30, name: 'Large Pleated Paper Cartridge', category: 'Back Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260202_084340.jpg-d771f022-2f97-4d8b-8ca3-d1a51b53cef0' },
  { id: 31, name: 'Sekur DIRIN 230 A2B2E2K2P3', category: 'Back Engine Room', stock: 5, threshold: 1, image: 'uploaded:IMG_20260203_083615.jpg-8067d0d2-e191-49fd-86f8-ea0499cdfad3' },
  { id: 32, name: 'Filter Elements Kit F11-1413', category: 'Back Engine Room', stock: 2, threshold: 1, image: 'uploaded:IMG_20260202_084438.jpg-c99ac9bf-ed7e-45c6-8916-bd3991c16efd' },
  { id: 33, name: 'UFI Filters ERA32NCD (77301-32-P25)', category: 'Back Engine Room', stock: 2, threshold: 1, image: 'uploaded:IMG_20260202_085539.jpg-c147afdd-284d-4719-b448-a38a93a3cbaf' },
  { id: 34, name: 'John Deere Water Separator (RE62419)', category: 'Back Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260203_082618.jpg-574c8c97-de55-4bf8-8b70-5b4236cf35fd' },
  { id: 35, name: 'Donaldson P550008', category: 'Back Engine Room', stock: 3, threshold: 1, image: 'uploaded:IMG_20260202_085301.jpg-e31ef870-26e3-4e63-bc3d-d7aa6fec012f' },
  { id: 36, name: 'Black Mesh Air Filter', category: 'Back Engine Room', stock: 3, threshold: 1, image: 'uploaded:IMG_20260202_085426.jpg-3d7cbd4c-ccc6-409e-b110-20f14fab3007' },
  { id: 37, name: 'Fleetguard LF16243 (Lube Filter)', category: 'Back Engine Room', stock: 3, threshold: 1, image: 'uploaded:IMG_20260203_082937.jpg-d265502f-8788-44fc-be8c-90f32e7ac333' },
  { id: 38, name: 'Separ Filter Element 01030', category: 'Back Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260203_083751.jpg-70b06406-bb47-40e4-825b-0c261414d34c' },
  { id: 39, name: 'Mann Filter W 75/3', category: 'Back Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260203_083840.jpg-a721ed78-0036-4dd9-806f-057d83e53e22' },
  { id: 40, name: 'Anglo Belgian Corp 620.031.1104.04 (V12)', category: 'Back Engine Room', stock: 5, threshold: 1, image: 'uploaded:IMG_20260202_084554.jpg-14e2810c-a8c9-4f50-9fa2-76982f9bdb12' },
  { id: 41, name: 'Parker Racor Filter 2020V30', category: 'Back Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260202_084350.jpg-34810255-5c2a-4c9f-8fab-1c516c6e250b' },
  { id: 42, name: 'Imbema Cleton Grease SF01', category: 'Back Engine Room', stock: 1, threshold: 1, image: 'uploaded:IMG_20260203_082556.jpg-978b0524-691b-4655-9c66-3c0295101072' }
];

const CATEGORIES = ['Front Engine Room', 'Back Engine Room'];

export default function App() {
  const [view, setView] = useState('inventory');
  
  // NOTE: parts is now empty ([]), as it will be populated live by Firebase!
  const [parts, setParts] = useState([]); 
  const [reports, setReports] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Front Engine Room');
  
  // State for Add Report
  const [newReport, setNewReport] = useState({ title: '', description: '', image: null });
  const [showAddModal, setShowAddModal] = useState(false);

  // State for Add Part
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [newPart, setNewPart] = useState({ name: '', category: 'Front Engine Room', stock: 1, threshold: 1, image: null });

  // --- DATABASE CONNECTION FOR INVENTORY ---
  useEffect(() => {
    if (!db) return; // Prevent errors if credentials are not configured
    const unsubscribe = onSnapshot(collection(db, 'parts'), (snapshot) => {
      if (snapshot.empty) {
        // If database is empty, upload the INITIAL_PARTS list once
        INITIAL_PARTS.forEach(async (part) => {
          await setDoc(doc(db, 'parts', part.id.toString()), part);
        });
      } else {
        // Fetch parts live from the cloud
        const partsData = snapshot.docs.map(doc => ({ id: Number(doc.id), ...doc.data() }));
        // Sort by ID or name
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
      // Sort newest reports at the top
      setReports(reportsData.sort((a, b) => b.id - a.id));
    });
    return () => unsubscribe();
  }, []);

  // Search filter logic
  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = part.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [parts, searchTerm, selectedCategory]);

  // Update stock (now linked to the Cloud!)
  const updateStock = async (id, delta) => {
    if (!db) return;
    const partToUpdate = parts.find(p => p.id === id);
    if (partToUpdate) {
      // Update the cloud database
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
      ...newReport,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Open'
    };

    // Save to cloud database
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
      name: newPart.name,
      category: newPart.category,
      stock: parseInt(newPart.stock, 10) || 0,
      threshold: parseInt(newPart.threshold, 10) || 0,
      image: newPart.image
    };

    // Save to cloud database
    await setDoc(doc(db, 'parts', newId.toString()), part);
    setNewPart({ name: '', category: selectedCategory, stock: 1, threshold: 1, image: null });
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

  // --- THE INTERFACE ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
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
        {view === 'inventory' ? (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Inventory</h2>
                <p className="text-slate-500">Manage your spare parts</p>
              </div>
              <button 
                onClick={() => {
                  setNewPart(prev => ({ ...prev, category: selectedCategory }));
                  setShowAddPartModal(true);
                }}
                className="bg-blue-600 text-white px-5 sm:px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Part</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search parts..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-1 py-3 px-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                      selectedCategory === cat 
                      ? 'bg-white text-blue-700 shadow-sm border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    <Wrench size={16} className={selectedCategory === cat ? 'text-blue-500' : 'text-slate-400'}/>
                    <span className="hidden sm:inline">{cat}</span>
                    <span className="sm:hidden">{cat.replace('Engine Room', 'ER')}</span>
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
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter text-slate-700 shadow-sm">
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
                  <p className="text-slate-400 text-sm mt-1">This list is currently empty.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Fault Reports</h2>
                <p className="text-slate-500">Track issues and defects</p>
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

            {reports.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Active Issues</h3>
                <p className="text-slate-500 mt-2 text-sm max-w-xs">Everything is operating smoothly. Use the button above to log a new issue.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(report => (
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
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Add New Part</h2>
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
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Category (Location)</label>
                <select 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium text-sm"
                  value={newPart.category}
                  onChange={(e) => setNewPart({...newPart, category: e.target.value})}
                >
                  <option value="Front Engine Room">Front Engine Room</option>
                  <option value="Back Engine Room">Back Engine Room</option>
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
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Maintenance Log</h2>
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
                  Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}