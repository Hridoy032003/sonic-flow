"use client";

import { useState } from "react";

interface Option {
  id: string;
  label: string;
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
        <p className="text-gray-600">{currentStep.description}</p>
      </div>

      <div className="space-y-3">
        {currentStep.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all hover:border-blue-500 hover:bg-blue-50 ${
              answers[currentStep.id] === option.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
