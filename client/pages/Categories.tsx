import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';

const ALL_STICKERS = [
  {
    id: '1',
    name: 'Cosmic Dream Pack',
    price: 4.99,
    category: 'Space',
    image: 'https://images.unsplash.com/photo-1578926078328-123c71e45b92?w=400&h=400&fit=crop',
    reviews: 128,
    size: '5-10 cm',
    shape: 'Lingkaran & Bintang',
    material: 'Vinil Glossy',
    usage: 'Laptop, Tablet, Dekorasi Dinding',
  },
  {
    id: '2',
    name: 'Pastel Vibes Collection',
    price: 5.99,
    category: 'Aesthetic',
    image: 'https://images.unsplash.com/photo-1516169a1ce13e4d0d8ba5a7c0f3bcc4?w=400&h=400&fit=crop',
    reviews: 95,
    size: '4-8 cm',
    shape: 'Persegi & Oval',
    material: 'Vinil Matte',
    usage: 'Botol Minum, Notebook, Laptop',
  },
  {
    id: '3',
    name: 'Retro Gaming Bundle',
    price: 6.99,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1538481143235-a15c99a8ebb1?w=400&h=400&fit=crop',
    reviews: 156,
    size: '6-12 cm',
    shape: 'Persegi Panjang & Kotak',
    material: 'Vinil Glossy Waterproof',
    usage: 'Gaming Console, Laptop, Kendaraan',
  },
  {
    id: '4',
    name: 'Nature Lovers Series',
    price: 4.49,
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1518532500516-37786d3f2c91?w=400&h=400&fit=crop',
    reviews: 82,
    size: '5-10 cm',
    shape: 'Organik & Daun',
    material: 'Vinil Eco-Friendly',
    usage: 'Tumbler, Laptop, Outdoor Gear',
  },
  {
    id: '5',
    name: 'Meme Master Pack',
    price: 5.49,
    category: 'Fun',
    image: 'https://images.unsplash.com/photo-1516919592328-3bda9b4f16f1?w=400&h=400&fit=crop',
    reviews: 203,
    size: '4-10 cm',
    shape: 'Bulat & Bentuk Custom',
    material: 'Vinil Glossy',
    usage: 'Helm, Skateboard, Laptop, Tas',
  },
  {
    id: '6',
    name: 'Cyberpunk Neon Set',
    price: 7.99,
    category: 'Futuristic',
    image: 'https://images.unsplash.com/photo-1551431009-381d36ac3a99?w=400&h=400&fit=crop',
    reviews: 174,
    size: '7-15 cm',
    shape: 'Geometric & Futuristik',
    material: 'Vinil Holographic',
    usage: 'Gaming Setup, Laptop, Dekorasi Ruangan',
  },
  {
    id: '7',
    name: 'Kawaii Friends',
    price: 5.99,
    category: 'Cute',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    reviews: 142,
    size: '3-8 cm',
    shape: 'Bulat & Hati',
    material: 'Vinil Matte',
    usage: 'Laptop, Notebook, Smartphone Case',
  },
  {
    id: '8',
    name: 'Abstract Minimalist',
    price: 4.99,
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1515378519653-1700523bb21b?w=400&h=400&fit=crop',
    reviews: 67,
    size: '5-12 cm',
    shape: 'Geometrik & Abstrak',
    material: 'Vinil Matte Waterproof',
    usage: 'Laptop, Wall Art, Furniture',
  },
  {
    id: '9',
    name: 'Anime Classics',
    price: 6.49,
    category: 'Anime',
    image: 'https://images.unsplash.com/photo-1578926078328-123c71e45b92?w=400&h=400&fit=crop',
    reviews: 189,
    size: '6-12 cm',
    shape: 'Oval & Persegi',
    material: 'Vinil Glossy',
    usage: 'Laptop, Notebook, Merchandise Display',
  },
  {
    id: '10',
    name: 'Vintage Vibes',
    price: 5.29,
    category: 'Vintage',
    image: 'https://images.unsplash.com/photo-1516169a1ce13e4d0d8ba5a7c0f3bcc4?w=400&h=400&fit=crop',
    reviews: 76,
    size: '4-10 cm',
    shape: 'Persegi & Oval Klasik',
    material: 'Vinil Matte',
    usage: 'Vintage Collection, Scrapbook, Dekorasi',
  },
  {
    id: '11',
    name: 'Music Lovers',
    price: 6.99,
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1538481143235-a15c99a8ebb1?w=400&h=400&fit=crop',
    reviews: 143,
    size: '5-12 cm',
    shape: 'Bulat & Catatan Musik',
    material: 'Vinil Glossy',
    usage: 'Gitar, Laptop, Music Studio Decor',
  },
  {
    id: '12',
    name: 'Sports Collection',
    price: 5.79,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1518532500516-37786d3f2c91?w=400&h=400&fit=crop',
    reviews: 94,
    size: '6-10 cm',
    shape: 'Bulat & Dinamis',
    material: 'Vinil Waterproof',
    usage: 'Helm, Jersey, Peralatan Olahraga, Laptop',
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
