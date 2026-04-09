import { useState } from 'react';
import { Headphones, X, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function CustomerServiceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast({
        title: 'Pesan kosong',
        description: 'Silakan masukkan pesan Anda',
        variant: 'destructive',
      });
      return;
    }

    if (email && !email.includes('@')) {
      toast({
        title: 'Email tidak valid',
        description: 'Silakan masukkan email yang valid',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Pesan terkirim',
        description: 'Terima kasih! Tim customer service kami akan segera merespon Anda.',
        variant: 'default',
      });

      setMessage('');
      setEmail('');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Gagal mengirim pesan',
        description: 'Terjadi kesalahan, silakan coba lagi',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-muted rounded-lg transition-colors flex items-center gap-2 relative group"
        title="Hubungi Customer Service"
      >
        <Headphones className="w-5 h-5 text-foreground" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Customer Service
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Headphones className="w-6 h-6" />
                <div>
                  <h2 className="font-bold text-lg">Customer Service</h2>
                  <p className="text-xs opacity-90">Kami siap membantu Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Info Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  Hubungi kami dengan pertanyaan apapun. Tim customer service kami akan merespons secepatnya.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email <span className="text-gray-400">(Opsional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground text-sm"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Pesan
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Masukkan pesan Anda di sini..."
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {message.length}/500 karakter
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </form>

              {/* Contact Info */}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-gray-500 mb-2">Atau hubungi kami langsung:</p>
                <div className="space-y-1 text-sm">
                  <p className="text-foreground">
                    📧 <a href="mailto:hello@indoglobalprint.com" className="text-primary hover:underline">
                      hello@indoglobalprint.com
                    </a>
                  </p>
                  <p className="text-foreground">
                    💬 WhatsApp: <a href="https://wa.me/62812345678" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      +62 812-345-678
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
