import { useEffect, useState } from 'react';
import { api } from '../api.js';

const field =
  'border border-coffee-latte rounded-lg px-2 py-1 text-sm bg-white/90 text-coffee-espresso focus:ring-2 focus:ring-coffee-copper/25 focus:border-coffee-crema outline-none';

export default function DashboardPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthly, setMonthly] = useState(null);
  const [yearly, setYearly] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    setErr('');
    api(`/api/reports/monthly?year=${year}&month=${month}`)
      .then(setMonthly)
      .catch((e) => setErr(e.message));
  }, [year, month]);

  useEffect(() => {
    api(`/api/reports/yearly?year=${year}`)
      .then(setYearly)
      .catch(() => setYearly(null));
  }, [year]);

  const fmt = (n) => Number(n || 0).toFixed(2);

  return (
    <div>
      <h2 className="font-display text-2xl text-coffee-espresso mb-6">Reports</h2>
      {err && (
        <p className="text-red-700 text-sm mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {err}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl border border-coffee-latte bg-coffee-paper/95 p-5 shadow-cup">
          <h3 className="font-semibold text-coffee-mocha mb-4">Monthly</h3>
          <div className="flex gap-2 mb-4">
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={field}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className={`${field} w-24`}
            />
          </div>
          {monthly && (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-coffee-mocha">
                <dt className="text-coffee-steam">Bookings</dt>
                <dd className="font-medium text-coffee-espresso">{monthly.booking_count}</dd>
              </div>
              <div className="flex justify-between text-coffee-mocha">
                <dt className="text-coffee-steam">Cash</dt>
                <dd>{fmt(monthly.cash_total)}</dd>
              </div>
              <div className="flex justify-between text-coffee-mocha">
                <dt className="text-coffee-steam">Credit (paid)</dt>
                <dd>{fmt(monthly.credit_paid_total)}</dd>
              </div>
              <div className="flex justify-between text-clay font-medium">
                <dt>Credit (unpaid)</dt>
                <dd>{fmt(monthly.credit_unpaid_total)}</dd>
              </div>
              <div className="flex justify-between font-semibold text-coffee-espresso border-t border-coffee-latte pt-2">
                <dt>Gross total</dt>
                <dd>{fmt(monthly.gross_total)}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="rounded-2xl border border-coffee-latte bg-coffee-paper/95 p-5 shadow-cup">
          <h3 className="font-semibold text-coffee-mocha mb-4">Year {year}</h3>
          {yearly?.summary && (
            <dl className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-coffee-mocha">
                <dt className="text-coffee-steam">Bookings</dt>
                <dd className="font-medium text-coffee-espresso">{yearly.summary.booking_count}</dd>
              </div>
              <div className="flex justify-between text-coffee-mocha">
                <dt className="text-coffee-steam">Cash</dt>
                <dd>{fmt(yearly.summary.cash_total)}</dd>
              </div>
              <div className="flex justify-between text-coffee-mocha">
                <dt className="text-coffee-steam">Credit (paid)</dt>
                <dd>{fmt(yearly.summary.credit_paid_total)}</dd>
              </div>
              <div className="flex justify-between text-clay font-medium">
                <dt>Credit (unpaid)</dt>
                <dd>{fmt(yearly.summary.credit_unpaid_total)}</dd>
              </div>
            </dl>
          )}
          {yearly?.by_month?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-coffee-mocha">
                <thead>
                  <tr className="text-coffee-steam border-b border-coffee-latte">
                    <th className="py-1 pr-2">Mo</th>
                    <th className="py-1 pr-2">Cash</th>
                    <th className="py-1 pr-2">Cr paid</th>
                    <th className="py-1">Cr due</th>
                  </tr>
                </thead>
                <tbody>
                  {yearly.by_month.map((r) => (
                    <tr key={r.month} className="border-b border-coffee-latte/60">
                      <td className="py-1 pr-2 text-coffee-espresso font-medium">{r.month}</td>
                      <td className="py-1 pr-2">{fmt(r.cash_total)}</td>
                      <td className="py-1 pr-2">{fmt(r.credit_paid_total)}</td>
                      <td className="py-1 text-coffee-caramel">{fmt(r.credit_unpaid_total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
