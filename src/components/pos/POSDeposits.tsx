
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getPosDeposits } from '@/services/posService';
import { TrendingUp } from 'lucide-react';

interface POSDepositsProps {
  user: any;
}

const POSDeposits = ({ user }: POSDepositsProps) => {
  const { toast } = useToast();
  const [deposits, setDeposits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getPosDeposits();
      setDeposits(data);
    } catch (error) {
      console.error('Error loading deposits:', error);
      toast({
        title: "Error",
        description: "Failed to load deposits",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading deposits...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <TrendingUp className="h-6 w-6 mr-2" />
          Deposits
        </h2>
        <Button>Add Deposit</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deposits.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No deposits found</p>
            ) : (
              deposits.map(deposit => (
                <div key={deposit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{deposit.description || 'Deposit'}</p>
                    <p className="text-sm text-gray-600">{deposit.deposit_method}</p>
                    <p className="text-sm text-gray-600">{deposit.deposit_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">Rs. {deposit.amount}</p>
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

export default POSDeposits;
