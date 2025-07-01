
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Phone, Mail, User, Building, Upload, X } from 'lucide-react';
import { uploadFile } from '@/services/contentService';

interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  is_active: boolean;
  display_order: number;
  photo_url?: string;
}

const ContactsManager = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    department: '',
    display_order: 0,
    photo_url: ''
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const photoUrl = await uploadFile(file, 'contacts');
      setFormData(prev => ({ ...prev, photo_url: photoUrl }));

      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingContact) {
        const { error } = await supabase
          .from('contacts')
          .update(formData)
          .eq('id', editingContact.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Contact updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('contacts')
          .insert(formData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Contact created successfully",
        });
      }

      setFormData({
        name: '',
        position: '',
        email: '',
        phone: '',
        department: '',
        display_order: 0,
        photo_url: ''
      });
      setEditingContact(null);
      setShowForm(false);
      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      position: contact.position,
      email: contact.email,
      phone: contact.phone,
      department: contact.department,
      display_order: contact.display_order,
      photo_url: contact.photo_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (contact: Contact) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_active: !contact.is_active })
        .eq('id', contact.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Contact ${contact.is_active ? 'deactivated' : 'activated'} successfully`,
      });
      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Contacts Management</h2>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingContact(null);
            setFormData({
              name: '',
              position: '',
              email: '',
              phone: '',
              department: '',
              display_order: contacts.length,
              photo_url: ''
            });
          }}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">{editingContact ? 'Edit Contact' : 'Add New Contact'}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
                <div>
                  <Label htmlFor="photo">Photo</Label>
                  <div className="space-y-4">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                    />
                    
                    <div>
                      <Label htmlFor="photo_url">Or enter photo URL</Label>
                      <Input
                        id="photo_url"
                        value={formData.photo_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, photo_url: e.target.value }))}
                        placeholder="Enter photo URL"
                      />
                    </div>
                  
                  {uploadingPhoto && (
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 animate-spin" />
                      <span>Uploading photo...</span>
                    </div>
                  )}
                  
                  {formData.photo_url && (
                    <div className="relative inline-block">
                      <img 
                        src={formData.photo_url} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="absolute -top-2 -right-2"
                        onClick={() => setFormData(prev => ({ ...prev, photo_url: '' }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" disabled={loading || uploadingPhoto}>
                  {editingContact ? 'Update' : 'Create'} Contact
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingContact(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {contacts.map((contact) => (
          <Card key={contact.id} className={`${!contact.is_active ? 'opacity-50' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {contact.photo_url ? (
                    <img 
                      src={contact.photo_url} 
                      alt={contact.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  ) : (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base md:text-lg truncate">{contact.name}</CardTitle>
                    {contact.position && (
                      <p className="text-sm text-gray-600 mt-1 truncate">{contact.position}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(contact)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {contact.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.department && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span className="truncate">{contact.department}</span>
                </div>
              )}
              <div className="pt-2">
                <Button
                  size="sm"
                  variant={contact.is_active ? "destructive" : "default"}
                  onClick={() => toggleStatus(contact)}
                  className="w-full"
                >
                  {contact.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContactsManager;
