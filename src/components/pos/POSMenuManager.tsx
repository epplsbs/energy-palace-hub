
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getPosMenuItems, getPosMenuCategories } from '@/services/posService';
import { Menu } from 'lucide-react';

interface POSMenuManagerProps {
  user: any;
}

const POSMenuManager = ({ user }: POSMenuManagerProps) => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsData, categoriesData] = await Promise.all([
        getPosMenuItems(),
        getPosMenuCategories()
      ]);
      setMenuItems(itemsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading menu data:', error);
      toast({
        title: "Error",
        description: "Failed to load menu data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading menu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Menu className="h-6 w-6 mr-2" />
          Menu Management
        </h2>
        <Button>Add Item</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-lg font-bold text-emerald-600">Rs. {item.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default POSMenuManager;
