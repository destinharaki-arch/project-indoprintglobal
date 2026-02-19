import { ShoppingCart, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';

export function Header() {
  const { getCartCount } = useCart();
  const { user } = useUser();
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            ✨ IndoGlobalPrint
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Beranda
          </Link>
          <Link to="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Toko
          </Link>
          <Link to="/categories" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Kategori
          </Link>
          <Link to="/custom-design" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Desain Kustom
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Tentang
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link to="/shop" className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:flex">
            <Search className="w-5 h-5 text-foreground" />
          </Link>
          <Link
            to="/cart"
            className="relative p-2 hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <Link
              to="/profile"
              className="p-2 hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
              title={user.name}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-foreground" />
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
