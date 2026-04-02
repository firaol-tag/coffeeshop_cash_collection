import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!loading && user) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      nav('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-coffee-paper via-coffee-cup to-coffee-foam"
        aria-hidden
      />
      <div
        className="absolute top-[-20%] right-[-10%] w-[55vw] h-[55vw] max-w-xl max-h-xl rounded-full bg-coffee-crema/15 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-[-15%] left-[-15%] w-[50vw] h-[50vw] max-w-md max-h-md rounded-full bg-coffee-sage/10 blur-3xl"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-coffee-paper/95 rounded-2xl shadow-cup-lg border border-coffee-latte/90 p-8 backdrop-blur-sm"
      >
        <p className="text-coffee-crema text-xs font-semibold uppercase tracking-[0.2em] mb-2">
          Welcome back
        </p>
        <h1 className="font-display text-3xl text-coffee-espresso mb-1">Coffee Shop</h1>
        <p className="text-coffee-roast text-sm mb-6">Staff &amp; admin sign in</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-coffee-mocha mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-coffee-latte bg-white/80 px-3 py-2 text-coffee-espresso placeholder:text-coffee-steam focus:ring-2 focus:ring-coffee-copper/30 focus:border-coffee-crema outline-none transition-shadow"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-coffee-mocha mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-coffee-latte bg-white/80 px-3 py-2 text-coffee-espresso placeholder:text-coffee-steam focus:ring-2 focus:ring-coffee-copper/30 focus:border-coffee-crema outline-none transition-shadow"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="text-red-700 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">
              {error}
            </p>
          )}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-2.5 rounded-lg bg-coffee-espresso text-coffee-paper font-medium hover:bg-coffee-mocha transition-colors shadow-cup"
          >
            Sign in
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
