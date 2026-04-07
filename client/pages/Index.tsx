import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';

const FEATURED_STICKERS = [
  {
    id: '19',
    name: 'Band Music Sticker Pack ',
    price: 1.2,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F04b47a6243b34c738b3dc2c7ff88c596?format=webp&width=800&height=1200',
    reviews: 0,
    size: '3-15 cm',
    shape: 'Band Logo Mix',
    material: 'Vinil Glossy Premium',
    usage: 'Helm, Laptop, Skateboard, Merchandise',
  },
  {
    id: '29',
    name: 'Bobotoh 1919 Football Tee',
    price: 3.2,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F926cb19d11cd43de8c89d7e1c5b46f67?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Combed',
    usage: 'Sports Fan Wear, Football Culture, Supporter Gear',
  },
  {
    id: '31',
    name: 'Life is Good Wave Tee',
    price: 3.0,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fd62d20bdecca4f95b0c97349ec830a78?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Berkualitas',
    usage: 'Casual Wear, Beach Theme, Positive Message',
  },
  {
    id: '34',
    name: 'Saint City Tee',
    price: 3.5,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F964545a1b5d34628b7e95645c51cb3da?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton 100%',
    usage: 'Casual Wear, Urban Style, Statement Shirt',
  },
];

export default function Index() {
  const { addToCart } = useCart();
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddToCart = (id: string) => {
    if (!isLoggedIn) {
      toast({
        title: 'Silakan Login',
        description: 'Anda harus masuk untuk menambahkan item ke keranjang.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    const sticker = FEATURED_STICKERS.find(s => s.id === id);
    if (sticker) {
      addToCart({
        id: sticker.id,
        name: sticker.name,
        price: sticker.price,
        image: sticker.image,
      });
      toast({
        title: 'Ditambahkan ke Keranjang',
        description: `${sticker.name} telah ditambahkan ke keranjang Anda.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 pb-32">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent-foreground">
                Koleksi Baru Tersedia
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Stiker yang Mengekspresikan Diri Anda
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
              Temukan ribuan stiker berkualitas tinggi untuk laptop, ponsel, botol air, dan banyak lagi. Ekspresikan kepribadian Anda dengan koleksi pilihan kami dari seniman independen di seluruh dunia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Mulai Belanja
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/5 transition-colors duration-200">
                Lihat Penawaran
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-border/50">
              <div>
                <div className="text-3xl font-bold text-primary">50K+</div>
                <p className="text-sm text-muted-foreground mt-2">Pelanggan Puas</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">5000+</div>
                <p className="text-sm text-muted-foreground mt-2">Desain Unik</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">48H</div>
                <p className="text-sm text-muted-foreground mt-2">Pengiriman Gratis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Sedang Trending
          </h2>
          <p className="text-lg text-muted-foreground">
            Lihat koleksi stiker paling populer yang dimiliki komunitas kami
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_STICKERS.map(sticker => (
            <ProductCard
              key={sticker.id}
              {...sticker}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Bergabunglah dengan Komunitas Stiker Kami
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Dapatkan penawaran eksklusif, akses awal ke koleksi baru, dan bergabunglah dengan ribuan penggemar stiker
          </p>
          <Link to="/login" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fc99ee96232a84df9a39eb98db8905fdc?format=webp&width=800&height=1200"
                  alt="IndoGlobalPrint Logo"
                  className="h-8 w-auto object-contain"
                />
                <h3 className="font-bold text-lg">IndoGlobalPrint</h3>
              </div>
              <p className="text-sm opacity-75">
                Tujuan utama Anda untuk stiker berkualitas tinggi dan unik.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Toko</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><Link to="/shop" className="hover:opacity-100 transition">Semua Stiker</Link></li>
                <li><Link to="#" className="hover:opacity-100 transition">Kategori</Link></li>
                <li><Link to="#" className="hover:opacity-100 transition">Paling Populer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Dukungan</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><Link to="/about" className="hover:opacity-100 transition">Tentang Kami</Link></li>
                <li><Link to="#" className="hover:opacity-100 transition">Info Pengiriman</Link></li>
                <li><Link to="#" className="hover:opacity-100 transition">Pengembalian</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><Link to="#" className="hover:opacity-100 transition">Privasi</Link></li>
                <li><Link to="#" className="hover:opacity-100 transition">Ketentuan</Link></li>
                <li><Link to="#" className="hover:opacity-100 transition">Cookie</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2025 IndoGlobalPrint. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
