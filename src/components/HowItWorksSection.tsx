import React from 'react';
import { Compass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const HowItWorksSection: React.FC = () => {
  const { setCurrentPage, user } = useApp();

  const steps = [
    {
      number: '01',
      title: 'Tell Us About Your Journey',
      description: 'Choose your destination, planned travel dates, and personal travel requirements.',
      icon: Compass,
      tag: 'Step 1: Input',
    },
    {
      number: '02',
      title: 'Get Practical Insights',
      description:
        'Receive organized information about accommodation, destination requirements, accessibility, and important travel details.',
      icon: Sparkles,
      tag: 'Step 2: Synthesis',
    },
    {
      number: '03',
      title: 'Travel Prepared',
      description:
        'Follow your personalized checklist and verify important arrangements before travelling with complete peace of mind.',
      icon: CheckCircle2,
      tag: 'Step 3: Confidence',
    },
  ];

  return (
    <section className="py-24 bg-white relative border-y border-slate-200/70 overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-teal-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-teal-700 font-semibold text-xs tracking-wider uppercase inline-block mb-3">
            Simple 3-Step Journey
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4"
            style={{ textWrap: 'balance' }}
          >
            How Yatra Saathi Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From initial thought to actual departure, we guide your travel preparation in three clear, stress-free stages.
          </p>
        </div>

        {/* Steps Grid with Visual Connecting Path */}
        <div className="relative">
          {/* Desktop Visual Journey Connecting Path Line */}
          <div className="hidden lg:block absolute top-28 left-[16%] right-[16%] h-0.5 pointer-events-none -z-0">
            <div className="w-full h-full border-t-2 border-dashed border-teal-300/80" />
            {/* Animated Pulses along the line */}
            <div className="absolute top-[-5px] left-1/3 w-3 h-3 rounded-full bg-teal-500 ring-4 ring-teal-100" />
            <div className="absolute top-[-5px] left-2/3 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-cyan-100" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="bg-slate-50/80 hover:bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Step Badge & Icon Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white border border-teal-200 shadow-xs flex items-center justify-center text-teal-600">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-3xl font-extrabold font-display text-slate-300 tabular-nums">
                        {step.number}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase mb-2">
                      {step.tag}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {step.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 flex items-center text-xs font-semibold text-slate-500">
                    <span>Stage {idx + 1} of 3</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Prompter */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setCurrentPage(user ? 'dashboard' : 'login')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer group"
          >
            <span>Ready to plan? Get started with Yatra Saathi</span>
            <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
