'use client';

import { useState, useEffect } from 'react';
import { Inventory } from '@/components/inventory';
import { Spinner } from '@/components/ui';
import type { Client, Product } from '@/types';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/clients').then(r => r.json()),
    ]).then(([p, c]) => {
      setProducts(Array.isArray(p) ? p : []);
      setClients(Array.isArray(c) ? c : []);
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
    <Inventory
      products={products}
      clients={clients}
      onProductsChange={fn => setProducts(fn)}
    />
  );
}
