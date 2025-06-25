
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getPosExpenses } from '@/services/posService';
import { TrendingDown } from 'lucide-react';

interface POSExpensesProps {
  user: any;
}

const POSExpenses = ({ user }: POSExpensesProps) => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getPosExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading expenses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <TrendingDown className="h-6 w-6 mr-2" />
          Expenses
        </h2>
        <Button>Add Expense</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No expenses found</p>
            ) : (
              expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-gray-600">{expense.category}</p>
                    <p className="text-sm text-gray-600">{expense.expense_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">Rs. {expense.amount}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default POSExpenses;
