import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Star, Plus, Edit, Trash2, Quote } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { 
  getTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  type Testimonial 
} from '@/services/contentService';

const TestimonialManager = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_title: '',
    customer_email: '',
    content: '',
    rating: 5,
    is_active: true,
    display_order: 0,
  });
  const [formErrors, setFormErrors] = useState({
    customer_name: '',
    customer_email: '',
    content: '',
    display_order: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = { customer_name: '', customer_email: '', content: '', display_order: '' };
    let isValid = true;

    if (!formData.customer_name.trim()) {
      errors.customer_name = 'Customer name is required.';
      isValid = false;
    } else if (formData.customer_name.trim().length > 100) {
      errors.customer_name = 'Customer name must be 100 characters or less.';
      isValid = false;
    }

    if (!formData.content.trim()) {
      errors.content = 'Testimonial content is required.';
      isValid = false;
    } else if (formData.content.trim().length < 10) {
      errors.content = 'Content must be at least 10 characters long.';
      isValid = false;
    } else if (formData.content.trim().length > 1000) {
      errors.content = 'Content must be 1000 characters or less.';
      isValid = false;
    }

    if (formData.customer_email.trim() && !/^\S+@\S+\.\S+$/.test(formData.customer_email.trim())) {
      errors.customer_email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (formData.display_order < 0) {
        errors.display_order = 'Display order must be a non-negative number.';
        isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    try {
      const testimonialData = {
        customer_name: formData.customer_name.trim(),
        customer_title: formData.customer_title?.trim() || null,
        customer_email: formData.customer_email?.trim() || null,
        content: formData.content.trim(),
        rating: formData.rating,
        is_active: formData.is_active,
        display_order: formData.display_order,
      };

      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, testimonialData);
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        await createTestimonial(testimonialData);
        toast({
          title: "Success",
          description: "Testimonial created successfully",
        });
      }

      await loadData();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customer_name: testimonial.customer_name,
      customer_title: testimonial.customer_title || '',
      customer_email: testimonial.customer_email || '',
      content: testimonial.content,
      rating: testimonial.rating,
      is_active: testimonial.is_active || true,
      display_order: testimonial.display_order || 0
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await deleteTestimonial(id);
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      await loadData();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_title: '',
      customer_email: '',
      content: '',
      rating: 5,
      is_active: true,
      display_order: 0
    });
    setEditingTestimonial(null);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-900">Testimonial Management</h2>
        <LoadingSpinner fullPage={false} text="Loading testimonials..." size={32} />
      </div>
    );
  }

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Testimonial Management</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
              <DialogDescription>
                {editingTestimonial ? 'Update the testimonial details' : 'Add a new customer testimonial'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                    placeholder="Customer name"
                  />
                  {formErrors.customer_name && <p className="text-sm text-red-500 mt-1">{formErrors.customer_name}</p>}
                </div>
                <div>
                  <Label htmlFor="customer_title">Customer Title</Label>
                  <Input
                    id="customer_title"
                    value={formData.customer_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_title: e.target.value }))}
                    placeholder="Job title or company"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customer_email">Customer Email</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                  placeholder="customer@example.com"
                />
                {formErrors.customer_email && <p className="text-sm text-red-500 mt-1">{formErrors.customer_email}</p>}
              </div>

              <div>
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Customer testimonial content"
                  rows={4}
                />
                {formErrors.content && <p className="text-sm text-red-500 mt-1">{formErrors.content}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2 pt-6"> {/* Adjusted pt for alignment */}
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                  {formErrors.display_order && <p className="text-sm text-red-500 mt-1">{formErrors.display_order}</p>}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setFormErrors({ customer_name: '', customer_email: '', content: '', display_order: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Quote className="h-5 w-5 mr-2 text-emerald-600" />
            Testimonials ({testimonials.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testimonials.length === 0 && !loading ? (
            <EmptyState
              icon={<Quote />}
              title="No Testimonials Yet"
              description="Share what your customers are saying! Add your first testimonial."
              className="my-8"
              ctaButton={{
                text: 'Add Testimonial',
                onClick: openAddDialog,
                icon: <Plus />,
                buttonClassName: "bg-emerald-500 hover:bg-emerald-600"
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{testimonial.customer_name}</h3>
                          <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                            {testimonial.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        {testimonial.customer_title && (
                          <p className="text-sm text-gray-600 mb-2">{testimonial.customer_title}</p>
                        )}
                        <div className="flex items-center space-x-1 mb-3">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-4">
                        <Button
                          onClick={() => handleEdit(testimonial)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(testimonial.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <blockquote className="text-gray-700 italic border-l-4 border-emerald-500 pl-4 mb-4">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Order: {testimonial.display_order}</span>
                      <span>{new Date(testimonial.created_at).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialManager;