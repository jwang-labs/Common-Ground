import { useState } from "react";
import { useListRights } from "@workspace/api-client-react";
import { BookOpen, ChevronDown, ShieldAlert, PhoneCall, Scale, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

// Fallback data for beautiful UI even if backend doesn't seed rights
const FALLBACK_RIGHTS = [
  {
    id: 1,
    title: "During a Traffic Stop",
    category: "Traffic",
    icon: "Car",
    content: "You have the right to remain silent. You must show your driver's license, registration, and proof of insurance upon request. You do not have to consent to a search of your vehicle, but an officer may search it if they have probable cause."
  },
  {
    id: 2,
    title: "If You Are Stopped on the Street",
    category: "Street",
    icon: "Hand",
    content: "You can ask 'Am I free to go?' If the officer says yes, you may calmly walk away. If you are detained, you have the right to remain silent and cannot be punished for refusing to answer questions."
  },
  {
    id: 3,
    title: "Recording the Police",
    category: "Recording",
    icon: "Camera",
    content: "You have a First Amendment right to record police officers in public spaces, as long as you do not interfere with their operations. Keep your distance and do not hide your hands or make sudden movements."
  },
  {
    id: 4,
    title: "If Police Come to Your Home",
    category: "Home",
    icon: "Home",
    content: "You do not have to let police inside your home unless they have a warrant signed by a judge. You can ask them to slide the warrant under the door or hold it up to a window."
  }
];

export default function Rights() {
  const { data: rightsData, isLoading } = useListRights();
  const [openCardId, setOpenCardId] = useState<number | null>(1);
  
  // Use API data if available, otherwise beautiful fallback
  const rights = rightsData && rightsData.length > 0 ? rightsData : FALLBACK_RIGHTS;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 w-full animate-in fade-in">
      
      {/* Header */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 md:mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-3">Know Your Rights</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Knowledge is your best protection. Understand your legal rights during interactions with law enforcement.
          </p>
        </div>
      </div>

      {/* Emergency Quick Action */}
      <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-red-900">Need immediate legal help?</h3>
            <p className="text-sm text-red-700">If you've been arrested, ask for a lawyer immediately.</p>
          </div>
        </div>
        <button className="w-full sm:w-auto px-6 py-2.5 bg-white text-red-700 font-semibold rounded-full border border-red-200 shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
          <PhoneCall className="w-4 h-4" /> Call Legal Aid
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl"></div>
          ))
        ) : (
          rights.map((right) => (
            <div 
              key={right.id} 
              className={cn(
                "bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
                openCardId === right.id 
                  ? "border-primary shadow-lg shadow-primary/5" 
                  : "border-slate-200 hover:border-slate-300"
              )}
            >
              <button 
                onClick={() => setOpenCardId(openCardId === right.id ? null : right.id)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    openCardId === right.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className={cn(
                    "text-lg font-bold transition-colors",
                    openCardId === right.id ? "text-primary" : "text-slate-800"
                  )}>
                    {right.title}
                  </h3>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-slate-400 transition-transform duration-300",
                  openCardId === right.id && "rotate-180 text-primary"
                )} />
              </button>
              
              <div 
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  openCardId === right.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="p-5 pt-0 border-t border-slate-100 mt-2 text-slate-600 leading-relaxed text-lg">
                    {right.content}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 text-center text-sm text-slate-400">
        Disclaimer: This information is for educational purposes and does not constitute legal advice.
      </div>
    </div>
  );
}
