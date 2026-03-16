import { useState } from "react";
import { useCreateRecognition } from "@workspace/api-client-react";
import { Award, CheckCircle2, Heart, ThumbsUp, Users, ShieldCheck, UserPlus } from "lucide-react";
import type { CreateRecognitionBody } from "@workspace/api-client-react";

export default function Recognize() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateRecognitionBody>>({
    category: "professionalism"
  });
  
  const { mutate: createRecognition, isPending } = useCreateRecognition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message) return;

    createRecognition({ data: formData as CreateRecognitionBody }, {
      onSuccess: () => {
        setSubmitted(true);
      }
    });
  };

  const categories = [
    { id: "professionalism", label: "Professionalism", icon: ShieldCheck },
    { id: "de_escalation", label: "De-escalation", icon: ThumbsUp },
    { id: "community_service", label: "Community Service", icon: Users },
    { id: "helpfulness", label: "Helpfulness", icon: Heart },
    { id: "above_and_beyond", label: "Above & Beyond", icon: UserPlus },
  ];

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-3 md:px-4 py-10 md:py-16 w-full text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-teal-500/10 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
          <Award className="w-8 h-8 md:w-12 md:h-12" />
        </div>
        <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-3 md:mb-4">Recognition Sent!</h1>
        <p className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-8">
          Thank you for taking the time to highlight positive community policing. This feedback is incredibly valuable for department training and morale.
        </p>
        <button 
          onClick={() => { setSubmitted(false); setFormData({ category: "professionalism" }); }}
          className="px-6 md:px-8 py-2.5 md:py-3 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/90 transition-colors"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 md:px-4 py-4 md:py-12 w-full animate-in fade-in">
      <div className="text-center mb-5 md:mb-10">
        <div className="inline-flex items-center justify-center w-10 h-10 md:w-16 md:h-16 rounded-full bg-secondary/10 mb-2 md:mb-4">
          <Award className="w-5 h-5 md:w-8 md:h-8 text-secondary" />
        </div>
        <h1 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-1 md:mb-2">Recognize an Officer</h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">Positive reinforcement helps build the culture we want to see. Your feedback will be shared anonymously.</p>
      </div>

      <div className="bg-card rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl dark:shadow-none border border-border p-4 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-8">
          
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2 md:mb-3">Why are you recognizing them?</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setFormData({ ...formData, category: cat.id as any })}
                    className={`flex flex-col items-center justify-center gap-1.5 md:gap-2 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all ${
                      isSelected 
                        ? 'border-secondary bg-secondary/5 text-secondary shadow-sm' 
                        : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-xs md:text-sm font-semibold text-center leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5 md:mb-2">Badge Number (Optional)</label>
              <input 
                type="text" 
                value={formData.badgeNumber || ''}
                onChange={e => setFormData({ ...formData, badgeNumber: e.target.value })}
                placeholder="e.g., 12345"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5 md:mb-2">Precinct / Area (Optional)</label>
              <input 
                type="text" 
                value={formData.precinct || ''}
                onChange={e => setFormData({ ...formData, precinct: e.target.value })}
                placeholder="e.g., Downtown"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-sm md:text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5 md:mb-2">Message <span className="text-red-500">*</span></label>
            <textarea 
              required
              value={formData.message || ''}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe the positive interaction you had..."
              rows={4}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all resize-none text-sm md:text-base"
            />
          </div>

          <button 
            type="submit"
            disabled={isPending || !formData.message}
            className="w-full py-3 md:py-4 bg-secondary text-secondary-foreground rounded-full font-bold text-base md:text-lg shadow-lg shadow-secondary/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
          >
            {isPending ? "Sending..." : "Submit Recognition"} <CheckCircle2 className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
