import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
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

const CATEGORIES = Array.from(new Set(ALL_STICKERS.map(s => s.category))).sort();

export default function Categories() {
  const { addToCart } = useCart();
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredStickers = selectedCategory
    ? ALL_STICKERS.filter(s => s.category === selectedCategory)
    : ALL_STICKERS;

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
        <h1 className="text-4xl font-bold text-foreground mb-12">
          Jelajahi berdasarkan Kategori
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-muted/30 rounded-2xl p-6 border border-border">
              <h2 className="text-lg font-bold text-foreground mb-4">Kategori</h2>

              {/* All Categories */}
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all mb-2 ${
                  selectedCategory === null
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                Semua ({ALL_STICKERS.length})
              </button>

              {/* Individual Categories */}
              <div className="space-y-2">
                {CATEGORIES.map(category => {
                  const count = ALL_STICKERS.filter(s => s.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredStickers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Stiker tidak ditemukan dalam kategori ini</p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-6">
                  Menampilkan {filteredStickers.length} stiker{' '}
                  {selectedCategory && `di ${selectedCategory}`}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStickers.map(sticker => (
                    <ProductCard
                      key={sticker.id}
                      {...sticker}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
