
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { fetchPublicDriverById, fetchDriverRatings, rateDriver } from "@/services/driverService";
import Navigation from "@/components/common/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  ArrowLeft,
  Car,
  Phone,
  User,
  MapPin,
  Star,
  MessageSquare,
  LogIn
} from "lucide-react";
import { useState, useEffect } from "react";

const SupportPartnerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: driver, isLoading: isLoadingDriver, error: driverError } = useQuery({
    queryKey: ['publicDriver', id],
    queryFn: () => fetchPublicDriverById(id!),
    enabled: !!id
  });

  const { data: ratings, isLoading: isLoadingRatings } = useQuery({
    queryKey: ['driverRatings', id],
    queryFn: () => fetchDriverRatings(id!),
    enabled: !!id
  });

  const ratingMutation = useMutation({
    mutationFn: rateDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverRatings', id] });
      toast({ title: "Success", description: "Thank you for your rating!" });
      setComment("");
      setRating(5);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleRate = async () => {
    if (!user) {
      toast({ title: "Authentication required", description: "Please login with Google to rate this driver." });
      return;
    }

    setIsSubmitting(true);
    try {
      await ratingMutation.mutateAsync({
        driver_id: id!,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        rating,
        comment
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href
      }
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const getTierColor = (tier: string | null) => {
    switch (tier) {
      case 'platinum': return 'bg-slate-300 text-slate-900 border-slate-400';
      case 'gold': return 'bg-yellow-400 text-yellow-950 border-yellow-500';
      case 'silver': return 'bg-gray-300 text-gray-800 border-gray-400';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  if (isLoadingDriver) {
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

  if (driverError || !driver) {
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

  const averageRating = ratings && ratings.length > 0
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : "No ratings yet";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-emerald-700">
        {driver.cover_photo_url ? (
          <img src={driver.cover_photo_url} className="w-full h-full object-cover" alt="Cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-blue-600 opacity-50" />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 left-0 right-0 z-50">
          <Navigation currentPage="/support-partners" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Driver Info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-800">
              <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-700 ring-4 ring-white dark:ring-gray-800">
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
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {driver.full_name}
                  </h1>
                  <div className="flex items-center text-yellow-500 font-bold">
                    <Star className="h-5 w-5 fill-current mr-1" />
                    <span>{averageRating}</span>
                  </div>
                </div>

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
                      <p className="font-medium">{driver.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating Form */}
            <Card className="mt-8 border-none shadow-xl bg-white dark:bg-gray-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Rate this Driver</h3>
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-4">Please login with Google to provide a rating.</p>
                  <Button onClick={loginWithGoogle} className="w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login with Google
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-8 w-8 cursor-pointer transition-colors ${s <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        onClick={() => setRating(s)}
                      />
                    ))}
                  </div>
                  <Textarea
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button onClick={handleRate} className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Rating"}
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Description, Gallery & Ratings */}
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

            {/* Ratings List */}
            <Card className="border-none shadow-xl bg-white dark:bg-gray-800 p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-emerald-600" />
                Partner Ratings ({ratings?.length || 0})
              </h2>

              <div className="space-y-6">
                {ratings && ratings.length > 0 ? (
                  ratings.map((r) => (
                    <div key={r.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold mr-3">
                            {r.user_name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{r.user_name}</p>
                            <p className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`h-4 w-4 ${s <= r.rating ? 'text-yellow-500 fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">"{r.comment}"</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No ratings yet. Be the first to rate!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPartnerDetail;
