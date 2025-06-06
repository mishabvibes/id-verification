export default function Footer() {
    return (
        <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-500">
                            &copy; {new Date().getFullYear()} Entrance Exam Portal. All rights reserved.
                        </p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            Terms
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            Privacy
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-700">
                            Contact
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}