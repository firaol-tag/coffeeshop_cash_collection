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
  const [topFoods, setTopFoods] = useState([]);
  const [daily, setDaily] = useState(null);
  const [err, setErr] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

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

  useEffect(() => {
    api(`/api/reports/top-foods?year=${year}&month=${month}`)
      .then(setTopFoods)
      .catch(() => setTopFoods([]));
  }, [year, month]);

  useEffect(() => {
    api('/api/reports/daily')
      .then(setDaily)
      .catch(() => setDaily(null));
  }, []);

  const fmt = (n) => Number(n || 0).toFixed(2);

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'monthly', label: 'Monthly Report', icon: '📅' },
    { id: 'yearly', label: 'Yearly Report', icon: '📈' },
    { id: 'top-foods', label: 'Top Foods', icon: '🍽️' },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-coffee-paper border-r border-coffee-latte p-4">
        <h2 className="font-display text-xl text-coffee-espresso mb-6">Dashboard</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-coffee-copper text-coffee-paper'
                  : 'text-coffee-mocha hover:bg-coffee-latte/50'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {err && (
          <p className="text-red-700 text-sm mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {err}
          </p>
        )}

        {activeSection === 'overview' && (
          <div>
            <h3 className="font-display text-2xl text-coffee-espresso mb-6">Overview</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-coffee-paper/95 p-4 rounded-xl border border-coffee-latte shadow-cup">
                <h4 className="text-coffee-mocha text-sm font-medium">Today's Sales</h4>
                <p className="text-2xl font-bold text-coffee-espresso mt-1">{fmt(daily?.gross_total)}</p>
              </div>
              <div className="bg-coffee-paper/95 p-4 rounded-xl border border-coffee-latte shadow-cup">
                <h4 className="text-coffee-mocha text-sm font-medium">This Month</h4>
                <p className="text-2xl font-bold text-coffee-espresso mt-1">{fmt(monthly?.gross_total)}</p>
              </div>
              <div className="bg-coffee-paper/95 p-4 rounded-xl border border-coffee-latte shadow-cup">
                <h4 className="text-coffee-mocha text-sm font-medium">Unpaid Credits</h4>
                <p className="text-2xl font-bold text-clay mt-1">{fmt(monthly?.credit_unpaid_total)}</p>
              </div>
              <div className="bg-coffee-paper/95 p-4 rounded-xl border border-coffee-latte shadow-cup">
                <h4 className="text-coffee-mocha text-sm font-medium">Total Bookings</h4>
                <p className="text-2xl font-bold text-coffee-espresso mt-1">{monthly?.booking_count || 0}</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'monthly' && (
          <div>
            <h3 className="font-display text-2xl text-coffee-espresso mb-6">Monthly Report</h3>
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
        )}

        {activeSection === 'yearly' && (
          <div>
            <h3 className="font-display text-2xl text-coffee-espresso mb-6">Yearly Report {year}</h3>
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
        )}

        {activeSection === 'top-foods' && (
          <div>
            <h3 className="font-display text-2xl text-coffee-espresso mb-6">Top Selling Foods ({month}/{year})</h3>
            {topFoods.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-coffee-mocha">
                  <thead>
                    <tr className="text-coffee-steam border-b border-coffee-latte">
                      <th className="py-2 pr-4">Food</th>
                      <th className="py-2 pr-4">Quantity</th>
                      <th className="py-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topFoods.map((food, i) => (
                      <tr key={i} className="border-b border-coffee-latte/60">
                        <td className="py-2 pr-4 text-coffee-espresso font-medium">{food.name}</td>
                        <td className="py-2 pr-4">{food.total_quantity}</td>
                        <td className="py-2 text-coffee-caramel">{fmt(food.total_revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-coffee-steam">No data available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
