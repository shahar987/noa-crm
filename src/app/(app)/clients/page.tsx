'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clients } from '@/components/clients';
import { Spinner } from '@/components/ui';
import type { Client, Product } from '@/types';

// useSearchParams must live in a component wrapped by <Suspense>
function ClientsInner() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get('focus') ?? undefined;

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/clients').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]).then(([c, p]) => {
      setClients(Array.isArray(c) ? c : []);
      setProducts(Array.isArray(p) ? p : []);
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={36} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-6">
        <p className="text-berry-700/60 text-lg font-semibold">שגיאה בטעינת הנתונים</p>
        <p className="text-berry-700/40 text-sm">בדקי את חיבור האינטרנט ורעננו את הדף</p>
        <button onClick={() => window.location.reload()}
          className="mt-2 px-5 py-2.5 rounded-2xl bg-blush-100 text-berry-700 font-semibold hover:bg-blush-200 transition">
          ריענון
        </button>
      </div>
    );
  }

  return (
    <Clients
      clients={clients}
      products={products}
      onClientsChange={fn => setClients(fn)}
      focusId={focusId}
    />
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size={36} />
      </div>
    }>
      <ClientsInner />
    </Suspense>
  );
}
