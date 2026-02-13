import { Header } from '@/components/Header';

export default function Cart() {
  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={0} />
      
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Shopping Cart</h1>
          <p className="text-muted-foreground mb-8">
            Your shopping cart experience is ready to be built! This page can include cart items, quantity adjustments, and checkout flow.
          </p>
          <div className="inline-block bg-primary/10 border border-primary/30 rounded-lg px-6 py-4 text-sm">
            <p className="text-primary font-semibold">Ready to build the cart?</p>
            <p className="text-muted-foreground text-xs mt-2">
              Let me know what you'd like and I'll implement it
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
