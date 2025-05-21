'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';

export default function LoginPage() {
  const { status } = useSession();

  if (status === 'authenticated') {
    redirect('/admin/dashboard');
  }

  return <LoginForm />;
}