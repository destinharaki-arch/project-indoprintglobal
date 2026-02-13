import { Header } from '@/components/Header';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { Mail, Phone, MapPin, Calendar, Package, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useUser();
  const { orders } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Please Log In</h1>
            <p className="text-muted-foreground mb-8">
              You need to be logged in to view your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground mt-2">
                  Member since {user.joinDate}
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold">
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </button>
          </div>

          {/* Account Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold text-foreground">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            {user.phone && (
              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border">
                <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">{user.phone}</p>
                </div>
              </div>
            )}

            {/* Address */}
            {user.address && (
              <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border md:col-span-2">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-semibold text-foreground">{user.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Order History
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-border">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-6">No orders yet</p>
              <Link
                to="/shop"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="border border-border rounded-lg p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-bold text-foreground text-lg">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                      <span
                        className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4 pb-4 border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-3">Items ({order.items.length})</p>
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-foreground">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-semibold text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-foreground">Order Total:</p>
                    <p className="text-xl font-bold text-primary">
                      ${(order.total * 1.08).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
