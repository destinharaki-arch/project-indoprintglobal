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
