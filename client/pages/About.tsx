import { Header } from '@/components/Header';
import { Link } from 'react-router-dom';
import { Heart, Zap, Users, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-foreground mb-6">Tentang IndoGlobalPrint</h1>
            <p className="text-xl text-muted-foreground">
              Kami memiliki misi untuk membawa kreativitas, ekspresi diri, dan kegembiraan kepada para pecinta stiker di mana pun.
              Didirikan pada tahun 2023, IndoGlobalPrint telah menjadi platform komunitas untuk seniman dan penggemar.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-foreground mb-8">Cerita Kami</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                IndoGlobalPrint dimulai sebagai proyek passion dari sekelompok seniman dan desainer yang ingin membuat
                stiker berkualitas tinggi dapat diakses oleh semua orang. Kami menyadari bahwa orang mencari cara unik dan
                kreatif untuk mempersonalisasi barang-barang mereka - dari laptop hingga botol air.
              </p>
              <p>
                Apa yang dimulai sebagai koleksi kecil desain pilihan telah berkembang menjadi pasar yang berkembang dengan
                ribuan stiker unik dari seniman berbakat di seluruh dunia. Saat ini, kami dengan bangga melayani
                lebih dari 50.000 pelanggan puas yang berbagi passion kami untuk ekspresi diri.
              </p>
              <p>
                Komitmen kami terhadap kualitas, kreativitas, dan kepuasan pelanggan tetap menjadi inti dari semua yang kami lakukan.
                Kami bekerja langsung dengan seniman untuk memastikan kompensasi yang adil dan mendukung usaha kreatif mereka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Nilai-Nilai Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Creativity */}
            <div className="bg-white rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Kreativitas Utama</h3>
              <p className="text-muted-foreground">
                Kami merayakan ekspresi artistik dan mendukung kreator dari semua latar belakang.
              </p>
            </div>

            {/* Quality */}
            <div className="bg-white rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Kualitas Premium</h3>
              <p className="text-muted-foreground">
                Setiap stiker diproduksi dengan perhatian terhadap detail dan daya tahan.
              </p>
            </div>

            {/* Community */}
            <div className="bg-white rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Komunitas</h3>
              <p className="text-muted-foreground">
                Kami membangun komunitas yang ramah di mana kreativitas berkembang dan ide-ide tumbuh subur.
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-white rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Inovasi</h3>
              <p className="text-muted-foreground">
                Kami terus meningkatkan platform kami untuk melayani pelanggan dengan lebih baik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Kenal Tim Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'Pendiri & CEO',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
              },
              {
                name: 'Marcus Johnson',
                role: 'Kepala Desain',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
              },
              {
                name: 'Elena Rodriguez',
                role: 'Manajer Komunitas',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
              },
            ].map(member => (
              <div key={member.name} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary/20"
                />
                <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <p className="text-lg opacity-90">Pelanggan Puas</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5000+</div>
              <p className="text-lg opacity-90">Stiker Unik</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-lg opacity-90">Mitra Seniman</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1M+</div>
              <p className="text-lg opacity-90">Pesanan Dikirim</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl font-bold text-foreground mb-6">Hubungi Kami</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ada pertanyaan? Kami ingin mendengar dari Anda. Hubungi tim kami kapan saja.
          </p>

          <div className="space-y-4">
            <p className="text-foreground">
              <span className="font-semibold">Email:</span> hello@indoglobalprint.com
            </p>
            <p className="text-foreground">
              <span className="font-semibold">Telepon:</span> +62 (123) 456-7890
            </p>
            <p className="text-foreground">
              <span className="font-semibold">Alamat:</span> Jl. Kreatif No. 123, Jakarta, Indonesia 12345
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/shop"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Mulai Belanja
            </Link>
            <button className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm opacity-75">
          <p>&copy; 2024 IndoGlobalPrint. Semua hak dilindungi. Dibuat dengan passion untuk para kreator.</p>
        </div>
      </footer>
    </div>
  );
}
