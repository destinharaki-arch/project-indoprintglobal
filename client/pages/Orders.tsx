import { Header } from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Calendar, MapPin, CreditCard, Truck, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { orders } = useCart();

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Silakan Masuk</h1>
            <p className="text-muted-foreground mb-8">
              Anda perlu masuk untuk melihat riwayat pesanan Anda.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Masuk Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Kembali"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Package className="w-10 h-10 text-primary" />
              Riwayat Pembelian Stiker
            </h1>
            <p className="text-muted-foreground mt-2">
              Lihat semua pesanan stiker Anda yang telah dibuat
            </p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-muted/30 rounded-2xl border border-border p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Belum Ada Pesanan</h2>
            <p className="text-muted-foreground mb-8">
              Anda belum membuat pesanan stiker. Mulai belanja sekarang dan lihat riwayat pesanan Anda di sini!
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Belanja Stiker Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-semibold">Total Pesanan</p>
                    <p className="text-3xl font-bold text-blue-900">{orders.length}</p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-semibold">Total Item</p>
                    <p className="text-3xl font-bold text-green-900">
                      {orders.reduce((sum, order) => sum + order.items.length, 0)}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-semibold">Total Pengeluaran</p>
                    <p className="text-2xl font-bold text-purple-900">
                      Rp {(orders.reduce((sum, order) => sum + order.total, 0) * 16000).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <CreditCard className="w-8 h-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-semibold">Pengiriman</p>
                    <p className="text-2xl font-bold text-orange-900">Gratis</p>
                  </div>
                  <Truck className="w-8 h-8 text-orange-400" />
                </div>
              </div>
            </div>

            {/* Orders */}
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors bg-white"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ID Pesanan</p>
                        <p className="font-bold text-lg text-foreground">{order.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground flex items-center justify-end gap-1 mb-2">
                        <Calendar className="w-4 h-4" />
                        {order.date}
                      </p>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status === 'completed' && '✓ Selesai'}
                        {order.status === 'shipped' && '📦 Dikirim'}
                        {order.status === 'pending' && '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    Item Pesanan ({order.items.length})
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/20 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Jumlah: <span className="font-semibold">{item.quantity}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Per Item</p>
                          <p className="font-bold text-primary">
                            Rp {(item.price * 16000).toLocaleString('id-ID')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Subtotal: Rp {(item.price * item.quantity * 16000).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-muted/30 p-6 border-t border-border">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">
                      Rp {(order.total * 16000).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-muted-foreground">Pajak (8%)</span>
                    <span className="font-semibold text-foreground">
                      Rp {(order.total * 0.08 * 16000).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-border">
                    <span className="text-muted-foreground">Pengiriman</span>
                    <span className="font-semibold text-green-600">GRATIS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">Total Pesanan</span>
                    <span className="text-2xl font-bold text-primary">
                      Rp {((order.total * 1.08) * 16000).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        {orders.length > 0 && (
          <div className="mt-12 pt-12 border-t border-border">
            <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Butuh Bantuan?</h3>
              <p className="text-blue-800 mb-4">
                Jika Anda memiliki pertanyaan tentang pesanan Anda, jangan ragu untuk menghubungi tim customer service kami.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">Email</p>
                  <p className="text-blue-700">hello@indoglobalprint.com</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">Telepon</p>
                  <p className="text-blue-700">+62 (123) 456-7890</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">Jam Operasional</p>
                  <p className="text-blue-700">Senin - Jumat (09:00 - 18:00)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
