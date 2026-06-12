
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchPublicDriverById } from "@/services/driverService";
import Navigation from "@/components/common/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Car, Phone, User, MapPin } from "lucide-react";

const SupportPartnerDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: driver, isLoading, error } = useQuery({
    queryKey: ['publicDriver', id],
    queryFn: () => fetchPublicDriverById(id!),
    enabled: !!id
  });

  const getTierColor = (tier: string | null) => {
    switch (tier) {
      case 'platinum': return 'bg-slate-300 text-slate-900 border-slate-400';
      case 'gold': return 'bg-yellow-400 text-yellow-950 border-yellow-500';
      case 'silver': return 'bg-gray-300 text-gray-800 border-gray-400';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation currentPage="/support-partners" />
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading partner profile...</p>
        </div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation currentPage="/support-partners" />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Partner not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The partner profile you're looking for doesn't exist or is no longer public.</p>
          <Link to="/support-partners">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Partners
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const allVehiclePhotos = [
    ...(driver.vehicle_photo_url ? [driver.vehicle_photo_url] : []),
    ...(driver.vehicle_photo_urls || [])
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-emerald-600 pb-32">
        <Navigation currentPage="/support-partners" />
        <div className="max-w-7xl mx-auto px-6 pt-10">
          <Link to="/support-partners" className="inline-flex items-center text-emerald-100 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Partners
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Driver Info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-none shadow-xl bg-white dark:bg-gray-800">
              <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700">
                {driver.driver_photo_url ? (
                  <img
                    src={driver.driver_photo_url}
                    alt={driver.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-24 w-24 text-gray-300" />
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {driver.full_name}
                </h1>

                {driver.tier && driver.tier !== 'none' && (
                  <Badge className={`mb-4 capitalize ${getTierColor(driver.tier)}`}>
                    {driver.tier} Chalak
                  </Badge>
                )}

                <div className="space-y-4 mt-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Car className="h-5 w-5 mr-3 text-emerald-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Vehicle Number</p>
                      <p className="font-medium">{driver.vehicle_number}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Phone className="h-5 w-5 mr-3 text-emerald-600" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Contact</p>
                      <p className="font-medium">{driver.masked_phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Description & Gallery */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl bg-white dark:bg-gray-800 p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                About this Partner
              </h2>
              <div className="prose prose-emerald dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {driver.description || "This supportive partner frequently visits Energy Palace for EV charging and hospitality services. They are part of our community committed to sustainable transportation."}
                </p>
              </div>
            </Card>

            <Card className="border-none shadow-xl bg-white dark:bg-gray-800 p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Car className="h-5 w-5 mr-2 text-emerald-600" />
                Vehicle Gallery
              </h2>

              {allVehiclePhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {allVehiclePhotos.map((photo, index) => (
                    <div key={index} className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 group cursor-pointer">
                      <img
                        src={photo}
                        alt={`${driver.full_name}'s vehicle ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onClick={() => window.open(photo, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <Car className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No vehicle photos shared yet.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPartnerDetail;
