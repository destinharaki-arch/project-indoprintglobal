import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
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
  {
    id: '16',
    name: 'System of a Down Tee',
    price: 12.99,
    category: 'Apparel',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fddb3594a19f04a5cbd2b4c275d85c1fb?format=webp&width=800&height=1200',
    reviews: 89,
    size: 'XS - XXL',
    shape: 'Crew Neck',
    material: 'Cotton 100%',
    usage: 'Casual Wear, Band Merchandise, Koleksi Vintage',
  },
  {
    id: '17',
    name: 'Music Artist Bundle Tee',
    price: 13.99,
    category: 'Apparel',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fa9d9b537cd384b46ada87b237e49fdbe?format=webp&width=800&height=1200',
    reviews: 112,
    size: 'XS - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Concert Merch, Streetwear',
  },
  {
    id: '18',
    name: 'Planet & Slogan Graphic Tee',
    price: 11.99,
    category: 'Apparel',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F577684ad63a44154b443e15c0055085e?format=webp&width=800&height=1200',
    reviews: 76,
    size: 'XS - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Berkualitas',
    usage: 'Casual Wear, Fashion Statement, Daily Wear',
  },
  {
    id: '19',
    name: 'Band Music Sticker Pack 1',
    price: 6.99,
    category: 'Brand',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F04b47a6243b34c738b3dc2c7ff88c596?format=webp&width=800&height=1200',
    reviews: 134,
    size: '3-15 cm',
    shape: 'Band Logo Mix',
    material: 'Vinil Glossy Premium',
    usage: 'Helm, Laptop, Skateboard, Merchandise',
  },
  {
    id: '20',
    name: 'Band Music Sticker Pack 2',
    price: 6.99,
    category: 'Brand',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F5ffab0ea2d514651b0aed0a0006680b1?format=webp&width=800&height=1200',
    reviews: 127,
    size: '3-15 cm',
    shape: 'Band Logo Mix',
    material: 'Vinil Glossy Premium',
    usage: 'Helm, Laptop, Skateboard, Merchandise',
  },
  {
    id: '21',
    name: 'Urban Street Sticker Collection',
    price: 7.99,
    category: 'Street',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fde2ba40586274fcbbda9464e5580228c?format=webp&width=800&height=1200',
    reviews: 145,
    size: '4-12 cm',
    shape: 'Urban Mix',
    material: 'Vinil Waterproof',
    usage: 'Urban Gear, Skateboard, Laptop',
  },
  {
    id: '22',
    name: 'Retro Aesthetic Tee',
    price: 14.99,
    category: 'Apparel',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F21f8eb63700c48f18dd789586e363604?format=webp&width=800&height=1200',
    reviews: 98,
    size: 'XS - XXL',
    shape: 'Oversized Fit',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Retro Fashion, Streetwear',
  },
  {
    id: '23',
    name: 'Nature & Adventure Tee',
    price: 13.99,
    category: 'Apparel',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fbb61ddac41b544de9d8a0687d18cb113?format=webp&width=800&height=1200',
    reviews: 87,
    size: 'XS - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Organic',
    usage: 'Casual Wear, Outdoor, Travel Fashion',
  },
  {
    id: '24',
    name: 'Minimalist Design Tee',
    price: 12.99,
    category: 'Apparel',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fff4cc51d24bf4475892214e7edfdffc2?format=webp&width=800&height=1200',
    reviews: 103,
    size: 'XS - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Minimalist Style, Daily Wear',
  },
  {
    id: '25',
    name: 'Statue of Liberty Graphic Tee',
    price: 13.99,
    category: 'Apparel',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F8745f6a9c95e4748a3551354005bbbad?format=webp&width=800&height=1200',
    reviews: 156,
    size: 'XS - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Iconic Design, Travel Theme',
  },
];

const CATEGORIES = Array.from(new Set(ALL_STICKERS.map(s => s.category))).sort();
const MATERIALS = Array.from(new Set(ALL_STICKERS.map(s => s.material))).sort();

export default function Shop() {
  const { addToCart } = useCart();
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');

  const filteredStickers = ALL_STICKERS.filter(sticker => {
    const matchesSearch = sticker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sticker.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || sticker.category === selectedCategory;
    const matchesMaterial = !selectedMaterial || sticker.material === selectedMaterial;
    return matchesSearch && matchesCategory && matchesMaterial;
  });

  const sortedStickers = [...filteredStickers].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      {/* Featured Banner */}
      <section className="relative h-96 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="max-w-xl">
              <p className="text-primary text-sm font-semibold mb-2">— Koleksi Terbaru</p>
              <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                Jelajahi Koleksi Eksklusif Kami
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Temukan stiker dan apparel berkualitas tinggi dengan desain unik yang mencerminkan gaya Anda
              </p>
              <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95">
                Mulai Belanja
              </button>
            </div>

            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                  Cari Produk
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Nama atau kategori..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                  Kategori
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedCategory === null
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-slate-100'
                    }`}
                  >
                    Semua Kategori
                  </button>
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                        selectedCategory === category
                          ? 'bg-primary text-white'
                          : 'text-foreground hover:bg-slate-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                  Bahan
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedMaterial(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      selectedMaterial === null
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-slate-100'
                    }`}
                  >
                    Semua Bahan
                  </button>
                  {MATERIALS.slice(0, 5).map(material => (
                    <button
                      key={material}
                      onClick={() => setSelectedMaterial(material)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                        selectedMaterial === material
                          ? 'bg-primary text-white'
                          : 'text-foreground hover:bg-slate-100'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Header with Sort */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <div>
                <p className="text-muted-foreground text-sm">
                  Menampilkan <span className="font-bold text-foreground">{sortedStickers.length}</span> produk
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">Urutkan:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="newest">Terbaru</option>
                  <option value="popular">Paling Populer</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {sortedStickers.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg mb-4">Produk tidak ditemukan</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setSelectedMaterial(null);
                  }}
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedStickers.map(sticker => (
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
      </div>
    </div>
  );
}
