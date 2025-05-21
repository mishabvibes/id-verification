'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/admin/DashboardHeader';
import Sidebar from '@/components/admin/Sidebar';
import { FormStatus, FormCategory } from '@/types';
import AuthWrapper from '@/components/admin/AuthWrapper';

interface DashboardStats {
    totalSubmissions: number;
    categoryBreakdown: {
        ECC: number;
        TCC: number;
    };
    statusBreakdown: {
        [key in FormStatus]: number;
    };
    recentSubmissions: {
        _id: string;
        uniqueId: string;
        category: FormCategory;
        name: string;
        status: FormStatus;
        createdAt: string;
    }[];
    hallTickets?: {
        total: number;
        statusBreakdown: {
            issued: number;
            downloaded: number;
            used: number;
        };
    };
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/stats');

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard stats');
                }

                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getStatusColorClass = (status: FormStatus) => {
        switch (status) {
            case FormStatus.DRAFT:
                return 'bg-gray-100 text-gray-800';
            case FormStatus.SUBMITTED:
                return 'bg-blue-100 text-blue-800';
            case FormStatus.APPROVED:
                return 'bg-green-100 text-green-800';
            case FormStatus.REJECTED:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <AuthWrapper>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <DashboardHeader />

                <div className="flex flex-1">
                    <Sidebar />

                    <main className="flex-1 overflow-auto p-6">
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

                            {isLoading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : stats ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                                        <svg
                                                            className="h-6 w-6 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                Total Submissions
                                                            </dt>
                                                            <dd>
                                                                <div className="text-lg font-bold text-gray-900">
                                                                    {stats.totalSubmissions}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                                        <svg
                                                            className="h-6 w-6 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                Approved
                                                            </dt>
                                                            <dd>
                                                                <div className="text-lg font-bold text-gray-900">
                                                                    {stats.statusBreakdown.approved}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                                        <svg
                                                            className="h-6 w-6 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                Pending
                                                            </dt>
                                                            <dd>
                                                                <div className="text-lg font-bold text-gray-900">
                                                                    {stats.statusBreakdown.submitted}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                                                        <svg
                                                            className="h-6 w-6 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                Rejected
                                                            </dt>
                                                            <dd>
                                                                <div className="text-lg font-bold text-gray-900">
                                                                    {stats.statusBreakdown.rejected}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h2 className="text-lg font-medium text-gray-900 mb-4">Category Breakdown</h2>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm font-medium text-gray-500">
                                                                ECC - Educational Category
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {stats.categoryBreakdown.ECC}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 relative pt-1">
                                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                                <div
                                                                    style={{
                                                                        width: `${stats.totalSubmissions
                                                                            ? (stats.categoryBreakdown.ECC / stats.totalSubmissions) * 100
                                                                            : 0
                                                                            }%`,
                                                                    }}
                                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm font-medium text-gray-500">
                                                                TCC - Technical Category
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {stats.categoryBreakdown.TCC}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 relative pt-1">
                                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                                <div
                                                                    style={{
                                                                        width: `${stats.totalSubmissions
                                                                            ? (stats.categoryBreakdown.TCC / stats.totalSubmissions) * 100
                                                                            : 0
                                                                            }%`,
                                                                    }}
                                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h2 className="text-lg font-medium text-gray-900 mb-4">Status Breakdown</h2>
                                                <div className="space-y-4">
                                                    {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                                                        <div key={status}>
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-sm font-medium text-gray-500">
                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                </div>
                                                                <div className="text-sm font-medium text-gray-900">{count}</div>
                                                            </div>
                                                            <div className="mt-2 relative pt-1">
                                                                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                                    <div
                                                                        style={{
                                                                            width: `${stats.totalSubmissions
                                                                                ? (count / stats.totalSubmissions) * 100
                                                                                : 0
                                                                                }%`,
                                                                        }}
                                                                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${status === 'approved'
                                                                            ? 'bg-green-500'
                                                                            : status === 'rejected'
                                                                                ? 'bg-red-500'
                                                                                : status === 'submitted'
                                                                                    ? 'bg-yellow-500'
                                                                                    : 'bg-gray-500'
                                                                            }`}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hall Ticket Stats */}
                                    {stats?.hallTickets && (
                                        <div className="bg-white overflow-hidden shadow rounded-lg">
                                            <div className="px-4 py-5 sm:p-6">
                                                <h2 className="text-lg font-medium text-gray-900 mb-4">Hall Tickets</h2>

                                                <div className="flex items-center mb-4">
                                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                                        <svg
                                                            className="h-6 w-6 text-white"
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
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                Total Hall Tickets
                                                            </dt>
                                                            <dd>
                                                                <div className="text-lg font-bold text-gray-900">
                                                                    {stats.hallTickets.total}
                                                                </div>
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm font-medium text-gray-500">
                                                                Issued
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {stats.hallTickets.statusBreakdown.issued}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 relative pt-1">
                                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                                <div
                                                                    style={{
                                                                        width: `${stats.hallTickets.total
                                                                            ? (stats.hallTickets.statusBreakdown.issued / stats.hallTickets.total) * 100
                                                                            : 0
                                                                            }%`,
                                                                    }}
                                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm font-medium text-gray-500">
                                                                Downloaded
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {stats.hallTickets.statusBreakdown.downloaded}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 relative pt-1">
                                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                                <div
                                                                    style={{
                                                                        width: `${stats.hallTickets.total
                                                                            ? (stats.hallTickets.statusBreakdown.downloaded / stats.hallTickets.total) * 100
                                                                            : 0
                                                                            }%`,
                                                                    }}
                                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-sm font-medium text-gray-500">
                                                                Used
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {stats.hallTickets.statusBreakdown.used}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 relative pt-1">
                                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                                <div
                                                                    style={{
                                                                        width: `${stats.hallTickets.total
                                                                            ? (stats.hallTickets.statusBreakdown.used / stats.hallTickets.total) * 100
                                                                            : 0
                                                                            }%`,
                                                                    }}
                                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 text-right">
                                                    <a
                                                        href="/admin/hall-tickets"
                                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View all hall tickets →
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-white shadow rounded-lg overflow-hidden">
                                        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                                            <h2 className="text-lg font-medium text-gray-900">Recent Submissions</h2>
                                        </div>
                                        <div className="overflow-x-auto">
                                            {stats.recentSubmissions.length > 0 ? (
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                ID
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                Name
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                Category
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                Status
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                Date
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {stats.recentSubmissions.map((submission) => (
                                                            <tr key={submission._id} className="hover:bg-gray-50">
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {submission.uniqueId}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {submission.name}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {submission.category}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(submission.status)}`}>
                                                                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {new Date(submission.createdAt).toLocaleDateString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <a
                                                                        href={`/admin/submissions/${submission._id}`}
                                                                        className="text-blue-600 hover:text-blue-900"
                                                                    >
                                                                        View
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <div className="px-6 py-4 text-center text-gray-500">
                                                    No recent submissions found
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-4 py-3 border-t border-gray-200 text-right sm:px-6">
                                            <a
                                                href="/admin/submissions"
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                View All Submissions
                                                <svg
                                                    className="ml-2 -mr-1 h-5 w-5 text-gray-400"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                                    Failed to load dashboard data. Please try refreshing the page.
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </AuthWrapper>
    );
}
