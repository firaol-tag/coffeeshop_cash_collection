import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';

const input =
  'border border-coffee-latte rounded-lg px-3 py-2 text-sm bg-white/90 text-coffee-espresso focus:ring-2 focus:ring-coffee-copper/25 focus:border-coffee-crema outline-none';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [depts, setDepts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Staff',
    department_id: '',
  });
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    api('/api/users').then(setUsers).catch(() => setUsers([]));
    api('/api/departments').then(setDepts).catch(() => setDepts([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createUser(e) {
    e.preventDefault();
    setMsg('');
    try {
      await api('/api/users', {
        method: 'POST',
        body: {
          ...form,
          department_id: form.department_id ? Number(form.department_id) : null,
        },
      });
      setForm({ name: '', email: '', password: '', role: 'Staff', department_id: '' });
      setMsg('User created');
      load();
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-coffee-espresso mb-6">User management</h2>
      <form
        onSubmit={createUser}
        className="rounded-2xl border border-coffee-latte bg-coffee-paper/95 p-5 mb-8 grid sm:grid-cols-2 gap-3 max-w-3xl shadow-cup"
      >
        <h3 className="sm:col-span-2 font-semibold text-coffee-mocha">New user</h3>
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={input}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className={input}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className={input}
        />
        <select
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          className={input}
        >
          <option value="Staff">Staff</option>
          <option value="Admin">Admin</option>
        </select>
        <select
          value={form.department_id}
          onChange={(e) => setForm((f) => ({ ...f, department_id: e.target.value }))}
          className={`${input} sm:col-span-2`}
        >
          <option value="">No department</option>
          {depts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        {msg && (
          <p className="sm:col-span-2 text-sm text-coffee-roast bg-coffee-foam/80 rounded-lg px-3 py-2 border border-coffee-latte/60">
            {msg}
          </p>
        )}
        <button
          type="submit"
          className="sm:col-span-2 py-2 rounded-lg bg-coffee-espresso text-coffee-paper text-sm font-medium hover:bg-coffee-mocha transition-colors shadow-cup"
        >
          Create
        </button>
      </form>

      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className="rounded-xl border border-coffee-latte bg-coffee-paper/95 px-4 py-3 flex flex-wrap justify-between gap-2 text-sm text-coffee-mocha shadow-cup"
          >
            <span>
              <strong className="text-coffee-espresso">{u.name}</strong> · {u.email} · {u.role}
              {u.department_name ? ` · ${u.department_name}` : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
