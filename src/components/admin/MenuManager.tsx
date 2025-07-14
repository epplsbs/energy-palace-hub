import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Utensils,
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Loader2,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  DollarSign,
  TrendingUp,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ChefHat,
} from "lucide-react";
import {
  getMenuCategories,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadFile,
  type MenuCategory,
  type MenuItem,
} from "@/services/contentService";

const MenuManager = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
    is_available: true,
    display_order: 0,
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    price: "",
    category_id: "",
    display_order: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [menuItems, searchQuery, selectedCategory, selectedStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, itemsData] = await Promise.all([
        getMenuCategories(),
        getMenuItems(),
      ]);
      setCategories(categoriesData || []);
      setMenuItems(itemsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load menu data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = menuItems;

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.category_id === selectedCategory,
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((item) =>
        selectedStatus === "available" ? item.is_available : !item.is_available,
      );
    }

    setFilteredItems(filtered);
  };

  const validateForm = () => {
    const errors = {
      name: "",
      price: "",
      category_id: "",
      display_order: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (
      !formData.price ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      errors.price = "Valid price is required";
    }

    if (!formData.category_id) {
      errors.category_id = "Category is required";
    }

    if (
      isNaN(Number(formData.display_order)) ||
      Number(formData.display_order) < 0
    ) {
      errors.display_order = "Valid display order is required";
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const itemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category_id: formData.category_id,
        image_url: formData.image_url,
        is_available: formData.is_available,
        display_order: Number(formData.display_order),
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
          description: "Menu item created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving menu item:", error);
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
      description: item.description || "",
      price: item.price.toString(),
      category_id: item.category_id || "",
      image_url: item.image_url || "",
      is_available: item.is_available,
      display_order: item.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      await deleteMenuItem(item.id);
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadFile(file, "menu-images");
      setFormData((prev) => ({ ...prev, image_url: imageUrl }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      image_url: "",
      is_available: true,
      display_order: 0,
    });
    setFormErrors({
      name: "",
      price: "",
      category_id: "",
      display_order: "",
    });
    setEditingItem(null);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const stats = {
    total: menuItems.length,
    available: menuItems.filter((item) => item.is_available).length,
    unavailable: menuItems.filter((item) => !item.is_available).length,
    avgPrice:
      menuItems.length > 0
        ? menuItems.reduce((sum, item) => sum + item.price, 0) /
          menuItems.length
        : 0,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Utensils className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.available}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unavailable</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.unavailable}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <EyeOff className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                <p className="text-2xl font-bold text-purple-600">
                  NPR {stats.avgPrice.toFixed(0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header and Controls */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ChefHat className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Menu Management
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Manage your restaurant menu items
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={resetForm}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5 text-emerald-600" />
                    <span>
                      {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                    </span>
                  </DialogTitle>
                  <DialogDescription>
                    {editingItem
                      ? "Update the menu item details below."
                      : "Fill in the details to add a new menu item."}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Item Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g., Dal Bhat Set"
                        className={formErrors.name ? "border-red-500" : ""}
                      />
                      {formErrors.name && (
                        <p className="text-sm text-red-500 mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="price">Price (NPR) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        placeholder="0.00"
                        className={formErrors.price ? "border-red-500" : ""}
                      />
                      {formErrors.price && (
                        <p className="text-sm text-red-500 mt-1">
                          {formErrors.price}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe your menu item..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category_id}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            category_id: value,
                          }))
                        }
                      >
                        <SelectTrigger
                          className={
                            formErrors.category_id ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.category_id && (
                        <p className="text-sm text-red-500 mt-1">
                          {formErrors.category_id}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="display_order">Display Order *</Label>
                      <Input
                        id="display_order"
                        type="number"
                        min="0"
                        value={formData.display_order}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            display_order: Number(e.target.value),
                          }))
                        }
                        className={
                          formErrors.display_order ? "border-red-500" : ""
                        }
                      />
                      {formErrors.display_order && (
                        <p className="text-sm text-red-500 mt-1">
                          {formErrors.display_order}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image">Item Image</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {uploading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {uploading ? "Uploading..." : "Upload Image"}
                      </label>
                      {formData.image_url && (
                        <div className="relative">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                image_url: "",
                              }))
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label
                        htmlFor="is_available"
                        className="text-sm font-medium"
                      >
                        Available for Order
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Toggle to make this item available to customers
                      </p>
                    </div>
                    <Switch
                      id="is_available"
                      checked={formData.is_available}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_available: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                    >
                      {editingItem ? "Update Item" : "Add Item"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border border-gray-200 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No menu items found
              </h3>
              <p className="text-gray-500">
                {searchQuery ||
                selectedCategory !== "all" ||
                selectedStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first menu item to get started"}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="border-0 shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            item.is_available ? "default" : "destructive"
                          }
                        >
                          {item.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {item.name}
                        </h3>
                        <span className="text-lg font-bold text-emerald-600">
                          NPR {item.price}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description || "No description available"}
                      </p>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryName(item.category_id || "")}
                        </Badge>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description || "No description available"}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {getCategoryName(item.category_id || "")}
                              </Badge>
                              <Badge
                                variant={
                                  item.is_available ? "default" : "destructive"
                                }
                                className="text-xs"
                              >
                                {item.is_available
                                  ? "Available"
                                  : "Unavailable"}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-lg font-bold text-emerald-600">
                              NPR {item.price}
                            </span>
                            <div className="flex space-x-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(item)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
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
