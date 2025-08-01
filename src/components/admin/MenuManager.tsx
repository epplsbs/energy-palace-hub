import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Utensils, Plus, Edit, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import ImageUpload from '@/components/common/ImageUpload';
import { 
  getMenuCategories, 
  getMenuItems, 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  uploadFile,
  type MenuCategory, 
  type MenuItem 
} from '@/services/contentService';

const MenuManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: true,
    display_order: 0
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    price: '',
    category_id: '',
    display_order: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, itemsData] = await Promise.all([
        getMenuCategories(),
        getMenuItems()
      ]);
      setCategories(categoriesData);
      setMenuItems(itemsData);
    } catch (error) {
      console.error('Error loading menu data:', error);
      toast({
        title: "Error",
        description: "Failed to load menu data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = { name: '', price: '', category_id: '', display_order: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
      isValid = false;
    }

    if (!formData.category_id) {
      errors.category_id = 'Category is required';
      isValid = false;
    }

    if (formData.display_order < 0) {
      errors.display_order = 'Display order must be 0 or greater';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const itemData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: formData.image_url || null,
        is_available: formData.is_available,
        display_order: formData.display_order
      };

      if (editingItem) {
        await updateMenuItem(editingItem.id, itemData);
        toast({
          title: "Success",
          description: "Menu item updated successfully",
        });
      } else {
        await createMenuItem(itemData);
        toast({
          title: "Success",
          description: "Menu item added successfully",
        });
      }

      await loadData();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id || '',
      image_url: item.image_url || '',
      is_available: item.is_available || true,
      display_order: item.display_order || 0
    });
    setFormErrors({ name: '', price: '', category_id: '', display_order: '' });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await deleteMenuItem(id);
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
      await loadData();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      is_available: true,
      display_order: 0
    });
    setFormErrors({ name: '', price: '', category_id: '', display_order: '' });
    setEditingItem(null);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSpinner fullPage={false} text="Loading menu items..." size={32} iconClassName="text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Menu Management</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the menu item details' : 'Add a new item to your restaurant menu'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Item name"
                  />
                  {formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                  {formErrors.price && <p className="text-sm text-red-500 mt-1">{formErrors.price}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="category_id">Category *</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category_id && <p className="text-sm text-red-500 mt-1">{formErrors.category_id}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Item description"
                />
              </div>

              <div>
                <ImageUpload
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                  currentImageUrl={formData.image_url}
                  maxSizeKB={150}
                  bucket="menu-items"
                  folder="menu-images"
                  placeholder="Upload menu item image or enter URL (will be resized to ~150KB)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_available"
                    checked={formData.is_available}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: checked }))}
                  />
                  <Label htmlFor="is_available">Available for order</Label>
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

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setFormErrors({ name: '', price: '', category_id: '', display_order: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={uploading}>
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg md:text-xl">
            <Utensils className="h-5 w-5 mr-2 text-orange-600" />
            Menu Items ({menuItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {menuItems.length === 0 && !loading ? (
            <EmptyState
              icon={<Utensils className="h-12 w-12" />}
              title="No menu items found"
              description="Add your first menu item to get started"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {menuItems.map((item) => (
                <Card key={item.id} className="border border-gray-200 hover:border-emerald-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{getCategoryName(item.category_id || '')}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => handleEdit(item)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {item.image_url && (
                      <div className="mb-3">
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-emerald-600">NPR {Number(item.price).toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={item.is_available ? "default" : "secondary"}>
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
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

export default MenuManager;
