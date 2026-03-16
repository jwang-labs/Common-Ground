import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateReport } from "@workspace/api-client-react";
import { Shield, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Car, FileBadge, User, Check, X as XIcon } from "lucide-react";
import type { CreateReportBody } from "@workspace/api-client-react";

type IncidentType = "traffic_stop" | "use_of_force" | "search" | "arrest" | "other";

export default function Report() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateReportBody>>({});
  const { mutate: createReport, isPending } = useCreateReport();

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = () => {
    const payload: CreateReportBody = {
      incidentType: formData.incidentType || "other",
      description: formData.description || "No description provided",
      ...formData
    };

    createReport({ data: payload }, {
      onSuccess: () => {
        setStep(5);
      },
      onError: (err) => {
        alert("Failed to submit report. Please try again.");
      }
    });
  };

  const updateForm = (key: keyof CreateReportBody, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto px-3 md:px-4 py-4 md:py-12 w-full animate-in fade-in">
      {/* Header */}
      <div className="text-center mb-5 md:mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full bg-primary/10 mb-2 md:mb-4">
          <Shield className="w-5 h-5 md:w-8 md:h-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-4xl font-display font-bold text-slate-900 mb-1 md:mb-2">Report an Incident</h1>
        <p className="text-sm md:text-base text-slate-600">Your privacy is protected. Identifying information is not publicly displayed.</p>
      </div>

      {/* Progress Bar */}
      {step < 5 && (
        <div className="mb-5 md:mb-8">
          <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2 px-1">
            <span className={step >= 1 ? "text-primary" : ""}>Type</span>
            <span className={step >= 2 ? "text-primary" : ""}>Details</span>
            <span className={step >= 3 ? "text-primary" : ""}>Questions</span>
            <span className={step >= 4 ? "text-primary" : ""}>Review</span>
          </div>
          <div className="w-full bg-slate-100 h-2 md:h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Form Steps Container */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl shadow-slate-200/50 border border-slate-100 p-4 md:p-10 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">What type of incident?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[
                  { id: 'traffic_stop', label: 'Traffic Stop', icon: Car },
                  { id: 'search', label: 'Search', icon: FileBadge },
                  { id: 'use_of_force', label: 'Use of Force', icon: AlertTriangle },
                  { id: 'arrest', label: 'Arrest', icon: User },
                  { id: 'other', label: 'Other', icon: Shield }
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.incidentType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => updateForm('incidentType', type.id)}
                      className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 text-left transition-all ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' 
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-2 md:p-3 rounded-full ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <span className={`font-semibold text-base md:text-lg ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Officer & Location Details</h2>
              <p className="text-sm md:text-base text-slate-500 mb-4 md:mb-6">This helps us verify the incident. All fields are optional but highly encouraged.</p>
              
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">Badge Number</label>
                  <input 
                    type="text" 
                    value={formData.badgeNumber || ''} 
                    onChange={e => updateForm('badgeNumber', e.target.value)}
                    placeholder="e.g., 12345"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">Precinct / Division</label>
                  <input 
                    type="text" 
                    value={formData.precinct || ''} 
                    onChange={e => updateForm('precinct', e.target.value)}
                    placeholder="e.g., Downtown, East Austin, Rundberg"
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm md:text-base"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">Police Vehicle Plate</label>
                    <input 
                      type="text" 
                      value={formData.plateNumber || ''} 
                      onChange={e => updateForm('plateNumber', e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">Citation Number</label>
                    <input 
                      type="text" 
                      value={formData.citationNumber || ''} 
                      onChange={e => updateForm('citationNumber', e.target.value)}
                      placeholder="If ticketed"
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Interaction Survey</h2>
              <p className="text-sm md:text-base text-slate-500 mb-4 md:mb-6">Simple yes/no questions to establish behavioral patterns.</p>
              
              <div className="space-y-3 md:space-y-4">
                <BinaryQuestion 
                  label="Did the officer explain the reason for the stop?" 
                  value={formData.explainedReason} 
                  onChange={v => updateForm('explainedReason', v)} 
                />
                <BinaryQuestion 
                  label="Was the officer polite and professional?" 
                  value={formData.wasPolite} 
                  onChange={v => updateForm('wasPolite', v)} 
                />
                <BinaryQuestion 
                  label="Do you believe the stop was lawful?" 
                  value={formData.wasLawful} 
                  onChange={v => updateForm('wasLawful', v)} 
                />
                <BinaryQuestion 
                  label="Was any physical force used?" 
                  value={formData.usedForce} 
                  onChange={v => updateForm('usedForce', v)} 
                  dangerYes
                />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Description & Submit</h2>
              <p className="text-sm md:text-base text-slate-500 mb-4 md:mb-6">Please provide any additional details about the incident.</p>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">Incident Description <span className="text-red-500">*</span></label>
                <textarea 
                  value={formData.description || ''} 
                  onChange={e => updateForm('description', e.target.value)}
                  placeholder="Describe what happened..."
                  rows={5}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-sm md:text-base"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-3 md:p-4 rounded-xl flex gap-3 text-blue-800 text-xs md:text-sm">
                <Shield className="w-4 h-4 md:w-5 md:h-5 shrink-0 mt-0.5" />
                <p>Your report will be anonymized and aggregated into neighborhood statistics. Your identifying details are never shown to the public.</p>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8 md:py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 md:mb-6">
                <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-3 md:mb-4">Report Submitted</h2>
              <p className="text-sm md:text-base text-slate-600 max-w-md mx-auto mb-6 md:mb-8">
                Thank you for contributing to community transparency. Your report has been securely logged.
              </p>
              <Link href="/">
                <button className="px-6 md:px-8 py-2.5 md:py-3 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors">
                  Return Home
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step < 5 && (
          <div className="mt-6 md:mt-10 pt-4 md:pt-6 border-t border-slate-100 flex justify-between items-center">
            {step > 1 ? (
              <button 
                onClick={handlePrev}
                className="px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div></div>}

            {step < 4 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 && !formData.incidentType}
                className="px-6 md:px-8 py-2 md:py-2.5 bg-primary text-white rounded-full font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm md:text-base"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isPending || !formData.description}
                className="px-6 md:px-8 py-2 md:py-2.5 bg-slate-900 text-white rounded-full font-semibold shadow-md shadow-slate-900/25 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm md:text-base"
              >
                {isPending ? "Submitting..." : "Submit Securely"} <Shield className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BinaryQuestion({ label, value, onChange, dangerYes = false }: { label: string, value?: boolean | null, onChange: (val: boolean) => void, dangerYes?: boolean }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
      <p className="font-medium text-slate-800 flex-1 text-sm md:text-base">{label}</p>
      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={() => onChange(true)}
          className={`flex-1 md:w-24 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-medium border-2 transition-colors flex items-center justify-center gap-1 text-sm md:text-base ${
            value === true 
              ? (dangerYes ? 'border-red-500 bg-red-50 text-red-700' : 'border-green-500 bg-green-50 text-green-700') 
              : 'border-transparent bg-white text-slate-600 hover:border-slate-200'
          }`}
        >
          <Check className="w-4 h-4" /> Yes
        </button>
        <button 
          onClick={() => onChange(false)}
          className={`flex-1 md:w-24 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl font-medium border-2 transition-colors flex items-center justify-center gap-1 text-sm md:text-base ${
            value === false 
              ? (!dangerYes ? 'border-red-500 bg-red-50 text-red-700' : 'border-green-500 bg-green-50 text-green-700') 
              : 'border-transparent bg-white text-slate-600 hover:border-slate-200'
          }`}
        >
          <XIcon className="w-4 h-4" /> No
        </button>
      </div>
    </div>
  );
}
