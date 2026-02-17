import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  reviews?: number;
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
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
