import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { Upload, X, Sparkles } from 'lucide-react';

// Recommendation engine data
const STICKER_RECOMMENDATIONS = {
  professional: [
    {
      id: '6',
      name: 'Cyberpunk Neon Set',
      price: 7.99,
      category: 'Futuristic',
      image: 'https://images.unsplash.com/photo-1551431009-381d36ac3a99?w=400&h=400&fit=crop',
      reviews: 174,
    },
  ],
  vibrant: [
    {
      id: '2',
      name: 'Pastel Vibes Collection',
      price: 5.99,
      category: 'Aesthetic',
      image: 'https://images.unsplash.com/photo-1516169a1ce13e4d0d8ba5a7c0f3bcc4?w=400&h=400&fit=crop',
      reviews: 95,
    },
    {
      id: '7',
      name: 'Kawaii Friends',
      price: 5.99,
      category: 'Cute',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
      reviews: 142,
    },
  ],
  artistic: [
    {
      id: '8',
      name: 'Abstract Minimalist',
      price: 4.99,
      category: 'Art',
      image: 'https://images.unsplash.com/photo-1515378519653-1700523bb21b?w=400&h=400&fit=crop',
      reviews: 67,
    },
    {
      id: '1',
      name: 'Cosmic Dream Pack',
      price: 4.99,
      category: 'Space',
      image: 'https://images.unsplash.com/photo-1578926078328-123c71e45b92?w=400&h=400&fit=crop',
      reviews: 128,
    },
  ],
  fun: [
    {
      id: '5',
      name: 'Meme Master Pack',
      price: 5.49,
      category: 'Fun',
      image: 'https://images.unsplash.com/photo-1516919592328-3bda9b4f16f1?w=400&h=400&fit=crop',
      reviews: 203,
    },
    {
      id: '9',
      name: 'Anime Classics',
      price: 6.49,
      category: 'Anime',
      image: 'https://images.unsplash.com/photo-1578926078328-123c71e45b92?w=400&h=400&fit=crop',
      reviews: 189,
    },
  ],
  nature: [
    {
      id: '4',
      name: 'Nature Lovers Series',
      price: 4.49,
      category: 'Nature',
      image: 'https://images.unsplash.com/photo-1518532500516-37786d3f2c91?w=400&h=400&fit=crop',
      reviews: 82,
    },
    {
      id: '3',
      name: 'Retro Gaming Bundle',
      price: 6.99,
      category: 'Gaming',
      image: 'https://images.unsplash.com/photo-1538481143235-a15c99a8ebb1?w=400&h=400&fit=crop',
      reviews: 156,
    },
  ],
};

interface UploadedDesign {
  file: File;
  preview: string;
  name: string;
}

export default function CustomDesign() {
  const { addToCart } = useCart();
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedDesign, setUploadedDesign] = useState<UploadedDesign | null>(null);
  const [recommendedCategory, setRecommendedCategory] = useState<keyof typeof STICKER_RECOMMENDATIONS>('professional');
  const [isDragging, setIsDragging] = useState(false);

  // Check if user is logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">Anda harus masuk untuk membuat desain kustom</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Masuk Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Format Tidak Valid',
        description: 'Silakan pilih file gambar (JPG, PNG, GIF, dll).',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Ukuran Terlalu Besar',
        description: 'Ukuran gambar maksimal 5MB.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedDesign({
        file,
        preview: e.target?.result as string,
        name: file.name,
      });
      toast({
        title: 'Gambar Berhasil Diunggah',
        description: 'Desain Anda telah diunggah. Lihat rekomendasi stiker di bawah!',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleAddToCart = (id: string) => {
    const sticker = Object.values(STICKER_RECOMMENDATIONS).flat().find(s => s.id === id);
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

  const recommendations = STICKER_RECOMMENDATIONS[recommendedCategory];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Desain Kustom Anda
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Unggah gambar Anda sendiri dan dapatkan rekomendasi stiker yang sempurna untuk melengkapinya
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div className="flex flex-col gap-6">
            <div className="bg-muted/50 rounded-2xl border-2 border-dashed border-border p-8">
              {uploadedDesign ? (
                <div className="flex flex-col gap-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={uploadedDesign.preview}
                      alt="Desain Anda"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Nama File:</p>
                    <p className="text-sm font-medium text-foreground break-all">
                      {uploadedDesign.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadedDesign(null)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-semibold"
                  >
                    <X className="w-4 h-4" />
                    Hapus dan Unggah Ulang
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className="flex flex-col items-center justify-center gap-4 py-12 cursor-pointer"
                >
                  <div className={`p-4 rounded-full ${isDragging ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground mb-1">
                      Seret dan Lepas Gambar Anda Di Sini
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      atau klik untuk memilih file
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF (Maks 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* Upload Tips */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Tip untuk Hasil Terbaik:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Gunakan gambar dengan resolusi tinggi (minimal 300x300px)</li>
                <li>Pastikan gambar jelas dan tidak blur</li>
                <li>Format landscape atau potret keduanya mendukung</li>
                <li>Hindari teks yang terlalu kecil</li>
              </ul>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="flex flex-col gap-6">
            {uploadedDesign && (
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Rekomendasi Stiker untuk Anda
                </h2>
                <p className="text-muted-foreground">
                  Pilih kategori stiker yang sesuai dengan desain Anda
                </p>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                  {Object.keys(STICKER_RECOMMENDATIONS).map(category => (
                    <button
                      key={category}
                      onClick={() => setRecommendedCategory(category as keyof typeof STICKER_RECOMMENDATIONS)}
                      className={`px-4 py-2 rounded-full font-semibold transition-colors capitalize ${
                        recommendedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {category === 'professional' && 'Profesional'}
                      {category === 'vibrant' && 'Cerah'}
                      {category === 'artistic' && 'Artistik'}
                      {category === 'fun' && 'Seru'}
                      {category === 'nature' && 'Alam'}
                    </button>
                  ))}
                </div>

                {/* Recommended Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations.map(sticker => (
                    <ProductCard
                      key={sticker.id}
                      {...sticker}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
                  <h3 className="font-bold text-foreground mb-2">Siap untuk Memesan?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tambahkan stiker favorit Anda ke keranjang dan lanjutkan ke checkout
                  </p>
                  <button
                    onClick={() => navigate('/cart')}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Lihat Keranjang
                  </button>
                </div>
              </div>
            )}

            {!uploadedDesign && (
              <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground font-medium">
                    Unggah desain Anda untuk melihat rekomendasi stiker
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
