
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllDrivers, updateDriverStatus, updateDriver, type Driver, registerDriver, uploadDriverAsset } from "@/services/driverService";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, User, Car, Plus, Edit, Upload, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const DriverManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Partial<Driver> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [driverPhoto, setDriverPhoto] = useState<File | null>(null);
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [additionalPhotos, setAdditionalPhotos] = useState<File[]>([]);

  const { data: drivers, isLoading } = useQuery({
    queryKey: ['adminDrivers'],
    queryFn: fetchAllDrivers
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'approved' | 'rejected' }) =>
      updateDriverStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDrivers'] });
      queryClient.invalidateQueries({ queryKey: ['publicDrivers'] });
      toast({ title: "Success", description: "Driver status updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update driver status.", variant: "destructive" });
    }
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved': return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Approved</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  const handleSaveDriver = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      let driver_photo_url = editingDriver?.driver_photo_url || "";
      let vehicle_photo_url = editingDriver?.vehicle_photo_url || "";
      const vehicle_photo_urls = [...(editingDriver?.vehicle_photo_urls || [])];

      if (driverPhoto) {
        driver_photo_url = await uploadDriverAsset(driverPhoto, `drivers/${Date.now()}_${driverPhoto.name}`);
      }
      if (vehiclePhoto) {
        vehicle_photo_url = await uploadDriverAsset(vehiclePhoto, `vehicles/${Date.now()}_${vehiclePhoto.name}`);
      }
      for (const file of additionalPhotos) {
        const url = await uploadDriverAsset(file, `vehicles/gallery/${Date.now()}_${file.name}`);
        vehicle_photo_urls.push(url);
      }

      const driverData = {
        full_name: formData.get("full_name") as string,
        phone: formData.get("phone") as string,
        vehicle_number: formData.get("vehicle_number") as string,
        description: formData.get("description") as string,
        is_public: formData.get("is_public") === "on",
        driver_photo_url,
        vehicle_photo_url,
        vehicle_photo_urls,
        status: editingDriver?.status || 'approved'
      };

      if (editingDriver?.id) {
        await updateDriver(editingDriver.id, driverData as any);
      } else {
        await registerDriver(driverData as any);
      }

      queryClient.invalidateQueries({ queryKey: ['adminDrivers'] });
      setIsDialogOpen(false);
      setEditingDriver(null);
      setDriverPhoto(null);
      setVehiclePhoto(null);
      setAdditionalPhotos([]);
      toast({ title: "Success", description: "Driver saved successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Driver Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingDriver(null);
            setDriverPhoto(null);
            setVehiclePhoto(null);
            setAdditionalPhotos([]);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDriver ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveDriver} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" name="full_name" defaultValue={editingDriver?.full_name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" defaultValue={editingDriver?.phone} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_number">Vehicle Number</Label>
                <Input id="vehicle_number" name="vehicle_number" defaultValue={editingDriver?.vehicle_number} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Route Details)</Label>
                <Textarea id="description" name="description" defaultValue={editingDriver?.description} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Driver Photo</Label>
                  <div className="flex items-center space-x-2">
                    {editingDriver?.driver_photo_url && !driverPhoto && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={editingDriver.driver_photo_url} />
                      </Avatar>
                    )}
                    <Input type="file" onChange={(e) => setDriverPhoto(e.target.files?.[0] || null)} accept="image/*" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Main Vehicle Photo</Label>
                  <div className="flex items-center space-x-2">
                    {editingDriver?.vehicle_photo_url && !vehiclePhoto && (
                      <Car className="h-10 w-10 text-emerald-600" />
                    )}
                    <Input type="file" onChange={(e) => setVehiclePhoto(e.target.files?.[0] || null)} accept="image/*" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Vehicle Photos</Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {editingDriver?.vehicle_photo_urls?.map((url, i) => (
                    <div key={i} className="relative aspect-video rounded border overflow-hidden">
                      <img src={url} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <Input type="file" multiple onChange={(e) => setAdditionalPhotos(Array.from(e.target.files || []))} accept="image/*" />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="is_public" name="is_public" defaultChecked={editingDriver?.is_public} />
                <Label htmlFor="is_public">Display on Public Community Page</Label>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Partner'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Visits</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers?.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={driver.driver_photo_url || ''} />
                      <AvatarFallback><User className="h-6 w-6 text-gray-400" /></AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{driver.full_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4 text-gray-400" />
                    <span>{driver.vehicle_number}</span>
                  </div>
                </TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell className="capitalize">{driver.tier}</TableCell>
                <TableCell>{driver.visit_count}</TableCell>
                <TableCell>{getStatusBadge(driver.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingDriver(driver);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {driver.status !== 'approved' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        onClick={() => statusMutation.mutate({ id: driver.id, status: 'approved' })}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {driver.status !== 'rejected' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => statusMutation.mutate({ id: driver.id, status: 'rejected' })}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DriverManager;
