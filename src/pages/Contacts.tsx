
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getContacts } from '@/services/contentService';
import { Phone, Mail, MapPin, Clock, User, Building, Zap } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  is_active: boolean;
  display_order: number;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await getContacts();
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-futuristic flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-futuristic relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      {/* Header */}
      <header className="relative z-20 p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 neon-glow-green">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Energy Palace
              </h1>
              <p className="text-sm text-white/60">Contact Information</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-white/80">
            <a href="/" className="hover:text-emerald-400 transition-colors">Home</a>
            <a href="/blog" className="hover:text-emerald-400 transition-colors">Blog</a>
            <a href="/admin" className="hover:text-emerald-400 transition-colors">Admin</a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Connect with our team for reservations, support, or any inquiries about our premium EV charging and dining services.
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* General Information */}
          <Card className="glass border border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <MapPin className="h-6 w-6 text-emerald-400" />
                Visit Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-white/80">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-semibold">Energy Palace</p>
                  <p>Kathmandu, Nepal</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-semibold">Main Line</p>
                  <p>+977-1-4567890</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="font-semibold">General Inquiries</p>
                  <p>info@energypalace.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="font-semibold">Operating Hours</p>
                  <p>24/7 Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="glass border border-white/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3">
                <Zap className="h-6 w-6 text-emerald-400" />
                Emergency Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-white/80">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-semibold">24/7 Emergency</p>
                  <p>+977-1-4567899</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-semibold">Emergency Email</p>
                  <p>emergency@energypalace.com</p>
                </div>
              </div>
              
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-300">
                  For charging station emergencies or technical issues, contact our emergency support immediately.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Contacts */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Our Team
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <Card key={contact.id} className="glass border border-white/20 backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
                      <User className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">{contact.name}</CardTitle>
                      {contact.position && (
                        <p className="text-sm text-white/60">{contact.position}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contact.email && (
                    <div className="flex items-center gap-3 text-white/80">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-3 text-white/80">
                      <Phone className="h-4 w-4 text-green-400" />
                      <span className="text-sm">{contact.phone}</span>
                    </div>
                  )}
                  {contact.department && (
                    <div className="flex items-center gap-3 text-white/80">
                      <Building className="h-4 w-4 text-purple-400" />
                      <span className="text-sm">{contact.department}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Quick Actions</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              Book Charging Station
            </a>
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              View Menu
            </a>
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
            >
              Make Reservation
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacts;
