'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'HomeIcon' },
        { name: 'Submissions', href: '/admin/submissions', icon: 'DocumentTextIcon' },
        { name: 'Hall Tickets', href: '/admin/hall-tickets', icon: 'TicketIcon' },
    ];

    return (
        <div className="h-screen flex-none w-64 bg-gray-800">
            <div className="flex flex-col flex-1">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <span className="text-white text-xl font-bold">Admin Panel</span>
                    </div>
                    <nav className="mt-5 flex-1 px-2 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`${isActive(item.href)
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                            >
                                {item.icon === 'TicketIcon' ? (
                                    <svg
                                        className={`${isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                                            } mr-3 h-6 w-6`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className={`${isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                                            } mr-3 h-6 w-6`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                )}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}