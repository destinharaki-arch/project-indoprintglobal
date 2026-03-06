import { ShoppingCart, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  reviews?: number;
  size?: string;
  shape?: string;
  material?: string;
  usage?: string;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  rating = 5,
  reviews = 0,
  size,
  shape,
  material,
  usage,
  onAddToCart,
}: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-base mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
        )}

        {/* Details Expandable Section */}
        {(size || shape || material || usage) && (
          <div className="mb-3 pb-3 border-b border-border">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <span>Spesifikasi</span>
              <ChevronDown className={cn("w-3 h-3 transition-transform", showDetails && "rotate-180")} />
            </button>

            {showDetails && (
              <div className="mt-3 space-y-2 text-xs">
                {size && (
                  <div>
                    <span className="font-semibold text-foreground">Ukuran:</span>
                    <p className="text-muted-foreground">{size}</p>
                  </div>
                )}
                {shape && (
                  <div>
                    <span className="font-semibold text-foreground">Bentuk:</span>
                    <p className="text-muted-foreground">{shape}</p>
                  </div>
                )}
                {material && (
                  <div>
                    <span className="font-semibold text-foreground">Bahan:</span>
                    <p className="text-muted-foreground">{material}</p>
                  </div>
                )}
                {usage && (
                  <div>
                    <span className="font-semibold text-foreground">Kegunaan:</span>
                    <p className="text-muted-foreground">{usage}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-lg font-bold text-primary">
            Rp {(price * 16000).toLocaleString('id-ID')}
          </div>
          <button
            onClick={() => onAddToCart?.(id)}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "hover:scale-105 active:scale-95"
            )}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
