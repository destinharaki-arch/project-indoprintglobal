import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

const ALL_STICKERS = [
  {
    id: '1',
    name: 'Cosmic Dream Pack',
    price: 4.99,
    category: 'Space',
    image: 'https://images.unsplash.com/photo-1578926078328-123c71e45b92?w=400&h=400&fit=crop',
    reviews: 128,
  },
  {
    id: '2',
    name: 'Pastel Vibes Collection',
    price: 5.99,
    category: 'Aesthetic',
    image: 'https://images.unsplash.com/photo-1516169a1ce13e4d0d8ba5a7c0f3bcc4?w=400&h=400&fit=crop',
    reviews: 95,
  },
  {
    id: '3',
    name: 'Retro Gaming Bundle',
    price: 6.99,
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1538481143235-a15c99a8ebb1?w=400&h=400&fit=crop',
    reviews: 156,
  },
  {
    id: '4',
    name: 'Nature Lovers Series',
    price: 4.49,
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1518532500516-37786d3f2c91?w=400&h=400&fit=crop',
    reviews: 82,
  },
  {
    id: '5',
    name: 'Meme Master Pack',
    price: 5.49,
    category: 'Fun',
    image: 'https://images.unsplash.com/photo-1516919592328-3bda9b4f16f1?w=400&h=400&fit=crop',
    reviews: 203,
  },
  {
    id: '6',
    name: 'Cyberpunk Neon Set',
    price: 7.99,
    category: 'Futuristic',
    image: 'https://images.unsplash.com/photo-1551431009-381d36ac3a99?w=400&h=400&fit=crop',
    reviews: 174,
  },
  {
    id: '7',
    name: 'Kawaii Friends',
    price: 5.99,
    category: 'Cute',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    reviews: 142,
  },
  {
    id: '8',
    name: 'Abstract Minimalist',
    price: 4.99,
    category: 'Art',
    image: 'https://images.unsplash.com/photo-1515378519653-1700523bb21b?w=400&h=400&fit=crop',
    reviews: 67,
  },
  {
    id: '9',
    name: 'Anime Classics',
    price: 6.49,
    category: 'Anime',
    image: 'https://images.unsplash.com/photo-1578926078328-123c71e45b92?w=400&h=400&fit=crop',
    reviews: 189,
  },
  {
    id: '10',
    name: 'Vintage Vibes',
    price: 5.29,
    category: 'Vintage',
    image: 'https://images.unsplash.com/photo-1516169a1ce13e4d0d8ba5a7c0f3bcc4?w=400&h=400&fit=crop',
    reviews: 76,
  },
  {
    id: '11',
    name: 'Music Lovers',
    price: 6.99,
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1538481143235-a15c99a8ebb1?w=400&h=400&fit=crop',
    reviews: 143,
  },
  {
    id: '12',
    name: 'Sports Collection',
    price: 5.79,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1518532500516-37786d3f2c91?w=400&h=400&fit=crop',
    reviews: 94,
  },
];

export default function Shop() {
  const { addToCart } = useCart();

  const handleAddToCart = (id: string) => {
    const sticker = ALL_STICKERS.find(s => s.id === id);
    if (sticker) {
      addToCart({
        id: sticker.id,
        name: sticker.name,
        price: sticker.price,
        image: sticker.image,
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
            All Stickers
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse our complete collection of {ALL_STICKERS.length} unique sticker designs
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALL_STICKERS.map(sticker => (
            <ProductCard
              key={sticker.id}
              {...sticker}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
