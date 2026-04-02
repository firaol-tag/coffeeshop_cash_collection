import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api.js';

export default function CreditsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api('/api/bookings?unpaid_credit=1')
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markPaid(id) {
    setBusyId(id);
    try {
      await api(`/api/bookings/${id}/payment`, {
        method: 'PATCH',
        body: { payment_status: 'Paid' },
      });
      load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-coffee-espresso mb-2">Staff credit (unpaid)</h2>
      <p className="text-coffee-roast text-sm mb-6">
        Credit orders appear here until marked paid.
      </p>
      {loading ? (
        <p className="text-coffee-steam">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-coffee-roast">No unpaid credit bookings.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((b) => (
            <motion.li
              key={b.id}
              layout
              className="rounded-xl border border-coffee-latte bg-coffee-paper/95 p-4 flex flex-wrap gap-3 justify-between items-center shadow-cup"
            >
              <div>
                <div className="font-medium text-coffee-espresso">
                  {b.customer_name || 'User'} ·{' '}
                  <span className="text-clay font-semibold">{Number(b.total_price).toFixed(2)}</span>
                </div>
                <div className="text-xs text-coffee-steam mt-1">
                  {new Date(b.created_at).toLocaleString()} · processed by{' '}
                  {b.processed_by_name || '—'}
                </div>
                {b.items?.length > 0 && (
                  <ul className="text-sm text-coffee-mocha mt-2 list-disc list-inside marker:text-coffee-copper">
                    {b.items.map((i) => (
                      <li key={i.id}>
                        {i.menu_name} × {i.quantity}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                disabled={busyId === b.id}
                onClick={() => markPaid(b.id)}
                className="shrink-0 px-4 py-2 rounded-lg bg-coffee-sage text-coffee-paper text-sm font-medium hover:brightness-110 disabled:opacity-50 shadow-cup transition-all"
              >
                {busyId === b.id ? 'Saving…' : 'Mark paid'}
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
