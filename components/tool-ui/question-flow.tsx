"use client";

import { useState } from "react";
import { ChevronLeft, CheckCircle2, ArrowRight } from "lucide-react";

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface Step {
  id: string;
  title: string;
  description: string;
  options: Option[];
}

interface QuestionFlowProps {
  id: string;
  steps: Step[];
  onComplete: (answers: Record<string, string>) => void;
}

export function QuestionFlow({ id, steps, onComplete }: QuestionFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleOptionSelect = (optionId: string) => {
    const newAnswers = {
      ...answers,
      [currentStep.id]: optionId,
    };
    setAnswers(newAnswers);

    if (isLastStep) {
      onComplete(newAnswers);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 glass rounded-[40px] shadow-2xl shadow-indigo-500/5 border-white/60">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-full">
              Step {currentStepIndex + 1}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              of {steps.length}
            </span>
          </div>
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Back
            </button>
          )}
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">{currentStep.title}</h2>
        <p className="text-slate-500 font-medium leading-relaxed">{currentStep.description}</p>
      </div>

      <div className="space-y-4">
        {currentStep.options.map((option) => {
          const isSelected = answers[currentStep.id] === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full group p-6 text-left rounded-[24px] border-2 transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-500/5"
                  : "border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50"
              }`}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <span className={`block font-bold text-lg mb-0.5 transition-colors ${isSelected ? "text-indigo-600" : "text-slate-900"}`}>
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="text-sm text-slate-400 font-medium">{option.description}</span>
                  )}
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-200"
                }`}>
                  {isSelected ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
           SonicFlow <ArrowRight size={10} /> Personalized Experience
        </p>
      </div>
    </div>
  );
}
