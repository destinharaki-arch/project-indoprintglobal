import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, getAllUsers } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!email || !password) {
      setError('Harap isi semua bidang');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Harap masukkan email yang valid');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi harus minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    // Check if user exists in database
    const allUsers = getAllUsers();
    const existingUser = allUsers.find(u => u.email === email);

    if (!existingUser) {
      setError('Tidak ada akun dengan email ini. Silakan daftar terlebih dahulu.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      login(existingUser);
      setIsLoading(false);
      navigate('/profile');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex justify-center mb-8 items-center gap-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fc99ee96232a84df9a39eb98db8905fdc?format=webp&width=800&height=1200"
            alt="IndoGlobalPrint Logo"
            className="h-16 w-auto object-contain"
          />
          <div className="text-4xl font-bold text-foreground">
            IndoGlobalPrint
          </div>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-border">
          <h1 className="text-3xl font-bold text-foreground mb-2">Selamat Kembali</h1>
          <p className="text-muted-foreground mb-8">Masuk ke akun Anda untuk melanjutkan berbelanja</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground placeholder-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sedang masuk...' : 'Masuk'}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="mt-6 text-center">
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Lupa kata sandi Anda?
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">atau</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Belum memiliki akun?{' '}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Daftar secara gratis
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-secondary/10 border border-secondary/20 rounded-lg p-4 text-sm">
          <p className="text-muted-foreground mb-2">IndoPrintGlobal:</p>
          <p className="text-foreground font-mono text-xs">
            Email: <span className="text-secondary">demo@example.com</span>
          </p>
          <p className="text-foreground font-mono text-xs">
            Kata Sandi: <span className="text-secondary">demo123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
