import { Header } from '@/components/Header';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
    website: user?.website || '',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Please log in to edit your profile</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setIsSaving(true);

    // Validate
    if (!formData.name || !formData.email) {
      alert('Name and email are required');
      setIsSaving(false);
      return;
    }

    // Simulate save
    setTimeout(() => {
      updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
        website: formData.website,
      });

      setIsSaving(false);
      setSuccessMessage('Profile updated successfully!');
      
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Profile
        </button>

        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">Update your personal information</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <p className="text-green-700 font-semibold">✓ {successMessage}</p>
          </div>
        )}

        <div className="max-w-2xl">
          {/* Avatar Section */}
          <div className="bg-muted/30 rounded-2xl p-8 border border-border mb-8">
            <div className="flex items-center gap-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{user.name}</h3>
                <p className="text-muted-foreground mb-4">Member since {user.joinDate}</p>
                <button className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-semibold text-sm">
                  Change Avatar
                </button>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  Full Name
                </div>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-2">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Phone Number
                </div>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Address
                </div>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, San Francisco, CA 94102"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Website
                </div>
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Bio
                </div>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formData.bio.length}/200 characters
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="mt-12 p-6 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-bold text-red-700 mb-4">Danger Zone</h3>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
              Delete Account
            </button>
            <p className="text-sm text-red-600 mt-2">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
