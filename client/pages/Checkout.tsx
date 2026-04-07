import { Header } from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MapPin, Package, Check, AlertCircle, CreditCard, Truck } from 'lucide-react';
import { saveUser, saveShippingAddress, createOrder, processPayment } from '@/services/checkoutService';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, checkout, getTotalPrice } = useCart();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cod'>('bank');

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
    if (!paymentMethod) {
      setError('Harap pilih metode pembayaran');
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

    try {
      // 1. Save or update user
      const userResult = await saveUser({
        id: user?.id,
        name: shippingData.recipientName,
        email: shippingData.email,
        phone: shippingData.phone,
        address: shippingData.address,
      });

      const userId = userResult.id;

      // 2. Save shipping address
      const addressResult = await saveShippingAddress({
        userId,
        recipientName: shippingData.recipientName,
        email: shippingData.email,
        phone: shippingData.phone,
        streetAddress: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        postalCode: shippingData.zipCode,
        country: shippingData.country,
        isDefault: true,
      });

      const shippingAddressId = addressResult.id;

      // 3. Create order
      const orderResult = await createOrder({
        userId,
        shippingAddressId,
        paymentMethodType: paymentMethod === 'bank' ? 'bank_transfer' : 'cod',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: getTotalPrice(),
        taxAmount: getTotalPrice() * 0.03,
        taxPercentage: 3,
        shippingCost: 0,
        additionalFees: paymentMethod === 'cod' ? 10000 / 16000 : 0,
        totalAmount: total,
      });

      const orderId = orderResult.id;

      // 4. Process payment
      await processPayment({
        orderId,
        amount: total,
        status: 'completed',
      });

      // Show success message
      const methodText = paymentMethod === 'bank' ? 'Transfer Bank' : 'Bayar di Tempat (COD)';
      setSuccessMessage(`Pesanan ditempatkan dengan sukses! ✓ Order: ${orderResult.orderNumber} | Metode: ${methodText}`);
      setIsProcessing(false);

      // Process checkout after 2 seconds
      setTimeout(() => {
        checkout();
        navigate('/orders');
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses pesanan';
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.03;
  const shippingCost = 0;
  const codFee = paymentMethod === 'cod' ? 10000 / 16000 : 0; // 10000 IDR converted to USD
  const total = subtotal + tax + shippingCost + codFee;

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
                        Harga: <span className="font-semibold">Rp {(item.price * 16000).toLocaleString('id-ID')}</span> per item
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        Rp {((item.price * item.quantity) * 16000).toLocaleString('id-ID')}
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
                        placeholder="Bekasi"
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
                        placeholder="Jawa Barat"
                        maxLength={14}
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
                    

              {/* Payment Method */}
              <div className="bg-muted/30 rounded-2xl p-6 border border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  Metode Pembayaran
                </h2>

                <div className="space-y-4 mb-8">
                  {/* Bank Transfer Option */}
                  <div
                    onClick={() => setPaymentMethod('bank')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-white hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="w-5 h-5 mt-1 cursor-pointer accent-primary"
                      />
                      <div className="flex-1">
                        <label className="block font-semibold text-foreground cursor-pointer">
                          Transfer Bank
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Transfer langsung ke rekening bank kami dengan biaya admin minimal
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery Option */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-white hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-5 h-5 mt-1 cursor-pointer accent-primary"
                      />
                      <div className="flex-1">
                        <label className="block font-semibold text-foreground cursor-pointer">
                          Bayar di Tempat (COD)
                        </label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Bayar kepada kurir saat paket tiba di alamat Anda
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Transfer Details */}
                {paymentMethod === 'bank' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Detail Transfer Bank
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-start bg-white p-3 rounded border border-blue-100">
                        <span className="text-blue-800 font-semibold">Bank:</span>
                        <span className="text-foreground font-bold">Bank Central Asia (BCA)</span>
                      </div>
                      <div className="flex justify-between items-start bg-white p-3 rounded border border-blue-100">
                        <span className="text-blue-800 font-semibold">Nomor Rekening:</span>
                        <span className="text-foreground font-mono font-bold">1234567890</span>
                      </div>
                      <div className="flex justify-between items-start bg-white p-3 rounded border border-blue-100">
                        <span className="text-blue-800 font-semibold">Atas Nama:</span>
                        <span className="text-foreground font-bold">PT IndoGlobalPrint</span>
                      </div>
                      <div className="flex justify-between items-start bg-white p-3 rounded border border-blue-100">
                        <span className="text-blue-800 font-semibold">Nominal:</span>
                        <span className="text-foreground font-bold">Rp {(getTotalPrice() * 16000).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-100 rounded text-sm text-blue-900">
                      <p className="font-semibold mb-1">⚠️ Penting:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Pastikan nominal transfer sesuai agar pesanan terverifikasi otomatis</li>
                        <li>Konfirmasi pembayaran akan dikirim via email dalam 2 jam</li>
                        <li>Jika ada kendala, hubungi customer service kami</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery Details */}
                {paymentMethod === 'cod' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Informasi Bayar di Tempat (COD)
                    </h3>
                    <div className="space-y-3 text-sm text-green-900">
                      <div className="bg-white p-3 rounded border border-green-100">
                        <p className="font-semibold mb-2">Cara Pembayaran:</p>
                        <p>Anda bisa membayar langsung kepada kurir dengan uang tunai atau Transfer</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-100">
                        <p className="font-semibold mb-2">Estimasi Biaya Tambahan:</p>
                        <p>Ada biaya COD sebesar Rp 10.000 yang akan ditambahkan ke total pembayaran Anda.</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-green-100">
                        <p className="font-semibold mb-2">Estimasi Pengiriman:</p>
                        <p>2-3 hari kerja dari tanggal pemesanan</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-100 rounded text-sm text-green-900">
                      <p className="font-semibold">✓ Keuntungan COD:</p>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>Bayar setelah paket tiba dengan aman</li>
                        <li>Tidak perlu transfer bank terlebih dahulu</li>
                        <li>Bisa langsung cek produk sebelum bayar</li>
                      </ul>
                    </div>
                  </div>
                )}
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
                  <span className="font-semibold text-foreground">Rp {(subtotal * 16000).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pajak (3%)</span>
                  <span className="font-semibold text-foreground">Rp {(tax * 16000).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pengiriman</span>
                  <span className="font-semibold text-green-600">GRATIS</span>
                </div>
                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-sm border-t border-border pt-4">
                    <span className="text-muted-foreground">Biaya COD</span>
                    <span className="font-semibold text-orange-600">Rp 10.000</span>
                  </div>
                )}
                <div className={`flex justify-between text-sm ${paymentMethod === 'cod' ? '' : 'border-b border-border pb-4'} ${paymentMethod === 'cod' ? 'border-t border-border pt-4' : ''}`}>
                  <span className="text-muted-foreground">Metode Pembayaran</span>
                  <span className="font-semibold text-foreground">
                    {paymentMethod === 'bank' ? 'Transfer Bank' : 'COD'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between p-4 bg-primary/10 rounded-lg border border-primary/20 mb-6">
                <span className="font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">Rp {(total * 16000).toLocaleString('id-ID')}</span>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <p>✓ Pengiriman gratis untuk semua pesanan</p>
                <p>✓ Perkiraan pengiriman: 2-3 hari kerja</p>
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
