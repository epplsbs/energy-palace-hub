
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitBusinessFeedback } from "@/services/driverService";
import Navigation from "@/components/common/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  Star,
  Utensils,
  Settings,
  Zap,
  Heart,
  Send,
  LogIn
} from "lucide-react";

const Feedback = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userName, setUserName] = useState("");
  const [ratings, setRatings] = useState({
    food: 5,
    service: 5,
    charging: 5,
    overall: 5
  });
  const [comment, setComment] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || session.user.email || "");
      }
    });
  }, []);

  const feedbackMutation = useMutation({
    mutationFn: submitBusinessFeedback,
    onSuccess: () => {
      toast({ title: "Feedback Submitted", description: "Thank you for helping us improve Energy Palace!" });
      setComment("");
      if (!user) setUserName("");
      setRatings({ food: 5, service: 5, charging: 5, overall: 5 });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast({ title: "Name Required", description: "Please enter your name.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await feedbackMutation.mutateAsync({
        user_id: user?.id || null,
        user_name: userName,
        food_rating: ratings.food,
        service_rating: ratings.service,
        charging_rating: ratings.charging,
        overall_rating: ratings.overall,
        comment
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ label, icon: Icon, value, onChange, color }: any) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <Label className="text-sm font-semibold">{label}</Label>
      </div>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-8 w-8 cursor-pointer transition-all ${s <= value ? 'text-yellow-500 fill-current scale-110' : 'text-gray-200 hover:text-yellow-200'}`}
            onClick={() => onChange(s)}
          />
        ))}
      </div>
    </div>
  );

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-emerald-600 pb-20">
        <Navigation currentPage="/feedback" />
        <div className="max-w-7xl mx-auto px-6 pt-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Feedback Matters</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Help us improve our services at Energy Palace. We value every suggestion from our community.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-12 mb-20">
        <Card className="shadow-2xl border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Share Your Experience</CardTitle>
            <CardDescription>Tell us what you liked and what we can do better.</CardDescription>
          </CardHeader>
          <CardContent>
            {!user && (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-between">
                <p className="text-sm text-blue-700 dark:text-blue-300">Login with Google to link your profile.</p>
                <Button variant="outline" size="sm" onClick={loginWithGoogle}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Google Login
                </Button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="userName">Your Name</Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={!!user}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <StarRating
                  label="Food & Drinks"
                  icon={Utensils}
                  value={ratings.food}
                  onChange={(v: number) => setRatings({...ratings, food: v})}
                  color="text-orange-500"
                />
                <StarRating
                  label="Staff Service"
                  icon={Heart}
                  value={ratings.service}
                  onChange={(v: number) => setRatings({...ratings, service: v})}
                  color="text-red-500"
                />
                <StarRating
                  label="Charging Facility"
                  icon={Zap}
                  value={ratings.charging}
                  onChange={(v: number) => setRatings({...ratings, charging: v})}
                  color="text-emerald-500"
                />
                <StarRating
                  label="Overall Experience"
                  icon={Settings}
                  value={ratings.overall}
                  onChange={(v: number) => setRatings({...ratings, overall: v})}
                  color="text-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Additional Comments</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us more about your visit..."
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
