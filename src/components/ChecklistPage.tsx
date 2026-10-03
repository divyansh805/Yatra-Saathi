import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ALL_INDIAN_STATES_AND_UTS,
  getDestinationData,
} from '../data/destinationsData';
import { ChecklistItem, DestinationItem, TravellersCount } from '../types';
import {
  CheckSquare,
  Sparkles,
  Calendar,
  Users,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Phone,
  AlertTriangle,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Luggage,
  FileText,
  Compass,
  ArrowRight,
  Sun,
  CloudSnow,
  Umbrella,
} from 'lucide-react';
import { motion } from 'motion/react';

export const ChecklistPage: React.FC = () => {
  const {
    activeSearch,
    setActiveSearch,
    completedChecklistIds,
    toggleChecklistItem,
    resetChecklist,
    showToast,
    setCurrentPage,
  } = useApp();

  // Local Form state
  const [selectedState, setSelectedState] = useState<string>(activeSearch.state || 'Jammu & Kashmir');
  const [selectedDestinationName, setSelectedDestinationName] = useState<string>(
    activeSearch.destination || 'Vaishno Devi (Katra)'
  );
  const [arrivalDate, setArrivalDate] = useState<string>(activeSearch.arrivalDate);
  const [travellers, setTravellers] = useState<TravellersCount>(activeSearch.travellers);
  const [isTravellerPickerOpen, setIsTravellerPickerOpen] = useState(false);

  // Active Destination data
  const [activeDestination, setActiveDestination] = useState<DestinationItem>(() =>
    getDestinationData(selectedDestinationName)
  );

  // State's destinations list
  const stateDestinations = useMemo(() => {
    const s = ALL_INDIAN_STATES_AND_UTS.find((item) => item.name === selectedState);
    return s ? s.destinations : [selectedDestinationName];
  }, [selectedState, selectedDestinationName]);

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const s = ALL_INDIAN_STATES_AND_UTS.find((item) => item.name === newState);
    if (s && s.destinations.length > 0) {
      setSelectedDestinationName(s.destinations[0]);
    }
  };

  const handleGenerateChecklist = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const destData = getDestinationData(selectedDestinationName);
    setActiveDestination(destData);
    setActiveSearch((prev) => ({
      ...prev,
      state: selectedState,
      destination: selectedDestinationName,
      arrivalDate,
      travellers,
    }));
    showToast(`Checklist generated for ${selectedDestinationName}!`, 'success');
  };

  // Build Dynamic Checklist Items based on destination type, climate, travellers & permits
  const checklistData = useMemo(() => {
    const isHill =
      activeDestination.category === 'Hill Station' ||
      activeDestination.climateType === 'cold' ||
      activeDestination.climateType === 'hilly';
    const isBeach = activeDestination.category === 'Beach';
    const isReligious = activeDestination.category === 'Religious';
    const hasSeniors = travellers.seniors > 0;
    const hasChildren = travellers.children > 0;

    // 1. Documents & IDs
    const documents: ChecklistItem[] = [
      {
        id: 'doc-gov-id',
        category: 'documents',
        title: 'Original Government Photo ID (Aadhaar / Passport / Voter ID)',
        description: 'Mandatory for all adult travellers at airport, railway station, and hotel check-in.',
        isOfficialRequirement: true,
        officialSourceUrl: 'https://uidai.gov.in',
        officialSourceLabel: 'Govt of India ID Guidelines',
      },
      {
        id: 'doc-booking-confirm',
        category: 'documents',
        title: 'Confirmed Accommodation & Transit Tickets (Digital + 1 Printout)',
        description: 'Keep offline PDF copies and at least one physical paper printout in case of spotty mobile network.',
        isOfficialRequirement: false,
      },
    ];

    // Destination-specific official permits
    if (activeDestination.officialPermits && activeDestination.officialPermits.length > 0) {
      activeDestination.officialPermits.forEach((permit, idx) => {
        documents.push({
          id: `permit-${idx}`,
          category: 'documents',
          title: `Mandatory Permit: ${permit.name}`,
          description: permit.notes,
          isOfficialRequirement: true,
          officialSourceUrl: permit.sourceUrl,
          officialSourceLabel: permit.portalName,
        });
      });
    } else if (activeDestination.id.includes('vaishno')) {
      documents.push({
        id: 'permit-yatra-rfid',
        category: 'documents',
        title: 'Mandatory Shrine Board RFID Yatra Access Slip',
        description: 'Compulsory for starting trek past Banganga. Available free online or at Katra station counters.',
        isOfficialRequirement: true,
        officialSourceUrl: 'https://www.maavaishnodevi.org',
        officialSourceLabel: 'SMVDSB Official Portal',
      });
    }

    // 2. What to Pack - Clothing
    const clothing: ChecklistItem[] = [];
    if (isHill) {
      clothing.push(
        {
          id: 'pack-cloth-woolens',
          category: 'clothing',
          title: 'Heavy Woolens & Fleece Thermal Innerwear',
          description: 'High-altitude evenings drop sharply. Pack thermals, windcheater jacket, and woollen socks.',
          weatherDependent: true,
        },
        {
          id: 'pack-cloth-trek-shoes',
          category: 'clothing',
          title: 'Sturdy Non-Slip Walking / Trekking Shoes',
          description: 'Essential for paved stone trails, slopes, and long walking circuits.',
        },
        {
          id: 'pack-cloth-gloves-cap',
          category: 'clothing',
          title: 'Warm Beanie Cap, Muffler & Gloves',
          description: 'Protects ears and hands against cold mountain winds.',
        }
      );
    } else if (isBeach) {
      clothing.push(
        {
          id: 'pack-cloth-cotton',
          category: 'clothing',
          title: 'Breathable Light Cotton Attire & Beachwear',
          description: 'Loose-fitting linen or cotton shirts, shorts, and quick-dry swimwear.',
          weatherDependent: true,
        },
        {
          id: 'pack-cloth-sandals',
          category: 'clothing',
          title: 'Waterproof Sandals / Flip-Flops & Sunglasses',
          description: 'Comfortable footwear for sand walks and UV-protection polarized sunglasses.',
        }
      );
    } else {
      clothing.push(
        {
          id: 'pack-cloth-smart-casual',
          category: 'clothing',
          title: 'Comfortable Cotton Clothes & Walking Shoes',
          description: 'Breathable everyday clothing suited for walking and sightseeing.',
        },
        {
          id: 'pack-cloth-shawl',
          category: 'clothing',
          title: 'Light Scarf / Stole for Temple & Cultural Sites',
          description: 'Useful for covering head and shoulders at historic shrines and places of worship.',
        }
      );
    }

    if (isReligious) {
      clothing.push({
        id: 'pack-cloth-modest',
        category: 'clothing',
        title: 'Modest Traditional Attire (Dhoti / Kurta / Saree / Salwar)',
        description: 'Several major temple sanctums mandate traditional Indian attire for entering the inner enclosure.',
      });
    }

    // 3. What to Pack - Medicines & First Aid (Travel essentials, non-prescriptive)
    const medicines: ChecklistItem[] = [
      {
        id: 'pack-med-first-aid',
        category: 'medicines',
        title: 'First-Aid Kit (Bandages, Antiseptic Cream, Blister Pads)',
        description: 'For minor scrapes, cuts, or walking blisters during long sightseeing days.',
      },
      {
        id: 'pack-med-ors',
        category: 'medicines',
        title: 'Oral Rehydration Salts (ORS) & Electrolyte Sachets',
        description: 'Essential to prevent dehydration during travel and active day tours.',
      },
      {
        id: 'pack-med-motion',
        category: 'medicines',
        title: 'Travel Sickness & Mild Digestive Aids',
        description: 'Consult your doctor or carry your preferred motion sickness tablets for winding mountain or sea transit.',
      },
    ];

    if (hasSeniors) {
      medicines.push({
        id: 'pack-med-senior-stock',
        category: 'medicines',
        title: 'Prescription Medicines for Seniors (+5 Days Buffer)',
        description: 'Carry all daily blood pressure, cardiac, or diabetic medications in cabin luggage with doctor prescriptions.',
        recommendedFor: 'Senior Citizens',
      });
    }

    if (hasChildren) {
      medicines.push({
        id: 'pack-med-child-pediatric',
        category: 'medicines',
        title: 'Pediatric Care Essentials & Wet Wipes',
        description: 'Paediatric fever drops, mosquito repellent roll-on, and sanitizing wipes.',
        recommendedFor: 'Families with Children',
      });
    }

    // 4. Electronics & Gadgets
    const electronics: ChecklistItem[] = [
      {
        id: 'pack-elec-powerbank',
        category: 'electronics',
        title: 'High-Capacity Power Bank (10,000–20,000 mAh)',
        description: 'Cold temperatures and continuous GPS map usage drain phone batteries quickly.',
      },
      {
        id: 'pack-elec-offline-maps',
        category: 'electronics',
        title: 'Download Google Offline Maps & Offline Boarding Passes',
        description: 'Mobile data signals frequently fluctuate in hill valleys, coastal stretches, and ghats.',
      },
      {
        id: 'pack-elec-chargers',
        category: 'electronics',
        title: 'Mobile Chargers & Multi-Plug Extension',
        description: 'Essential for recharging multiple family devices simultaneously at hotel rooms.',
      },
    ];

    // 5. Personal Essentials
    const essentials: ChecklistItem[] = [
      {
        id: 'pack-ess-sunscreen',
        category: 'essentials',
        title: 'Broad Spectrum Sunscreen (SPF 40+) & Lip Balm',
        description: 'UV radiation is high in both snowy mountain terrains and coastal beach shores.',
      },
      {
        id: 'pack-ess-waterbottle',
        category: 'essentials',
        title: 'Reusable Insulated Steel Water Bottle',
        description: 'Refill at verified pure RO stations; reduces single-use plastic waste.',
      },
      {
        id: 'pack-ess-cash',
        category: 'essentials',
        title: 'Emergency Cash in Smaller Denominations (₹100, ₹200)',
        description: 'UPI connectivity may be intermittent at remote toll booths, pony stands, and local stalls.',
      },
    ];

    // 6. Before You Leave (Actionable Pre-Trip Checklist)
    const preparation: ChecklistItem[] = [
      {
        id: 'prep-hotel-reconfirm',
        category: 'preparation',
        title: 'Reconfirm Check-in Time & Late Arrival Notice with Hotel',
        description: 'Call the hotel front desk 24 hours prior to confirm room allocation and early/late check-in.',
        isOfficialRequirement: false,
      },
      {
        id: 'prep-train-pnr-flight',
        category: 'preparation',
        title: 'Verify Train PNR / Flight Web Check-in & Departure Terminal',
        description: 'Check official railway/airline portals for platform numbers or gate updates.',
        officialSourceUrl: 'https://www.irctc.co.in',
        officialSourceLabel: 'IRCTC / Flight Status Portal',
      },
      {
        id: 'prep-weather-notices',
        category: 'preparation',
        title: 'Check Official Regional Weather & Highway Road Notices',
        description: `Review India Meteorological Department (IMD) or State Disaster Management bulletins for ${activeDestination.state}.`,
        officialSourceUrl: 'https://mausam.imd.gov.in',
        officialSourceLabel: 'IMD National Weather Portal',
      },
      {
        id: 'prep-save-contacts',
        category: 'preparation',
        title: 'Save Official Local Emergency & Tourism Numbers Offline',
        description: 'Save National Emergency (112) and state tourism helplines into your phone memory.',
      },
    ];

    return {
      documents,
      clothing,
      medicines,
      electronics,
      essentials,
      preparation,
      all: [
        ...documents,
        ...clothing,
        ...medicines,
        ...electronics,
        ...essentials,
        ...preparation,
      ],
    };
  }, [activeDestination, travellers]);

  // Readiness Calculation
  const totalCount = checklistData.all.length;
  const completedCount = checklistData.all.filter((item) =>
    completedChecklistIds.includes(item.id)
  ).length;
  const remainingCount = totalCount - completedCount;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Timeline Items
  const timelineStages = [
    {
      stage: 'Before Trip (3-7 Days Ahead)',
      icon: Luggage,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      tasks: [
        'Collect valid Photo IDs for all travellers',
        'Verify accommodation booking & transit tickets',
        'Pack destination-appropriate attire & power bank',
        'Download offline maps and emergency contacts',
      ],
    },
    {
      stage: 'Arrival Day',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      tasks: [
        `Arrive at ${activeDestination.name} via ${activeDestination.nearestTransit.railwayStation}`,
        'Complete hotel check-in and inspect ground reality facilities',
        'Obtain destination registration / RFID permits if applicable',
        'Acclimatize / rest before starting long sightseeing tours',
      ],
    },
    {
      stage: 'During Trip',
      icon: Compass,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      tasks: [
        `Visit selected landmark: ${activeDestination.landmarks[0]?.name || 'Central Landmark'}`,
        'Explore local regional thalis and verified dining options',
        'Keep emergency helpline (112) and tourism desk numbers handy',
        'Check entry timings and sunrise/sunset schedules',
      ],
    },
    {
      stage: 'Before Return',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      tasks: [
        'Inspect hotel room thoroughly for chargers and personal IDs',
        'Confirm return railway / flight schedule and terminal',
        'Settle hotel dues and collect property bill',
      ],
    },
  ];

  return (
    <div className="pt-28 pb-24 bg-[#FAF9F6] min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>Smart Travel Readiness</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Your Travel Checklist
            </h1>
            <p className="text-base text-slate-600 mt-1 font-normal">
              Prepare before you leave. Travel with confidence.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('dashboard')}
            className="self-start sm:self-center px-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-teal-600" />
            <span>Return to Journey Planner</span>
          </button>
        </div>

        {/* 1. DESTINATION SELECTION BAR (Section 17) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm relative z-20">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Where are you travelling?
          </div>

          <form onSubmit={handleGenerateChecklist} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              {/* Select State / UT */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  State / Union Territory *
                </label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full pl-3.5 pr-8 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold text-slate-900 bg-slate-50/70 transition-all cursor-pointer appearance-none"
                  >
                    {ALL_INDIAN_STATES_AND_UTS.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} ({s.type === 'Union Territory' ? 'UT' : 'State'})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Select Destination */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Destination *
                </label>
                <div className="relative">
                  <select
                    value={selectedDestinationName}
                    onChange={(e) => setSelectedDestinationName(e.target.value)}
                    className="w-full pl-3.5 pr-8 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold text-slate-900 bg-slate-50/70 transition-all cursor-pointer appearance-none"
                  >
                    {stateDestinations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Date of Arrival */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date of Arrival *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full pl-3.5 pr-3 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold text-slate-900 bg-slate-50/70 cursor-pointer"
                  />
                </div>
              </div>

              {/* Number of Travellers */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Travellers *
                </label>
                <button
                  type="button"
                  onClick={() => setIsTravellerPickerOpen(!isTravellerPickerOpen)}
                  className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/70 flex items-center justify-between text-left hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-700" />
                    <span>
                      {travellers.total} {travellers.total === 1 ? 'Guest' : 'Guests'} ({travellers.adults}A, {travellers.children}C, {travellers.seniors}S)
                    </span>
                  </span>
                  {isTravellerPickerOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  Checklist dynamically customizes for <strong>{selectedDestinationName}</strong> ({activeDestination.category}, {activeDestination.climateType} climate).
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-teal-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Generate My Checklist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* 2. TRIP READINESS PROGRESS CARD (Section 21) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                Trip Readiness Score
              </div>
              <h2 className="font-display text-2xl font-extrabold text-slate-900">
                {percentage}% Ready for {activeDestination.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Check off tasks and packed items as you prepare for departure.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  <span>{completedCount} Completed</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-medium">
                  <span>{remainingCount} Remaining</span>
                </span>
              </div>

              <button
                onClick={resetChecklist}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                title="Reset checklist"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500"
            />
          </div>
        </div>

        {/* 3. CHECKLIST SECTIONS (Sections 18, 19, 20) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checklist Items (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section A: Documents & IDs */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Documents & Mandatory IDs
                    </h3>
                    <p className="text-xs text-slate-500">
                      Essential identification and travel approvals for {activeDestination.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {checklistData.documents.map((item) => {
                  const isChecked = completedChecklistIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-slate-50/70 border-slate-200 opacity-80'
                          : 'bg-white border-slate-200 hover:border-teal-300 shadow-2xs'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 pointer-events-none"
                      />

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4
                            className={`text-xs font-bold ${
                              isChecked ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {item.title}
                          </h4>
                          {item.isOfficialRequirement && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                              Official Requirement
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {item.description}
                        </p>

                        {/* SOURCE / VERIFY button */}
                        {item.officialSourceUrl && (
                          <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={item.officialSourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors shadow-2xs"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                              <span>SOURCE / VERIFY ({item.officialSourceLabel || 'Official Portal'})</span>
                              <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section B: What to Pack (Clothing, Medicines, Electronics, Essentials) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Luggage className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    What to Pack for {activeDestination.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Smart luggage recommendations adjusted for local terrain and family needs
                  </p>
                </div>
              </div>

              {/* Sub-category: Clothing */}
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  {activeDestination.climateType === 'cold' ? (
                    <CloudSnow className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <span>Destination Clothing & Footwear</span>
                </div>
                <div className="space-y-2">
                  {checklistData.clothing.map((item) => {
                    const isChecked = completedChecklistIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked ? 'bg-slate-50/70 border-slate-200 opacity-75' : 'bg-white border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 pointer-events-none"
                        />
                        <div>
                          <div className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-category: Medicines & First Aid */}
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>Medicines & Health Essentials</span>
                  <span className="text-[10px] text-slate-400 font-normal">Travel guidance, not medical prescription</span>
                </div>
                <div className="space-y-2">
                  {checklistData.medicines.map((item) => {
                    const isChecked = completedChecklistIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked ? 'bg-slate-50/70 border-slate-200 opacity-75' : 'bg-white border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 pointer-events-none"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {item.title}
                            </span>
                            {item.recommendedFor && (
                              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                                {item.recommendedFor}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-category: Electronics & Essentials */}
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Electronics, Connectivity & Essentials
                </div>
                <div className="space-y-2">
                  {[...checklistData.electronics, ...checklistData.essentials].map((item) => {
                    const isChecked = completedChecklistIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked ? 'bg-slate-50/70 border-slate-200 opacity-75' : 'bg-white border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 pointer-events-none"
                        />
                        <div>
                          <div className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section C: Destination-Specific Preparation (Section 20) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Before You Leave — Ground Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official verifications to prevent last-minute transit surprises
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {checklistData.preparation.map((item) => {
                  const isChecked = completedChecklistIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isChecked ? 'bg-slate-50/70 border-slate-200 opacity-80' : 'bg-white border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 pointer-events-none"
                      />
                      <div className="flex-1">
                        <h4 className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                        {item.officialSourceUrl && (
                          <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={item.officialSourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition-colors shadow-2xs"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                              <span>SOURCE / VERIFY ({item.officialSourceLabel})</span>
                              <ExternalLink className="w-3 h-3 ml-0.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: Important Contacts & Travel Timeline (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 1. EMERGENCY & IMPORTANT CONTACTS (Section 22) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    Important Contacts & Helplines
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Verified official authorities for {activeDestination.name}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {activeDestination.emergencyContacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs"
                  >
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{contact.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-teal-800 font-extrabold text-sm">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>{contact.number}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Source: {contact.source}
                    </div>
                    {contact.notes && (
                      <div className="text-[11px] text-slate-600 italic">
                        {contact.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. TRAVEL TIMELINE (Section 23) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    Travel Timeline
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Step-by-step preparation sequence
                  </p>
                </div>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timelineStages.map((t, idx) => {
                  const Icon = t.icon;
                  return (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-xs" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{t.stage}</div>
                        <ul className="mt-1.5 space-y-1">
                          {t.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                              <span className="text-teal-600 font-bold">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
