
import { useQuery } from "@tanstack/react-query";
import { fetchAllBusinessFeedback, fetchPublicDrivers, fetchDriverRatings } from "@/services/driverService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Star, User, Utensils, Zap, Heart, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FeedbackManager = () => {
  const { data: feedback, isLoading: isLoadingFeedback } = useQuery({
    queryKey: ['adminFeedback'],
    queryFn: fetchAllBusinessFeedback
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className={`h-3 w-3 ${s <= rating ? 'text-yellow-500 fill-current' : 'text-gray-200'}`} />
        ))}
      </div>
    );
  };

  if (isLoadingFeedback) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-emerald-600" />
            Business Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Ratings (F/S/C/O)</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedback?.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      {f.user_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between w-32">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Food</span>
                        {renderStars(f.food_rating || 0)}
                      </div>
                      <div className="flex items-center justify-between w-32">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Service</span>
                        {renderStars(f.service_rating || 0)}
                      </div>
                      <div className="flex items-center justify-between w-32">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Charge</span>
                        {renderStars(f.charging_rating || 0)}
                      </div>
                      <div className="flex items-center justify-between w-32 border-t pt-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-600">Overall</span>
                        {renderStars(f.overall_rating)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm italic text-gray-600">{f.comment || "No comment"}</p>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(f.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackManager;
