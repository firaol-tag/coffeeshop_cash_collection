import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { menuImageUrl } from '../utils/assets.js';

const empty = { name: '', category: 'Food', sub_category: 'Breakfast', price: '' };

const input =
  'border border-coffee-latte rounded-lg px-3 py-2 text-sm bg-white/90 text-coffee-espresso focus:ring-2 focus:ring-coffee-copper/25 focus:border-coffee-crema outline-none';

export default function MenuAdminPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');
  const [formKey, setFormKey] = useState(0);
  const imageInputRef = useRef(null);

  const load = useCallback(() => {
    api('/api/menu-items').then(setItems).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createItem(e) {
    e.preventDefault();
    setMsg('');
    const file = imageInputRef.current?.files?.[0];
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('category', form.category);
    fd.append('sub_category', form.sub_category);
    fd.append('price', String(form.price));
    if (file) fd.append('image', file);

    try {
      await api('/api/menu-items', {
        method: 'POST',
        body: fd,
      });
      setForm(empty);
      setFormKey((k) => k + 1);
      if (imageInputRef.current) imageInputRef.current.value = '';
      setMsg('Item added');
      load();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editing) return;
    setMsg('');
    try {
      await api(`/api/menu-items/${editing.id}`, {
        method: 'PATCH',
        body: {
          name: editing.name,
          category: editing.category,
          sub_category: editing.sub_category,
          price: Number(editing.price),
        },
      });
      setEditing(null);
      load();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this item?')) return;
    try {
      await api(`/api/menu-items/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-coffee-espresso mb-6">Menu items</h2>
      <form
        key={formKey}
        onSubmit={createItem}
        className="rounded-2xl border border-coffee-latte bg-coffee-paper/95 p-5 mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 shadow-cup"
      >
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={input}
        />
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className={input}
        >
          <option value="Food">Food</option>
          <option value="Drink">Drink</option>
        </select>
        <select
          value={form.sub_category}
          onChange={(e) => setForm((f) => ({ ...f, sub_category: e.target.value }))}
          className={input}
        >
          {['Breakfast', 'Lunch', 'Snack', 'Hot', 'Cold'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          className={input}
        />
        <label className="sm:col-span-2 lg:col-span-4 flex flex-col gap-1 text-sm text-coffee-mocha">
          <span className="font-medium">Photo (optional — JPEG, PNG, GIF, WebP, max 3MB)</span>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className={`${input} file:mr-3 file:rounded-md file:border-0 file:bg-coffee-foam file:px-3 file:py-1 file:text-sm file:font-medium file:text-coffee-espresso`}
          />
        </label>
        <button
          type="submit"
          className="sm:col-span-2 lg:col-span-4 py-2 rounded-lg bg-coffee-espresso text-coffee-paper text-sm font-medium hover:bg-coffee-mocha shadow-cup transition-colors"
        >
          Add item
        </button>
        {msg && (
          <p className="sm:col-span-2 lg:col-span-4 text-sm text-coffee-mocha bg-coffee-foam/80 rounded-lg px-3 py-2 border border-coffee-latte/60">
            {msg}
          </p>
        )}
      </form>

      <ul className="space-y-2">
        {items.map((it) =>
          editing?.id === it.id ? (
            <li
              key={it.id}
              className="rounded-xl border border-coffee-copper/50 bg-gradient-to-br from-coffee-foam to-coffee-cup/80 p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-2 shadow-cup"
            >
              <form onSubmit={saveEdit} className="contents">
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className={`${input} px-2 py-1`}
                />
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className={`${input} px-2 py-1`}
                >
                  <option value="Food">Food</option>
                  <option value="Drink">Drink</option>
                </select>
                <select
                  value={editing.sub_category}
                  onChange={(e) => setEditing({ ...editing, sub_category: e.target.value })}
                  className={`${input} px-2 py-1`}
                >
                  {['Breakfast', 'Lunch', 'Snack', 'Hot', 'Cold'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.01"
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                  className={`${input} px-2 py-1`}
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-coffee-sage text-coffee-paper text-sm font-medium shadow-cup"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="px-3 py-1 rounded-lg border border-coffee-latte bg-coffee-paper text-coffee-mocha text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </li>
          ) : (
            <li
              key={it.id}
              className="rounded-xl border border-coffee-latte bg-coffee-paper/95 px-4 py-3 flex flex-wrap justify-between gap-3 items-center text-sm text-coffee-mocha shadow-cup"
            >
              <span className="flex items-center gap-3 min-w-0">
                {it.image_filename ? (
                  <img
                    src={menuImageUrl(it.image_filename)}
                    alt=""
                    className="h-14 w-14 rounded-lg object-cover border border-coffee-latte shrink-0 bg-coffee-foam"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-lg border border-dashed border-coffee-latte bg-coffee-foam/50 shrink-0" />
                )}
                <span className="min-w-0">
                  <strong className="text-coffee-espresso">{it.name}</strong> · {it.category} /{' '}
                  {it.sub_category} ·{' '}
                  <span className="text-clay font-medium">{Number(it.price).toFixed(2)}</span>
                </span>
              </span>
              <span className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      ...it,
                      price: String(it.price),
                    })
                  }
                  className="text-coffee-caramel font-medium hover:text-coffee-crema transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  className="text-red-700 hover:text-red-800"
                >
                  Delete
                </button>
              </span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
