import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';

const ALL_STICKERS = [
  // STIKER CATEGORY
  {
    id: '13',
    name: 'Brand & Logo Bundle',
    price: 1.25,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F43efc79d057045a484691eea6e92cb0a?format=webp&width=800&height=1200',
    reviews: 0,
    size: '3-12 cm',
    shape: 'Berbagai Bentuk',
    material: 'Vinil Glossy Premium',
    usage: 'Laptop, Perangkat Gaming, Koleksi Brand',
  },
  {
    id: '14',
    name: 'Street Style Pack',
    price: 1.50,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Ff93a39ad971547daa1268e022c45ddfd?format=webp&width=800&height=1200',
    reviews: 0,
    size: '4-15 cm',
    shape: 'Urban & Streetwear',
    material: 'Vinil Glossy Waterproof',
    usage: 'Helm, Skateboard, Laptop, Fashion',
  },
  {
    id: '15',
    name: 'Indonesia Local Brand',
    price: 0.63,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F5a64f3f762ec406b9fd6ce57f93c78da?format=webp&width=800&height=1200',
    reviews: 0,
    size: '5-12 cm',
    shape: 'Lokal & Unik',
    material: 'Vinil Matte',
    usage: 'Koleksi Lokal, Merchandise, Dekorasi',
  },
  {
    id: '19',
    name: 'Band Music Sticker Pack 1',
    price: 1.0,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F04b47a6243b34c738b3dc2c7ff88c596?format=webp&width=800&height=1200',
    reviews: 0,
    size: '3-15 cm',
    shape: 'Band Logo Mix',
    material: 'Vinil Glossy Premium',
    usage: 'Helm, Laptop, Skateboard, Merchandise',
  },
  {
    id: '20',
    name: 'Band Music Sticker Pack 2',
    price: 1.1,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F5ffab0ea2d514651b0aed0a0006680b1?format=webp&width=800&height=1200',
    reviews: 0,
    size: '3-15 cm',
    shape: 'Band Logo Mix',
    material: 'Vinil Glossy Premium',
    usage: 'Helm, Laptop, Skateboard, Merchandise',
  },
  {
    id: '21',
    name: 'Street Sticker',
    price: 1.0,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fde2ba40586274fcbbda9464e5580228c?format=webp&width=800&height=1200',
    reviews: 0,
    size: '4-12 cm',
    shape: 'Urban Mix',
    material: 'Vinil Waterproof',
    usage: 'Urban Gear, Skateboard, Laptop',
  },
  {
    id: '36',
    name: 'Gojo Satoru',
    price: 1.25,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Ff4589f2bed3c4eacbb7bfded6a54104d?format=webp&width=800&height=1200',
    reviews: 0,
    size: '8-15 cm',
    shape: 'Character Design',
    material: 'Vinil Glossy Premium',
    usage: 'Anime Collection, Jujutsu Kaisen Fan, Laptop Decoration',
  },
  {
    id: '37',
    name: 'Reze - Bomb Devil',
    price: 1.25,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Faa63ab2dea4c4e11a8326a80cc2f975f?format=webp&width=800&height=1200',
    reviews: 0,
    size: '8-15 cm',
    shape: 'Character Design',
    material: 'Vinil Glossy Premium',
    usage: 'Chainsaw Man Fan, Anime Collection, Laptop Decoration',
  },
  {
    id: '38',
    name: 'Frieren',
    price: 1.25,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F649767a671d643d3ab68421c5ab6373e?format=webp&width=800&height=1200',
    reviews: 0,
    size: '8-15 cm',
    shape: 'Character Design',
    material: 'Vinil Glossy Premium',
    usage: 'Frieren Fans, Anime Collection, Laptop Decoration',
  },
  {
    id: '39',
    name: 'Death Note',
    price: 1.25,
    category: 'Stiker',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fd50c7bbe4ecf4f73abe3ccf5fd69cc2c?format=webp&width=800&height=1200',
    reviews: 0,
    size: '8-15 cm',
    shape: 'Character Design',
    material: 'Vinil Glossy Premium',
    usage: 'Death Note Fans, Anime Collection, Laptop Decoration',
  },
  // T-SHIRT CATEGORY
  {
    id: '16',
    name: 'art of a Down Tee',
    price: 2.13,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fddb3594a19f04a5cbd2b4c275d85c1fb?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton 100%',
    usage: 'Casual Wear, Band Merchandise, Koleksi Vintage',
  },
  {
    id: '17',
    name: 'Music Artist Bundle Tee',
    price: 3.38,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fa9d9b537cd384b46ada87b237e49fdbe?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Concert Merch, Streetwear',
  },
  {
    id: '18',
    name: 'Planet & Slogan Graphic Tee',
    price: 3.12,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F577684ad63a44154b443e15c0055085e?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Berkualitas',
    usage: 'Casual Wear, Fashion Statement, Daily Wear',
  },
  {
    id: '22',
    name: 'Retro Aesthetic Tee',
    price: 3.63,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F21f8eb63700c48f18dd789586e363604?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Oversized Fit',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Retro Fashion, Streetwear',
  },
  {
    id: '23',
    name: 'Nature & Adventure Tee',
    price: 3.38,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fbb61ddac41b544de9d8a0687d18cb113?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Organic',
    usage: 'Casual Wear, Outdoor, Travel Fashion',
  },
  {
    id: '24',
    name: 'Minimalist Design Tee',
    price: 3.75,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fff4cc51d24bf4475892214e7edfdffc2?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Minimalist Style, Daily Wear',
  },
  {
    id: '25',
    name: 'Statue of Liberty Graphic Tee',
    price: 3.52,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F8745f6a9c95e4748a3551354005bbbad?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Iconic Design, Travel Theme',
  },
  {
    id: '26',
    name: 'Gods Play Overdeck Tee',
    price: 3.91,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fc52f0057e3484a9fa9f22c01531c4d5d?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Combed',
    usage: 'Casual Wear, Street Fashion, Daily Wear',
  },
  {
    id: '27',
    name: 'Lost In The Stars Tee',
    price: 3.29,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fe5dc78085dda4ebeb0af9d4ac5591c81?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Crew Neck',
    material: 'Cotton 20s',
    usage: 'Casual Wear, Elegant Design, Night Theme',
  },
  {
    id: '28',
    name: 'Prosstha Spider Design Tee',
    price: 4.01,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fc749ebc8019c4788aeaabd270d6e2ab8?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Edgy Style, Statement Piece',
  },
  {
    id: '29',
    name: 'Bobotoh 1919 Football Tee',
    price: 4.02,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F926cb19d11cd43de8c89d7e1c5b46f67?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Combed',
    usage: 'Sports Fan Wear, Football Culture, Supporter Gear',
  },
  {
    id: '30',
    name: 'Kingdom Botanical Tee',
    price: 4.06,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F7cda3d754bcb46ddbe67e8ac4433a7e9?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Vintage',
    usage: 'Casual Wear, Christian Apparel, Spiritual Design',
  },
  {
    id: '31',
    name: 'Life is Good Wave Tee',
    price: 4.94,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fd62d20bdecca4f95b0c97349ec830a78?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Berkualitas',
    usage: 'Casual Wear, Beach Theme, Positive Message',
  },
  {
    id: '32',
    name: 'Butterfly Trends Tee',
    price: 4.12,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F39766e490d7a4e93a61e0fa2525c3f6c?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Fashion Forward, Nature Inspired',
  },
  {
    id: '33',
    name: 'Rock Band Silhouette Tee',
    price: 4.21,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F9b0a3547d11f4597a960d1c42822e0e5?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Vintage',
    usage: 'Casual Wear, Music Fan Gear, Retro Style',
  },
  {
    id: '34',
    name: 'Saint City Tee',
    price: 4.35,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F964545a1b5d34628b7e95645c51cb3da?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'L - XXL',
    shape: 'Crew Neck',
    material: 'Cotton 100%',
    usage: 'Casual Wear, Urban Style, Statement Shirt',
  },
  {
    id: '35',
    name: 'Money Never Sleeps Tee',
    price: 4.31,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2Fb434fea4abb84c638e775898945fe036?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Casual Wear, Motivational Design, Street Style',
  },
  {
    id: '40',
    name: 'Demon Slayer Collection Tee',
    price: 3.75,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F30320dbee3ad4f3fbcc239878d584cf9?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Anime Fan, Demon Slayer Collection, Casual Wear',
  },
  {
    id: '41',
    name: 'Anime Characters Design Tee',
    price: 3.88,
    category: 'T-Shirt',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F9c50b3bcefd1446d9de9ea9a61046f45%2F4494a3d1ac084c30b347702443565be0?format=webp&width=800&height=1200',
    reviews: 0,
    size: 'M - XXL',
    shape: 'Crew Neck',
    material: 'Cotton Premium',
    usage: 'Anime Fan, Character Design, Casual Wear',
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
