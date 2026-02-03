import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { useCreateZone, useZones } from "@/hooks/use-reports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { insertZoneSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, PlusCircle, MapPin } from "lucide-react";

// Extend schema for client validation
const zoneFormSchema = insertZoneSchema.extend({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  radius: z.coerce.number().min(100, "Minimum radius is 100m"),
});

type ZoneFormValues = z.infer<typeof zoneFormSchema>;

export default function Operations() {
  const { user } = useAuth();
  const createZone = useCreateZone();
  const { data: zones, isLoading: loadingZones } = useZones();

  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneFormSchema),
    defaultValues: {
      name: "",
      riskLevel: "low",
      latitude: 51.505,
      longitude: -0.09,
      radius: 500,
    },
  });

  if (!user) return <Redirect to="/login" />;

  const onSubmit = (data: ZoneFormValues) => {
    createZone.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-8">Operations & Zones</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Zone Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Add New Zone</CardTitle>
                <CardDescription>Define areas for monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zone Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Central Park" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="riskLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risk Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low Risk</SelectItem>
                              <SelectItem value="medium">Medium Risk</SelectItem>
                              <SelectItem value="high">High Risk</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl>
                              <Input type="number" step="any" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitude</FormLabel>
                            <FormControl>
                              <Input type="number" step="any" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="radius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Radius (meters)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={createZone.isPending}>
                      {createZone.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                      Create Zone
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Zones List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Zones</CardTitle>
                <CardDescription>Currently monitored areas</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingZones ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Coordinates</TableHead>
                        <TableHead className="text-right">Radius</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {zones?.map((zone) => (
                        <TableRow key={zone.id}>
                          <TableCell className="font-medium">{zone.name}</TableCell>
                          <TableCell>
                            <span className={`
                              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${zone.riskLevel === 'high' ? 'bg-red-100 text-red-800' : 
                                zone.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'}
                            `}>
                              {zone.riskLevel}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{zone.radius}m</TableCell>
                        </TableRow>
                      ))}
                      {zones?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No zones defined yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
