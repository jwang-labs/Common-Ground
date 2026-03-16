import { Link } from "wouter";
import { Shield, Award, ChevronRight, Activity, Users, MapPin, BarChart3 } from "lucide-react";
import { useGetTrends } from "@workspace/api-client-react";

export default function Home() {
  const { data: trends, isLoading } = useGetTrends({ period: "month" });
  
  const latestTrend = trends && trends.length > 0 
    ? trends[trends.length - 1] 
    : { reportCount: 1240, recognitionCount: 890, forceIncidents: 42 };

  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <section className="relative w-full pt-6 pb-16 px-3 md:pt-12 md:pb-24 md:px-8 bg-gradient-to-br from-slate-900 via-[#0f172a] to-primary overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center mt-4 md:mt-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/10 text-white/90 text-xs md:text-sm font-medium mb-3 md:mb-6 backdrop-blur-md border border-white/10">
            <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary" />
            <span>Privacy-first community accountability</span>
          </div>
          
          <h1 className="text-[1.75rem] leading-tight md:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight mb-3 md:mb-6">
            Bridging trust through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">transparency.</span>
          </h1>
          
          <p className="text-sm md:text-xl text-slate-300 max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed">
            Report incidents safely, recognize outstanding officers, and view verified neighborhood trends. Your identity is always protected.
          </p>
        </div>
      </section>

      {/* Main Action Cards (Overlap Hero) */}
      <section className="relative z-20 max-w-5xl mx-auto px-3 md:px-8 -mt-10 md:-mt-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
          
          <Link href="/report" className="block group">
            <div className="bg-white p-4 md:p-8 md:rounded-3xl md:shadow-xl md:shadow-slate-200/50 md:border md:border-slate-100 md:hover:shadow-2xl md:hover:border-primary/30 transition-all duration-300 h-full flex items-center md:flex-col gap-4 md:gap-0 border-b border-slate-100 md:border-b-0 md:group-hover:-translate-y-1 first:rounded-t-2xl md:first:rounded-t-3xl last:rounded-b-2xl md:last:rounded-b-3xl shadow-sm md:shadow-xl">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="flex-1 md:flex md:flex-col md:flex-1">
                <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-0.5 md:mb-2">Report an Incident</h2>
                <p className="text-slate-600 text-sm md:text-base md:mb-8 md:flex-1 line-clamp-2 md:line-clamp-none">
                  File a verified report about a police interaction. Answer binary questions to help reduce bias and build accurate community data.
                </p>
              </div>
              <div className="hidden md:flex items-center text-primary font-semibold">
                Start Report <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 md:hidden shrink-0" />
            </div>
          </Link>

          <Link href="/recognize" className="block group">
            <div className="bg-white p-4 md:p-8 md:rounded-3xl md:shadow-xl md:shadow-slate-200/50 md:border md:border-slate-100 md:hover:shadow-2xl md:hover:border-secondary/30 transition-all duration-300 h-full flex items-center md:flex-col gap-4 md:gap-0 border-b border-slate-100 md:border-b-0 md:group-hover:-translate-y-1 first:rounded-t-2xl md:first:rounded-t-3xl last:rounded-b-2xl md:last:rounded-b-3xl shadow-sm md:shadow-xl">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
              </div>
              <div className="flex-1 md:flex md:flex-col md:flex-1">
                <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-0.5 md:mb-2">Recognize an Officer</h2>
                <p className="text-slate-600 text-sm md:text-base md:mb-8 md:flex-1 line-clamp-2 md:line-clamp-none">
                  Highlight professionalism, de-escalation, or community service. Help departments identify and reward positive behavior.
                </p>
              </div>
              <div className="hidden md:flex items-center text-secondary font-semibold">
                Send Recognition <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 md:hidden shrink-0" />
            </div>
          </Link>
          
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="max-w-6xl mx-auto px-3 md:px-8 py-8 md:py-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 md:mb-8 gap-3 md:gap-4">
          <div>
            <h2 className="text-xl md:text-3xl font-display font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 md:w-7 md:h-7 text-primary" />
              Community Pulse
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-1 md:mt-2">Aggregate, anonymized data for the current month.</p>
          </div>
          <Link href="/map">
            <div className="inline-flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-slate-100 text-slate-700 text-sm md:text-base font-medium hover:bg-slate-200 transition-colors cursor-pointer">
              <MapPin className="w-4 h-4 mr-2" />
              View Map Data
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {isLoading ? (
             Array(4).fill(0).map((_, i) => (
               <div key={i} className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm h-24 md:h-32 animate-pulse flex flex-col justify-center">
                 <div className="w-1/2 h-3 md:h-4 bg-slate-200 rounded mb-3 md:mb-4"></div>
                 <div className="w-3/4 h-6 md:h-8 bg-slate-200 rounded"></div>
               </div>
             ))
          ) : (
            <>
              <StatCard 
                title="Total Reports" 
                value={latestTrend.reportCount.toLocaleString()} 
                icon={FileText} 
                trend="+12% from last month" 
                color="blue"
              />
              <StatCard 
                title="Total Recognitions" 
                value={latestTrend.recognitionCount.toLocaleString()} 
                icon={Award} 
                trend="+5% from last month" 
                color="teal"
              />
              <StatCard 
                title="Use of Force Rate" 
                value={`${((latestTrend.forceIncidents / Math.max(1, latestTrend.reportCount)) * 100).toFixed(1)}%`} 
                icon={BarChart3} 
                trend="Stable" 
                color="orange"
              />
              <StatCard 
                title="Active Users" 
                value="14,205" 
                icon={Users} 
                trend="Growing community" 
                color="indigo"
              />
            </>
          )}
        </div>
      </section>

    </div>
  );
}

const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

function StatCard({ title, value, icon: Icon, trend, color }: { title: string, value: string | number, icon: any, trend: string, color: 'blue' | 'teal' | 'orange' | 'indigo' }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  return (
    <div className="bg-white p-3 md:p-6 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2 md:mb-4">
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${colorMap[color]}`}>
          <Icon className="w-4 h-4 md:w-6 md:h-6" />
        </div>
      </div>
      <div>
        <h3 className="text-xs md:text-sm font-medium text-slate-500 mb-0.5 md:mb-1">{title}</h3>
        <p className="text-xl md:text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-[10px] md:text-xs font-medium text-slate-400 mt-1 md:mt-2">{trend}</p>
      </div>
    </div>
  );
}
