// src/components/form/FormStepper.tsx
'use client';

import { useEffect, useState } from 'react';

interface Props {
  currentStep: number;
}

export default function FormStepper({ currentStep }: Props) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const steps = [
    { number: 1, title: 'Category' },
    { number: 2, title: 'Personal Details' },
    { number: 3, title: 'Education Details' },
    { number: 4, title: 'Submission Complete' }
  ];

  return (
    <div className="w-full py-6">
      <div className="flex flex-col items-center">
        {/* Progress bar (mobile) */}
        <div className="w-full max-w-3xl bg-gray-200 rounded-full h-2.5 mb-6 md:hidden">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        
        {/* Steps (desktop) */}
        <div className="hidden md:flex items-center w-full max-w-3xl">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-center relative flex-1">
              {/* Step connector */}
              {i > 0 && (
                <div
                  className={`absolute inset-0 flex items-center ${
                    i === steps.length - 1 ? 'w-1/2 left-0' : 'w-full'
                  }`}
                >
                  <div
                    className={`flex-grow h-0.5 transition-colors duration-300 ease-in-out ${
                      currentStep > step.number 
                        ? 'bg-blue-600' 
                        : currentStep === step.number 
                          ? 'bg-gradient-to-r from-blue-600 to-gray-300'
                          : 'bg-gray-300'
                    }`}
                  ></div>
                </div>
              )}
              
              {/* Step circle */}
              <div className="relative flex items-center justify-center z-10">
                <div
                  className={`rounded-full transition-all duration-300 ease-in-out
                    ${currentStep === step.number ? 'transform scale-110' + (animate ? ' animate-pulse' : '') : ''}
                    ${currentStep >= step.number
                      ? 'bg-blue-600 border-2 border-blue-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-500'
                    }
                    w-10 h-10 flex items-center justify-center
                  `}
                >
                  {currentStep > step.number ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="font-medium text-sm">{step.number}</span>
                  )}
                </div>
              </div>
              
              {/* Step title */}
              <div 
                className={`absolute w-full text-center mt-14 text-xs font-medium uppercase tracking-wider transition-colors duration-300
                  ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'}
                `}
              >
                {step.title}
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile step display */}
        <div className="flex justify-center md:hidden mt-4">
          <span className="text-sm text-gray-600 font-medium">
            Step {currentStep} of {steps.length} - {steps[currentStep - 1].title}
          </span>
        </div>
      </div>
    </div>
  );
}