import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';

const ALL_STICKERS = [
  {
    id: '13',
    name: 'Brand & Logo Bundle',
    price: 4.99,
    category: 'Brand',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F43efc79d057045a484691eea6e92cb0a?format=webp&width=800&height=1200',
    reviews: 156,
    size: '3-12 cm',
    shape: 'Berbagai Bentuk',
    material: 'Vinil Glossy Premium',
    usage: 'Laptop, Perangkat Gaming, Koleksi Brand',
  },
  {
    id: '14',
    name: 'Street Style Pack',
    price: 5.99,
    category: 'Street',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Ff93a39ad971547daa1268e022c45ddfd?format=webp&width=800&height=1200',
    reviews: 203,
    size: '4-15 cm',
    shape: 'Urban & Streetwear',
    material: 'Vinil Glossy Waterproof',
    usage: 'Helm, Skateboard, Laptop, Fashion',
  },
  {
    id: '15',
    name: 'Indonesia Local Brand',
    price: 3.99,
    category: 'Local',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F5a64f3f762ec406b9fd6ce57f93c78da?format=webp&width=800&height=1200',
    reviews: 128,
    size: '5-12 cm',
    shape: 'Lokal & Unik',
    material: 'Vinil Matte',
    usage: 'Koleksi Lokal, Merchandise, Dekorasi',
  },
];

export default function Shop() {
  const { addToCart } = useCart();
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStickers = ALL_STICKERS.filter(sticker =>
    sticker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sticker.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

    const sticker = ALL_STICKERS.find(s => s.id === id);
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

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Semua Stiker
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Jelajahi koleksi lengkap kami dengan {ALL_STICKERS.length} desain stiker unik
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari stiker berdasarkan nama atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground placeholder-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground"
                title="Hapus"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        {searchQuery && (
          <p className="text-muted-foreground mb-6">
            Ditemukan {filteredStickers.length} stiker yang cocok dengan "{searchQuery}"
          </p>
        )}

        {/* Products Grid */}
        {filteredStickers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Stiker tidak ditemukan</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Hapus pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredStickers.map(sticker => (
              <ProductCard
                key={sticker.id}
                id={sticker.id}
                name={sticker.name}
                price={sticker.price}
                image={sticker.image}
                category={sticker.category}
                reviews={sticker.reviews}
                size={sticker.size}
                shape={sticker.shape}
                material={sticker.material}
                usage={sticker.usage}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
