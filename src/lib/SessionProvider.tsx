'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';

export function SessionProvider({ children }: { children: ReactNode }) {
  // Add a state to track if the component is mounted
  // This helps prevent hydration issues and hook count mismatches
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the children when the component is mounted client-side
  // This ensures that the hooks are consistent between server and client rendering
  return (
    <NextAuthSessionProvider>
      {mounted ? children : null}
    </NextAuthSessionProvider>
  );
}