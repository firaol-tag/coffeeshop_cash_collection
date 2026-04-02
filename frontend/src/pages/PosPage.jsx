import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../api.js';
import { menuImageUrl } from '../utils/assets.js';

function groupMenu(items) {
  const map = new Map();
  for (const it of items) {
    const key = `${it.category} · ${it.sub_category}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(it);
  }
  return map;
}

const inputBase =
  'rounded-lg border border-coffee-latte bg-white/90 text-coffee-espresso focus:ring-2 focus:ring-coffee-copper/25 focus:border-coffee-crema outline-none';

export default function PosPage() {
  const [menu, setMenu] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [empQuery, setEmpQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [cart, setCart] = useState({});
  const [paymentType, setPaymentType] = useState('Cash');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const loadMenu = useCallback(() => {
    api('/api/foods').then(setMenu).catch(() => setMenu([]));
  }, []);

  const loadEmployees = useCallback((q) => {
    const qs = q ? `?q=${encodeURIComponent(q)}` : '';
    api(`/api/employees${qs}`).then(setEmployees).catch(() => setEmployees([]));
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  useEffect(() => {
    const t = setTimeout(() => loadEmployees(empQuery), 200);
    return () => clearTimeout(t);
  }, [empQuery, loadEmployees]);

  const grouped = useMemo(() => groupMenu(menu), [menu]);

  function addToCart(item) {
    setCart((c) => ({
      ...c,
      [item.id]: { item, qty: (c[item.id]?.qty || 0) + 1 },
    }));
  }

  function setQty(id, qty) {
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = { ...next[id], qty };
      return next;
    });
  }

  const lines = Object.values(cart);
  const subtotal = lines.reduce((s, l) => s + Number(l.item.price) * l.qty, 0);

  async function checkout() {
    if (!selectedEmployee) {
      setToast({ type: 'err', text: 'Select an employee' });
      return;
    }
    if (!lines.length) {
      setToast({ type: 'err', text: 'Cart is empty' });
      return;
    }
    setSubmitting(true);
    try {
      await api('/api/bookings', {
        method: 'POST',
        body: {
          user_id: selectedEmployee.id,
          payment_type: paymentType,
          items: lines.map((l) => ({
            food_id: l.item.id,
            quantity: l.qty,
          })),
        },
      });
      setCart({});
      setToast({ type: 'ok', text: paymentType === 'Credit' ? 'Order on credit — recorded' : 'Paid — thank you' });
    } catch (e) {
      setToast({ type: 'err', text: e.message });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 3200);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
      <div>
        <h2 className="font-display text-2xl text-coffee-espresso mb-4">Point of sale</h2>
        <div className="mb-6 space-y-2">
          <label className="text-sm font-medium text-coffee-mocha">Employee</label>
          <input
            type="search"
            placeholder="Search name or email…"
            value={empQuery}
            onChange={(e) => setEmpQuery(e.target.value)}
            className={`w-full max-w-md px-3 py-2 text-sm ${inputBase}`}
          />
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
            {employees.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setSelectedEmployee(e)}
                className={`text-xs px-2 py-1 rounded-full border transition-all ${
                  selectedEmployee?.id === e.id
                    ? 'bg-coffee-sage text-coffee-paper border-coffee-sage shadow-sm'
                    : 'bg-coffee-paper border-coffee-latte text-coffee-mocha hover:border-coffee-copper/50'
                }`}
              >
                {e.name}
                {e.department_name ? ` · ${e.department_name}` : ''}
              </button>
            ))}
          </div>
          {selectedEmployee && (
            <p className="text-sm text-coffee-roast">
              Charging: <strong className="text-coffee-espresso">{selectedEmployee.name}</strong>
            </p>
          )}
        </div>

        {[...grouped.entries()].map(([label, items]) => (
          <div key={label} className="mb-8">
            <h3 className="text-sm font-semibold text-coffee-steam uppercase tracking-wide mb-3">
              {label}
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {items.map((it) => (
                <motion.button
                  key={it.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(it)}
                  className="text-left rounded-xl border border-coffee-latte/90 bg-coffee-paper/90 p-4 shadow-cup hover:border-coffee-copper/40 hover:shadow-cup-lg transition-all overflow-hidden"
                >
                  {it.image_filename ? (
                    <img
                      src={menuImageUrl(it.image_filename)}
                      alt=""
                      className="w-full h-24 object-cover rounded-lg mb-2 border border-coffee-latte/60 bg-coffee-foam"
                    />
                  ) : null}
                  <div className="font-medium text-coffee-espresso">{it.name}</div>
                  <div className="text-clay font-semibold mt-1">{Number(it.price).toFixed(2)}</div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <motion.aside
        layout
        className="lg:sticky lg:top-24 rounded-2xl border border-coffee-latte bg-coffee-paper/95 p-4 shadow-cup-lg backdrop-blur-sm"
      >
        <h3 className="font-display text-lg text-coffee-espresso mb-3">Cart</h3>
        <AnimatePresence initial={false}>
          {lines.length === 0 ? (
            <p className="text-coffee-steam text-sm py-6 text-center">Tap items to add</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {lines.map(({ item, qty }) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between gap-2 text-sm text-coffee-mocha"
                >
                  <span className="truncate flex-1">{item.name}</span>
                  <input
                    type="number"
                    min={1}
                    className={`w-14 px-1 py-0.5 text-right text-sm ${inputBase}`}
                    value={qty}
                    onChange={(e) => setQty(item.id, Number(e.target.value))}
                  />
                  <span className="w-20 text-right text-coffee-roast">
                    {(Number(item.price) * qty).toFixed(2)}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </AnimatePresence>
        <div className="border-t border-coffee-latte/80 pt-3 flex justify-between font-semibold text-coffee-espresso">
          <span>Total</span>
          <span className="text-clay">{subtotal.toFixed(2)}</span>
        </div>
        <div className="mt-4 flex gap-2">
          {['Cash', 'Credit'].map((pt) => (
            <button
              key={pt}
              type="button"
              onClick={() => setPaymentType(pt)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                paymentType === pt
                  ? 'bg-coffee-espresso text-coffee-paper border-coffee-espresso'
                  : 'bg-coffee-foam/80 text-coffee-mocha border-coffee-latte hover:bg-coffee-foam'
              }`}
            >
              {pt}
            </button>
          ))}
        </div>
        <motion.button
          type="button"
          disabled={submitting}
          whileTap={{ scale: 0.98 }}
          onClick={checkout}
          className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-coffee-caramel to-coffee-crema text-coffee-paper font-medium disabled:opacity-50 shadow-cup hover:opacity-95 transition-opacity"
        >
          {submitting ? 'Processing…' : 'Complete sale'}
        </motion.button>
        <AnimatePresence>
          {toast && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-3 text-sm text-center ${
                toast.type === 'ok' ? 'text-coffee-sage font-medium' : 'text-red-700'
              }`}
            >
              {toast.text}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.aside>
    </div>
  );
}
