
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "@/services/driverService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Trophy, User, Medal } from "lucide-react";

const DriverLeaderboard = () => {
  const { data: drivers, isLoading } = useQuery({
    queryKey: ['driverLeaderboard'],
    queryFn: fetchLeaderboard
  });

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-slate-400" />;
      case 2: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="font-bold text-gray-400">{index + 1}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900">Driver Leaderboard</h2>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead className="text-right">Total Sales (Rs.)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers?.map((driver, index) => (
              <TableRow key={driver.id} className={index < 3 ? 'bg-emerald-50/30' : ''}>
                <TableCell className="text-center">{getRankIcon(index)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={driver.driver_photo_url || ''} />
                      <AvatarFallback><User className="h-6 w-6 text-gray-400" /></AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{driver.full_name}</span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{driver.tier}</TableCell>
                <TableCell>{driver.visit_count}</TableCell>
                <TableCell className="text-right font-bold text-emerald-600">
                  {driver.total_sales_amount?.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DriverLeaderboard;
