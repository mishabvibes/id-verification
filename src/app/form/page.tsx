'use client';

import { useState, useEffect } from 'react';
import { FormCategory, FormStatus, InstituteType, Submission } from '@/types';
import FormStepper from '@/components/form/FormStepper';
import FormHeader from '@/components/form/FormHeader';
import PersonalDetails from '@/components/form/PersonalDetails';
import EducationDetails from '@/components/form/EducationDetails';
import FormSubmit from '@/components/form/FormSubmit';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const initialPersonalDetails = {
  name: '',
  fatherName: '',
  dateOfBirth: '',
  phoneNumber: '',
  whatsappNumber: '',
  address: '',
  photoUrl: '',
  skssflMembershipId: '',
  positionHeld: '',
};

const initialEducationDetails = {
  instituteType: 'Dars' as InstituteType,
  instituteName: '',
  principalOrMudarisName: '',
  district: '',
  state: '',
  zone: '',
  hallTicketDetails: '',
  paymentProofUrl: '',
};

export default function FormPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<FormCategory>('ECC');
  const [personalDetails, setPersonalDetails] = useState(initialPersonalDetails);
  const [educationDetails, setEducationDetails] = useState(initialEducationDetails);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<FormStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNext = () => {
    // First set visibility to false to trigger fade-out animation
    setIsVisible(false);
    
    // After animation completes, change the step
    setTimeout(() => {
      setStep(step + 1);
      window.scrollTo(0, 0);
      // Then set visibility back to true for fade-in animation
      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    }, 300);
  };

  const handlePrevious = () => {
    setIsVisible(false);
    
    setTimeout(() => {
      setStep(step - 1);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    }, 300);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const submissionData: Partial<Submission> = {
        category,
        personalDetails,
        educationDetails,
        status: FormStatus.SUBMITTED,
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form');
      }

      setSubmissionId(result.submission.uniqueId);
      setSubmissionStatus(FormStatus.SUBMITTED);
      
      // Use animation for success transition
      setIsVisible(false);
      setTimeout(() => {
        setStep(4); // Move to success step
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }, 300);
      
      toast.success('Form submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
      <FormHeader />
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-10">
       <div className="container mx-auto px-4 py-8">
  <div className="max-w-3xl mx-auto text-center space-y-4">
    <h1 className="text-2xl sm:text-3xl font-bold text-white">
      SKSSF TWALABA WING Entrance Exam Application Form
    </h1>
    <p className="text-blue-100 text-base max-w-xl mx-auto">
      Fill out your application for the entrance exam in just a few easy steps.
    </p>
  </div>
</div>


        {/* Wave Divider */}
        <div className="relative mt-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#ffffff">
            <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
          </svg>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12 -mt-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <FormStepper currentStep={step} />
          
          <div className={`bg-white rounded-2xl shadow-xl p-5 sm:p-8 md:p-10 mt-8 border border-gray-100 transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-block p-1 px-3 bg-blue-100 rounded-full mb-2">
                    <h2 className="text-sm font-semibold text-blue-700 tracking-wide uppercase">Step 1 of 3</h2>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Select Your Category
                  </h2>
                  <p className="text-gray-500 max-w-lg mx-auto">
                    Choose the category that best fits your qualification and interests
                  </p>
                </div>
                
                <div className="grid gap-5 sm:gap-6">
                  <label className={`relative flex flex-col sm:flex-row items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden group ${category === 'ECC' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-blue-50 hover:border-blue-500'}`}>
                    <div className="absolute -right-2 -top-2">
                      {category === 'ECC' && (
                        <div className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-bl-xl transform rotate-6">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4 sm:mb-0 flex-shrink-0">
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="ml-0 sm:ml-6 text-center sm:text-left flex-grow">
                      <span className="block text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        ECC - Educational Category
                      </span>
                      <span className="block text-sm text-gray-500 mt-2">
                        For students currently enrolled in educational institutions, schools, colleges, and universities. This category focuses on academic achievements and educational qualifications.
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="category"
                      checked={category === 'ECC'}
                      onChange={() => setCategory('ECC')}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 sr-only"
                    />
                  </label>
                  
                  <label className={`relative flex flex-col sm:flex-row items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden group ${category === 'TCC' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-blue-50 hover:border-blue-500'}`}>
                    <div className="absolute -right-2 -top-2">
                      {category === 'TCC' && (
                        <div className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-bl-xl transform rotate-6">
                          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 sm:mb-0 flex-shrink-0">
                      <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="ml-0 sm:ml-6 text-center sm:text-left flex-grow">
                      <span className="block text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        TCC - Technical Category
                      </span>
                      <span className="block text-sm text-gray-500 mt-2">
                        For professionals with technical skills, experience in industry or specialized fields. This category emphasizes practical knowledge and technical expertise.
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="category"
                      checked={category === 'TCC'}
                      onChange={() => setCategory('TCC')}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 sr-only"
                    />
                  </label>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-10">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                  </Link>
                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    Continue
                    <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <PersonalDetails
                personalDetails={personalDetails}
                setPersonalDetails={setPersonalDetails}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
            
            {step === 3 && (
              <EducationDetails
                educationDetails={educationDetails}
                setEducationDetails={setEducationDetails}
                onPrevious={handlePrevious}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
            
            {step === 4 && submissionId && (
              <FormSubmit
                submissionId={submissionId}
                category={category}
              />
            )}
          </div>
          
          {/* Help Box */}
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Need Help?</h3>
                <p className="mt-1 text-sm text-gray-500">
                  If you have any questions or need assistance with your application,
                  please contact our support team at{' '}
                  <a href="mailto:support@entranceexam.org" className="text-blue-600 hover:text-blue-800 font-medium">
                    support@entranceexam.org
                  </a>
                  {' '}or call{' '}
                  <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-800 font-medium">
                    +91 9876 543 210
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}