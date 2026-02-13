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
            <h1 className="text-5xl font-bold text-foreground mb-6">About Sticker Shop</h1>
            <p className="text-xl text-muted-foreground">
              We're on a mission to bring creativity, self-expression, and joy to sticker lovers everywhere.
              Founded in 2023, Sticker Shop has become a community platform for artists and enthusiasts.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-foreground mb-8">Our Story</h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>
                Sticker Shop started as a passion project by a group of artists and designers who wanted to make
                high-quality stickers accessible to everyone. We noticed that people were looking for unique,
                creative ways to personalize their belongings - from laptops to water bottles.
              </p>
              <p>
                What began as a small collection of handpicked designs has grown into a thriving marketplace with
                thousands of unique stickers from talented artists around the world. Today, we're proud to serve
                over 50,000 happy customers who share our passion for self-expression.
              </p>
              <p>
                Our commitment to quality, creativity, and customer satisfaction remains at the heart of everything
                we do. We work directly with artists to ensure fair compensation and support their creative endeavors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Creativity */}
            <div className="bg-white rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Creativity First</h3>
              <p className="text-muted-foreground">
                We celebrate artistic expression and support creators from all backgrounds.
              </p>
            </div>

            {/* Quality */}
            <div className="bg-white rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">
                Every sticker is produced with attention to detail and durability.
              </p>
            </div>

            {/* Community */}
            <div className="bg-white rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Community</h3>
              <p className="text-muted-foreground">
                We build a welcoming community where creativity thrives and ideas flourish.
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-white rounded-2xl p-8 border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously improve our platform to serve our customers better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Meet Our Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'Founder & CEO',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
              },
              {
                name: 'Marcus Johnson',
                role: 'Head of Design',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
              },
              {
                name: 'Elena Rodriguez',
                role: 'Community Manager',
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
              <p className="text-lg opacity-90">Happy Customers</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5000+</div>
              <p className="text-lg opacity-90">Unique Stickers</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-lg opacity-90">Artist Partners</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1M+</div>
              <p className="text-lg opacity-90">Orders Shipped</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-4xl font-bold text-foreground mb-6">Get In Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions? We'd love to hear from you. Reach out to our team anytime.
          </p>

          <div className="space-y-4">
            <p className="text-foreground">
              <span className="font-semibold">Email:</span> hello@stickershop.com
            </p>
            <p className="text-foreground">
              <span className="font-semibold">Phone:</span> +1 (555) 123-4567
            </p>
            <p className="text-foreground">
              <span className="font-semibold">Address:</span> 123 Creative Ave, San Francisco, CA 94102
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/shop"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Shopping
            </Link>
            <button className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm opacity-75">
          <p>&copy; 2024 Sticker Shop. All rights reserved. Made with passion for creators.</p>
        </div>
      </footer>
    </div>
  );
}
