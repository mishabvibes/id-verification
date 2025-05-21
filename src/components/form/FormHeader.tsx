// src/components/form/FormHeader.tsx
import Link from 'next/link';

export default function FormHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-md">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-white hover:opacity-90 transition">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-lg md:text-xl font-bold hidden sm:inline">Entrance Examination Portal</span>
          </Link>
          
          {/* <div className="flex flex-col items-center text-center flex-grow sm:flex-grow-0">
            <h1 className="text-xl md:text-2xl font-bold text-white">Entrance Examination Form</h1>
            <p className="mt-1 text-xs md:text-sm text-blue-100">
              Complete all sections to register for the examination
            </p>
          </div> */}
          
          <div className="hidden sm:flex items-center space-x-4">
            <Link 
              href="/check-hall-ticket" 
              className="text-blue-100 hover:text-white transition text-sm font-medium"
            >
              Check Hall Ticket
            </Link>
            <Link 
              href="/contact" 
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Need Help?
            </Link>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      {/* <div className="relative h-6 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-12 text-gray-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,266.7C960,267,1056,245,1152,229.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div> */}
    </header>
  );
}