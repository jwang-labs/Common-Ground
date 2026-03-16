import { useState } from "react";
import { useListRights } from "@workspace/api-client-react";
import { BookOpen, ChevronDown, ShieldAlert, PhoneCall, Scale, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

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
  
  const rights = rightsData && rightsData.length > 0 ? rightsData : FALLBACK_RIGHTS;

  return (
    <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-12 w-full animate-in fade-in">
      
      {/* Header */}
      <div className="mb-5 md:mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full bg-indigo-500/10 text-indigo-400 mb-2 md:mb-6">
            <BookOpen className="w-5 h-5 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-5xl font-display font-bold text-foreground mb-1 md:mb-3">Know Your Rights</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl">
            Knowledge is your best protection. Understand your legal rights during interactions with law enforcement.
          </p>
        </div>
      </div>

      {/* Emergency Quick Action */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl p-3 md:p-5 mb-5 md:mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 shrink-0">
            <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="font-bold text-red-400 text-sm md:text-base">Need immediate legal help?</h3>
            <p className="text-xs md:text-sm text-red-400/80">If you've been arrested, ask for a lawyer immediately.</p>
          </div>
        </div>
        <button className="w-full sm:w-auto px-5 md:px-6 py-2 md:py-2.5 bg-card text-red-400 font-semibold rounded-full border border-red-500/20 shadow-sm hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm md:text-base">
          <PhoneCall className="w-4 h-4" /> Call Legal Aid
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-3 md:space-y-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-16 md:h-20 bg-muted animate-pulse rounded-xl md:rounded-2xl"></div>
          ))
        ) : (
          rights.map((right) => (
            <div 
              key={right.id} 
              className={cn(
                "bg-card rounded-xl md:rounded-2xl border transition-all duration-300 overflow-hidden",
                openCardId === right.id 
                  ? "border-primary shadow-lg dark:shadow-none shadow-primary/5" 
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <button 
                onClick={() => setOpenCardId(openCardId === right.id ? null : right.id)}
                className="w-full flex items-center justify-between p-3.5 md:p-5 text-left focus:outline-none"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors",
                    openCardId === right.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Scale className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <h3 className={cn(
                    "text-base md:text-lg font-bold transition-colors",
                    openCardId === right.id ? "text-primary" : "text-foreground"
                  )}>
                    {right.title}
                  </h3>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ml-2",
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
                  <div className="p-3.5 md:p-5 pt-0 border-t border-border mt-1 md:mt-2 text-muted-foreground leading-relaxed text-sm md:text-lg">
                    {right.content}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 md:mt-12 text-center text-xs md:text-sm text-muted-foreground">
        Disclaimer: This information is for educational purposes and does not constitute legal advice.
      </div>
    </div>
  );
}
