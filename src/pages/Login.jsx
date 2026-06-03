// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle, FaGraduationCap } from 'react-icons/fa';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-100 px-4 py-10 animate-fade-in">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-8 shadow-2xl shadow-blue-200/70 backdrop-blur-xl animate-slide-up md:max-w-lg md:p-10">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -top-10 -left-8 h-32 w-32 rounded-full bg-blue-200/60 blur-3xl"></div>
          <div className="pointer-events-none absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-indigo-200/60 blur-3xl"></div>

          <div className="relative z-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
              <FaGraduationCap className="text-3xl text-white" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">StudyBuddy</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-800 md:text-4xl">Welcome back</h2>
            <p className="mt-2 text-base text-slate-600 md:text-lg">Sign in to continue your learning journey with a calm, focused workspace.</p>
          </div>

          <div className="relative z-10 mt-8 text-left">
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full rounded-xl border border-slate-200 bg-white/90 pl-10 py-3 text-slate-700 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full rounded-xl border border-slate-200 bg-white/90 pl-10 py-3 text-slate-700 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/90 px-3 text-slate-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl border border-slate-200 bg-white py-3 text-slate-700 shadow-sm transition duration-300 hover:scale-[1.02] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaGoogle className="text-red-500" />
            <span className="font-semibold">Google</span>
          </button>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 transition hover:text-blue-700">
              Sign up
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};