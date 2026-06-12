
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerDriver, uploadDriverAsset } from "@/services/driverService";
import Navigation from "@/components/common/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Car, Phone, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  vehicle_number: z.string().min(4, "Vehicle number is required"),
  description: z.string().optional(),
  is_public: z.boolean().default(false),
});

const DriverRegistration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [driverPhoto, setDriverPhoto] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [additionalVehiclePhotos, setAdditionalVehiclePhotos] = useState<File[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_public: false,
    }
  });

  const isPublic = watch("is_public");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let driverPhotoUrl = "";
      let coverPhotoUrl = "";
      let vehiclePhotoUrl = "";
      const vehiclePhotoUrls: string[] = [];

      if (driverPhoto) {
        const path = `drivers/profile/${Date.now()}_${driverPhoto.name}`;
        driverPhotoUrl = await uploadDriverAsset(driverPhoto, path);
      }

      if (coverPhoto) {
        const path = `drivers/cover/${Date.now()}_${coverPhoto.name}`;
        coverPhotoUrl = await uploadDriverAsset(coverPhoto, path);
      }

      if (vehiclePhoto) {
        const path = `vehicles/${Date.now()}_${vehiclePhoto.name}`;
        vehiclePhotoUrl = await uploadDriverAsset(vehiclePhoto, path);
      }

      for (const file of additionalVehiclePhotos) {
        const path = `vehicles/gallery/${Date.now()}_${file.name}`;
        const url = await uploadDriverAsset(file, path);
        vehiclePhotoUrls.push(url);
      }

      await registerDriver({
        ...values,
        driver_photo_url: driverPhotoUrl,
        cover_photo_url: coverPhotoUrl,
        vehicle_photo_url: vehiclePhotoUrl,
        vehicle_photo_urls: vehiclePhotoUrls,
        status: 'pending',
        tier: 'none',
        visit_count: 0,
        total_sales_amount: 0
      });

      toast({
        title: "Registration Successful",
        description: "Your profile has been submitted for approval. We will contact you soon.",
      });
      navigate("/support-partners");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-emerald-600 pb-20">
        <Navigation currentPage="/driver-registration" />
        <div className="max-w-7xl mx-auto px-6 pt-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Community</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Register as a Support Partner and start earning commissions and exclusive rewards!
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-12 mb-20">
        <Card className="shadow-xl border-none">
          <CardHeader>
            <CardTitle>Driver Registration</CardTitle>
            <CardDescription>Fill in your details to apply for the Energy Palace Driver Loyalty Program.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="full_name" className="pl-10" placeholder="John Doe" {...register("full_name")} />
                </div>
                {errors.full_name && <p className="text-sm text-red-500">{errors.full_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="phone" className="pl-10" placeholder="98XXXXXXXX" {...register("phone")} />
                </div>
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_number">Vehicle Number</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input id="vehicle_number" className="pl-10" placeholder="BA 1 PA 1234" {...register("vehicle_number")} />
                </div>
                {errors.vehicle_number && <p className="text-sm text-red-500">{errors.vehicle_number.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (e.g. your regular routes)</Label>
                <Textarea
                  id="description"
                  placeholder="I drive primarily from Sindhuli to Kathmandu..."
                  className="min-h-[100px]"
                  {...register("description")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors relative">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => setDriverPhoto(e.target.files?.[0] || null)}
                    />
                    {driverPhoto ? (
                      <p className="text-sm text-emerald-600 font-medium truncate">{driverPhoto.name}</p>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Upload Photo</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cover Photo</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors relative">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => setCoverPhoto(e.target.files?.[0] || null)}
                    />
                    {coverPhoto ? (
                      <p className="text-sm text-emerald-600 font-medium truncate">{coverPhoto.name}</p>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Upload Cover</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Main Vehicle Photo</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors relative">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => setVehiclePhoto(e.target.files?.[0] || null)}
                    />
                    {vehiclePhoto ? (
                      <p className="text-sm text-emerald-600 font-medium truncate">{vehiclePhoto.name}</p>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Upload Photo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Additional Vehicle Photos (Gallery)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {additionalVehiclePhotos.map((file, index) => (
                    <div key={index} className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setAdditionalVehiclePhotos(prev => prev.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center aspect-video hover:bg-gray-50 cursor-pointer transition-colors relative">
                    <input
                      type="file"
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setAdditionalVehiclePhotos(prev => [...prev, ...files]);
                      }}
                    />
                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Add More</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                <Checkbox
                  id="is_public"
                  checked={isPublic}
                  onCheckedChange={(checked) => setValue("is_public", checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="is_public" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I consent to display my name, vehicle number, and photos on the Community Page.
                  </Label>
                  <p className="text-xs text-emerald-600/80">
                    Your phone number will be partially masked for privacy.
                  </p>
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Registering...
                  </>
                ) : "Register Now"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverRegistration;
