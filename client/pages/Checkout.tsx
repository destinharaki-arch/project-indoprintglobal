import { Header } from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MapPin, Package, Check, AlertCircle } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, checkout, getTotalPrice } = useCart();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Shipping form state
  const [shippingData, setShippingData] = useState({
    recipientName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Silakan masuk untuk melanjutkan pembayaran</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Keranjang Anda kosong</p>
        </div>
      </div>
    );
  }

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const validateShippingData = () => {
    if (!shippingData.recipientName || !shippingData.address || !shippingData.city || !shippingData.state || !shippingData.zipCode) {
      setError('Harap isi semua informasi pengiriman');
      return false;
    }
    if (shippingData.zipCode.length < 5) {
      setError('Harap masukkan kode pos yang valid');
      return false;
    }
    return true;
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateShippingData()) {
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      setSuccessMessage('Pesanan ditempatkan dengan sukses! ✓');
      setIsProcessing(false);

      // Process checkout after 2 seconds
      setTimeout(() => {
        checkout();
        navigate('/profile');
      }, 2000);
    }, 1500);
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const shippingCost = 0;
  const total = subtotal + tax + shippingCost;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Pembayaran</h1>
        <p className="text-muted-foreground mb-12">Verifikasi pesanan stiker dan alamat pengiriman Anda</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-green-700 font-semibold">{successMessage}</p>
              </div>
            )}

            {/* Order Items Verification */}
            <div className="bg-muted/30 rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-primary" />
                Verifikasi Stiker Anda
              </h2>

              <div className="space-y-4">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-white rounded-lg border border-border"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Jumlah: <span className="font-semibold">{item.quantity}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Harga: <span className="font-semibold">${item.price.toFixed(2)}</span> per item
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">✓ Tersedia</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Semua item terverifikasi</p>
                  <p className="text-sm text-green-700">Semua stiker tersedia dan siap dikirim</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <form onSubmit={handleConfirmOrder} className="space-y-6">
              <div className="bg-muted/30 rounded-2xl p-6 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  Alamat Pengiriman
                </h2>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Recipient Name */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Nama Penerima
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={shippingData.recipientName}
                      onChange={handleShippingChange}
                      placeholder="Nama lengkap"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                    />
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingData.email}
                        onChange={handleShippingChange}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Telepon
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleShippingChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Alamat Jalan
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      placeholder="123 Main Street, Apt 4"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                    />
                  </div>

                  {/* City, State, Zip */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Kota
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        placeholder="Jakarta"
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Negara Bagian/Provinsi
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        placeholder="CA"
                        maxLength={2}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                      />
                    </div>
                  </div>

                  {/* Zip and Country */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Kode Pos
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleShippingChange}
                        placeholder="94102"
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Negara
                      </label>
                      <select
                        name="country"
                        value={shippingData.country}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                      >
                        <option>USA</option>
                        <option>Kanada</option>
                        <option>Inggris</option>
                        <option>Australia</option>
                        <option>Lainnya</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Memproses Pesanan...' : 'Konfirmasi & Pesan Sekarang'}
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="sticky top-20 bg-muted/30 rounded-2xl p-6 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Ringkasan Pesanan</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pajak (8%)</span>
                  <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-border pb-4">
                  <span className="text-muted-foreground">Pengiriman</span>
                  <span className="font-semibold text-green-600">GRATIS</span>
                </div>
              </div>

              <div className="flex justify-between p-4 bg-primary/10 rounded-lg border border-primary/20 mb-6">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <p>✓ Pengiriman gratis untuk semua pesanan</p>
                <p>✓ Perkiraan pengiriman: 5-7 hari kerja</p>
                <p>✓ Jaminan kepuasan 100%</p>
                <p>✓ Checkout yang aman</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
