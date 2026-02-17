import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Check } from 'lucide-react';

export default function SignUp() {
  const navigate = useNavigate();
  const { getAllUsers, login } = useUser();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Harap isi semua bidang');
      setIsLoading(false);
      return;
    }

    if (name.length < 2) {
      setError('Nama harus minimal 2 karakter');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Harap masukkan alamat email yang valid');
      setIsLoading(false);
      return;
    }

    // Check if email already exists
    const allUsers = getAllUsers();
    if (allUsers.some(u => u.email === email)) {
      setError('Email ini sudah terdaftar. Silakan masuk sebagai gantinya.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi harus minimal 6 karakter');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok');
      setIsLoading(false);
      return;
    }

    // Simulate account creation
    setTimeout(() => {
      const newUser = {
        id: 'USER-' + Date.now(),
        name: name,
        email: email,
        phone: '',
        address: '',
        joinDate: new Date().toLocaleDateString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        bio: '',
        website: '',
      };

      login(newUser);
      setIsLoading(false);
      navigate('/profile');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex justify-center mb-8">
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            ✨ IndoGlobalPrint
          </div>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-border">
          <h1 className="text-3xl font-bold text-foreground mb-2">Buat Akun</h1>
          <p className="text-muted-foreground mb-8">Bergabunglah dengan komunitas pecinta stiker kami</p>

          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>

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
              <p className="text-xs text-muted-foreground mt-1">Kami tidak akan pernah membagikan email Anda</p>
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
              <p className="text-xs text-muted-foreground mt-1">Minimal 6 karakter</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground placeholder-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
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

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Saya setuju dengan{' '}
                <button className="text-primary hover:underline">Ketentuan Layanan</button> dan{' '}
                <button className="text-primary hover:underline">Kebijakan Privasi</button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Membuat Akun...' : 'Buat Akun'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">atau</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Social Signup (Future) */}
        <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm">
          <p className="text-muted-foreground text-center">
            Login sosial segera hadir! Daftar dengan Google, Facebook, atau Apple ID.
          </p>
        </div>
      </div>
    </div>
  );
}
