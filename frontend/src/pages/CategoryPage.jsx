import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function CategoryPage() {
  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api('/api/menus').then(setMenus),
      api('/api/menu-items').then(setMenuItems),
    ]).finally(() => setLoading(false));
  }, []);

  const [newMenu, setNewMenu] = useState('');
  const [newItem, setNewItem] = useState({ name: '', menu_id: '' });

  async function addMenu() {
    if (!newMenu.trim()) return;
    try {
      await api('/api/menus', { method: 'POST', body: { name: newMenu } });
      setNewMenu('');
      setMenus(await api('/api/menus'));
    } catch (e) {
      alert(e.message);
    }
  }

  async function addMenuItem() {
    if (!newItem.name.trim() || !newItem.menu_id) return;
    try {
      await api('/api/menu-items', { method: 'POST', body: newItem });
      setNewItem({ name: '', menu_id: '' });
      setMenuItems(await api('/api/menu-items'));
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-coffee-espresso mb-6">Categories & Sub-Categories</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Menus (Categories)</h3>
            <ul className="space-y-2 mb-4">
              {menus.map((m) => (
                <li key={m.id} className="p-2 bg-coffee-paper rounded">{m.name}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMenu}
                onChange={(e) => setNewMenu(e.target.value)}
                placeholder="New category"
                className="flex-1 border rounded px-2 py-1"
              />
              <button onClick={addMenu} className="px-4 py-1 bg-blue-500 text-white rounded">
                Add
              </button>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Menu Items (Sub-Categories)</h3>
            <ul className="space-y-2 mb-4">
              {menuItems.map((mi) => (
                <li key={mi.id} className="p-2 bg-coffee-paper rounded">
                  {mi.name} ({mi.menu_name})
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="New sub-category"
                className="flex-1 border rounded px-2 py-1"
              />
              <select
                value={newItem.menu_id}
                onChange={(e) => setNewItem({ ...newItem, menu_id: e.target.value })}
                className="border rounded px-2 py-1"
              >
                <option value="">Select category</option>
                {menus.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <button onClick={addMenuItem} className="px-4 py-1 bg-blue-500 text-white rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}