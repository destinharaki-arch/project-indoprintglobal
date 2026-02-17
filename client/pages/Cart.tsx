import { Header } from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any stickers yet. Start shopping to fill your cart!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {!user && items.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 m-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-semibold">Login Required</p>
            <p className="text-yellow-700 text-sm">You must be logged in to proceed with checkout. <Link to="/login" className="font-semibold underline">Sign in here</Link></p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white border border-border rounded-lg hover:border-primary/30 transition-colors"
                >
                  {/* Image */}
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Minus className="w-4 h-4 text-foreground" />
                      </button>
                      <span className="text-sm font-semibold text-foreground w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Plus className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-bold text-lg text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-muted/30 rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              {/* Items Count */}
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span className="text-foreground font-semibold">${getTotalPrice().toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between mb-4 text-sm border-b border-border pb-4">
                <span className="text-muted-foreground">Shipping (Free)</span>
                <span className="text-foreground font-semibold">$0.00</span>
              </div>

              {/* Tax */}
              <div className="flex justify-between mb-6 text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="text-foreground font-semibold">
                  ${(getTotalPrice() * 0.08).toFixed(2)}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-lg text-primary">
                  ${(getTotalPrice() * 1.08).toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <Link
                to="/shop"
                className="block text-center mt-4 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
