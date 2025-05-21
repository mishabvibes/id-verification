'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section with Gradient Background */}
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0">
            <svg className="absolute left-0 inset-y-0 h-full w-48 text-white transform -translate-x-1/2 opacity-10" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-800/30 via-transparent to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto py-20 px-4 sm:py-32 sm:px-6 lg:px-8 relative">
            <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl drop-shadow-md">
                Secure Your Future
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100 drop-shadow">
                Apply for your entrance examination and take the first step towards your dream career
              </p>
              <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
                <div className="rounded-md shadow">
                  <Link
                    href="/form"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 hover:scale-105 transform transition duration-300 md:py-4 md:text-lg md:px-10"
                  >
                    Apply Now
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    href="/check-hall-ticket"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 hover:scale-105 transform transition duration-300 md:py-4 md:text-lg md:px-10"
                  >
                    Check Hall Ticket
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#ffffff">
              <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"></path>
            </svg>
          </div>
        </div>

        {/* How to Apply Section with Cards */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block p-1 px-3 bg-blue-100 rounded-full mb-2">
                <h2 className="text-sm font-semibold text-blue-700 tracking-wide uppercase">Application Process</h2>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Simple Steps to Apply
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Our streamlined process makes your application journey smooth and hassle-free
              </p>
            </div>

            <div className="mt-16">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                {/* Step 1 Card */}
                <div className="group relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute -top-4 left-4 bg-blue-600 rounded-xl p-3 shadow-lg group-hover:bg-blue-700 transition-colors duration-300">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">1. Fill Application Form</h3>
                    <p className="mt-3 text-base text-gray-500">
                      Complete the online application form with your personal and educational details.
                    </p>
                    <div className="mt-4 flex items-center text-blue-600">
                      <span className="text-sm font-medium">Takes about 10 minutes</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 Card */}
                <div className="group relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute -top-4 left-4 bg-blue-600 rounded-xl p-3 shadow-lg group-hover:bg-blue-700 transition-colors duration-300">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">2. Pay Examination Fee</h3>
                    <p className="mt-3 text-base text-gray-500">
                      Securely pay the examination fee through multiple available payment options.
                    </p>
                    <div className="mt-4 flex items-center text-blue-600">
                      <span className="text-sm font-medium">Secure payment methods</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 Card */}
                <div className="group relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute -top-4 left-4 bg-blue-600 rounded-xl p-3 shadow-lg group-hover:bg-blue-700 transition-colors duration-300">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">3. Receive Application ID</h3>
                    <p className="mt-3 text-base text-gray-500">
                      Get your unique application ID instantly for tracking your examination status.
                    </p>
                    <div className="mt-4 flex items-center text-blue-600">
                      <span className="text-sm font-medium">Instant confirmation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Dates Section */}
        <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block p-1 px-3 bg-blue-100 rounded-full mb-2">
                <h2 className="text-sm font-semibold text-blue-700 tracking-wide uppercase">Mark Your Calendar</h2>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Important Dates
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Plan ahead with these key examination dates
              </p>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
              <div className="bg-white shadow-xl overflow-hidden rounded-2xl border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-900">Key Dates to Remember</h3>
                </div>

                <div className="divide-y divide-gray-200">
                  <div className="px-6 py-5 flex items-center hover:bg-blue-50 transition-colors duration-150">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">Application Start Date</h4>
                      <p className="mt-1 text-sm text-gray-500">Registration opens for all eligible candidates</p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        May 10, 2025
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-5 flex items-center hover:bg-blue-50 transition-colors duration-150">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">Application End Date</h4>
                      <p className="mt-1 text-sm text-gray-500">Last day to submit your application</p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        June 15, 2025
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-5 flex items-center hover:bg-blue-50 transition-colors duration-150">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">Admit Card Release</h4>
                      <p className="mt-1 text-sm text-gray-500">Download your hall ticket from the portal</p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        June 25, 2025
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-5 flex items-center hover:bg-blue-50 transition-colors duration-150">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 text-yellow-600">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">Examination Date</h4>
                      <p className="mt-1 text-sm text-gray-500">The day of the entrance examination</p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        July 10, 2025
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-5 flex items-center hover:bg-blue-50 transition-colors duration-150">
                    <div className="mr-4 flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">Result Declaration</h4>
                      <p className="mt-1 text-sm text-gray-500">Results will be published on the portal</p>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        August 05, 2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-blue-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">95%</div>
                <div className="mt-2 text-xl font-medium text-blue-200">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">50K+</div>
                <div className="mt-2 text-xl font-medium text-blue-200">Applicants</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">100+</div>
                <div className="mt-2 text-xl font-medium text-blue-200">Test Centers</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">20+</div>
                <div className="mt-2 text-xl font-medium text-blue-200">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block p-1 px-3 bg-blue-100 rounded-full mb-2">
                <h2 className="text-sm font-semibold text-blue-700 tracking-wide uppercase">FAQ</h2>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Frequently Asked Questions
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Find answers to common questions about the examination process
              </p>
            </div>

            <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
              <div className="py-6">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold text-gray-900">What are the eligibility criteria?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </span>
                  </summary>
                  <p className="text-gray-500 mt-3 group-open:animate-fadeIn">
                    Candidates must have completed their secondary education with a minimum of 60% marks from a recognized board. Age limit is between 17-25 years as of the application deadline.
                  </p>
                </details>
              </div>
              <div className="py-6">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold text-gray-900">What is the application fee?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </span>
                  </summary>
                  <p className="text-gray-500 mt-3 group-open:animate-fadeIn">
                    The application fee is ₹1,200 for general category and ₹600 for reserved categories. Payment can be made through credit/debit cards, net banking, or UPI.
                  </p>
                </details>
              </div>
              <div className="py-6">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold text-gray-900">How long is the examination?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </span>
                  </summary>
                  <p className="text-gray-500 mt-3 group-open:animate-fadeIn">
                    The examination duration is 3 hours. It consists of multiple-choice questions covering subjects relevant to the program you're applying for.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block p-1 px-3 bg-blue-100 rounded-full mb-2">
                <h2 className="text-sm font-semibold text-blue-700 tracking-wide uppercase">Support</h2>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Need Assistance?
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Our support team is here to help you with any questions or concerns
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="relative rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Email Support</h3>
                      <p className="mt-2 text-base text-gray-500">
                        We typically respond within 24 hours during business days
                      </p>
                      <a href="mailto:support@entranceexam.org" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500 font-medium">
                        support@entranceexam.org
                        <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                        <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Helpline</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Available Monday to Friday, 9:00 AM to 5:00 PM
                      </p>
                      // Continuation of the Contact Us section
                      <a href="tel:+919876543210" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500 font-medium">
                        +91 9876 543 210
                        <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden w-full md:w-1/2 m-auto">
                <div className="p-10 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
                  <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                  <p className="text-blue-100 mb-8">Have a specific question? Fill out the form and we'll get back to you as soon as possible.</p>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Office Address</h4>
                        <p className="mt-1 text-blue-100">123 Education Lane, Knowledge City, IN 560001</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Email</h4>
                        <p className="mt-1 text-blue-100">support@entranceexam.org</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Phone</h4>
                        <p className="mt-1 text-blue-100">+91 9876 543 210</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="p-10">
                    <form className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            placeholder="Your name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                          Subject
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            placeholder="Your query subject"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="message"
                            name="message"
                            rows={4}
                            className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                            placeholder="Your message"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          Send Message
                        </button>
                      </div>
                    </form>
                  </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block p-1 px-3 bg-blue-100 rounded-full mb-2">
                <h2 className="text-sm font-semibold text-blue-700 tracking-wide uppercase">Success Stories</h2>
              </div>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                What Our Students Say
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Hear from students who successfully cleared our entrance examination
              </p>
            </div>

            <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-3 lg:max-w-none">
              {/* Testimonial 1 */}
              <div className="flex flex-col rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xl font-semibold text-gray-900">"The process was seamless and well-organized"</p>
                    <p className="mt-3 text-base text-gray-500">
                      The preparation materials and mock tests available on the portal were extremely helpful. The actual examination was well-organized, and I received my results right on schedule.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
                        RP
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Rahul Patel</p>
                      <p className="text-sm text-gray-500">Engineering Student, Batch of 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="flex flex-col rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xl font-semibold text-gray-900">"Support team was extremely helpful"</p>
                    <p className="mt-3 text-base text-gray-500">
                      I had some issues with my payment, but the support team responded quickly and resolved my problem within hours. The examination process was smooth and stress-free.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold">
                        SM
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Sneha Mehta</p>
                      <p className="text-sm text-gray-500">Medical Student, Batch of 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="flex flex-col rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-xl font-semibold text-gray-900">"The hall ticket system was so convenient"</p>
                    <p className="mt-3 text-base text-gray-500">
                      Downloading the hall ticket was easy, and the instructions were clear. The examination center was well-managed, and the results were published right on time.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-600 to-green-700 flex items-center justify-center text-white font-bold">
                        AK
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Arjun Kumar</p>
                      <p className="text-sm text-gray-500">Science Student, Batch of 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-lg font-bold mb-4">Entrance Examination Portal</h3>
              <p className="text-gray-400 text-sm mb-4">
                The leading platform for entrance examinations, helping students secure their future in top institutions across the country.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/form" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Apply Now
                  </Link>
                </li>
                <li>
                  <Link href="/check-hall-ticket" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Check Hall Ticket
                  </Link>
                </li>
                <li>
                  <Link href="/results" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Results
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white transition-colors duration-200">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/study-materials" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Study Materials
                  </Link>
                </li>
                <li>
                  <Link href="/mock-tests" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Mock Tests
                  </Link>
                </li>
                <li>
                  <Link href="/syllabus" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Syllabus
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/help-center" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Entrance Examination Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}