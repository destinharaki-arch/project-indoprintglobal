import { Header } from '@/components/Header';

export default function Shop() {
  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={0} />
      
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🛍️</div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Shop Page</h1>
          <p className="text-muted-foreground mb-8">
            This page is ready for you to customize with filtering, sorting, and more products. Let me know what features you'd like and I can build them out!
          </p>
          <div className="inline-block bg-primary/10 border border-primary/30 rounded-lg px-6 py-4 text-sm">
            <p className="text-primary font-semibold">Want to customize this page?</p>
            <p className="text-muted-foreground text-xs mt-2">
              Tell me what features you'd like (filters, sorting, pagination, etc.)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
