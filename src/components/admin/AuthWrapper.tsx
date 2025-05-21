// Create a new component called src/components/admin/AuthWrapper.tsx
// This will handle session state consistently

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  loadingComponent?: ReactNode;
}

export default function AuthWrapper({
  children,
  requireAuth = true,
  loadingComponent = (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
}: AuthWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Handle client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication check
  useEffect(() => {
    if (isClient && requireAuth && status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [isClient, requireAuth, router, status]);

  // Don't render anything during server-side rendering
  if (!isClient) {
    return null;
  }

  // Show loading state while checking authentication
  if (requireAuth && status === 'loading') {
    return <>{loadingComponent}</>;
  }

  // If authentication is required and user is not authenticated, don't render children
  if (requireAuth && status === 'unauthenticated') {
    return null;
  }

  // If we're here, either authentication is not required or user is authenticated
  return <>{children}</>;
}