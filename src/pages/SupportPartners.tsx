
import { useQuery } from "@tanstack/react-query";
import { fetchPublicDrivers } from "@/services/driverService";
import Navigation from "@/components/common/Navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, User, Car, Phone, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const SupportPartners = () => {
  const { data: drivers, isLoading, error } = useQuery({
    queryKey: ['publicDrivers'],
    queryFn: fetchPublicDrivers
  });

  const getTierColor = (tier: string | null) => {
    switch (tier) {
      case 'platinum': return 'bg-slate-300 text-slate-900 border-slate-400';
      case 'gold': return 'bg-yellow-400 text-yellow-950 border-yellow-500';
      case 'silver': return 'bg-gray-300 text-gray-800 border-gray-400';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-emerald-600 pb-20">
        <Navigation currentPage="/support-partners" />
        <div className="max-w-7xl mx-auto px-6 pt-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Support Partners</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8">
            Acknowledging our supportive partners who drive the future of sustainable transportation.
          </p>
          <Link to="/driver-registration">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold px-8">
              <UserPlus className="h-5 w-5 mr-2" />
              Join as a Partner
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 mb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading our partners...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <p className="text-red-600">Failed to load community data. Please try again later.</p>
          </div>
        ) : drivers && drivers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {drivers.map((driver) => (
              <Link to={`/support-partners/${driver.id}`} key={driver.id}>
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-none bg-white dark:bg-gray-800 shadow-lg group cursor-pointer">
                  <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {driver.vehicle_photo_url ? (
                    <img
                      src={driver.vehicle_photo_url}
                      alt={`${driver.full_name}'s Vehicle`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                  {driver.tier && driver.tier !== 'none' && (
                    <Badge className={`absolute top-4 right-4 capitalize shadow-sm ${getTierColor(driver.tier)}`}>
                      {driver.tier} Chalak
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2 relative">
                  <div className="absolute -top-12 left-6 ring-4 ring-white dark:ring-gray-800 rounded-full">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={driver.driver_photo_url || ''} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-600">
                        <User className="h-10 w-10" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="pt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                      {driver.full_name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Car className="h-4 w-4 mr-1.5" />
                      {driver.vehicle_number}
                    </div>
                  </div>
                </CardHeader>

                  <CardContent>
                    <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      <Phone className="h-4 w-4 mr-1.5" />
                      {driver.masked_phone}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No partners listed yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Join our community to be featured here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPartners;
