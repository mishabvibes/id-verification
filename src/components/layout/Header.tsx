export default function Header() {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <span className="text-blue-600 text-xl font-bold">Entrance Exam Portal</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/check-hall-ticket"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Check Hall Ticket
              </a>
              <a
                href="/form"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  }