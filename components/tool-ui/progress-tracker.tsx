"use client";

import React from "react";

interface ProgressTrackerProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
}

export function ProgressTracker({ steps, currentStep }: ProgressTrackerProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-300"
          style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-500"
                } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
              >
                {index + 1}
              </div>
              <div className="mt-3 text-center absolute top-full w-32 -left-12">
                <p className={`text-sm font-medium ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
