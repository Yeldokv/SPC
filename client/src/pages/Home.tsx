import { useCreateReport } from "@/hooks/use-reports";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPicker } from "@/components/MapPicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertReportSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Loader2, Camera, MapPin, CheckCircle2 } from "lucide-react";
import { useState } from "react";

// Client-side schema refinement
const formSchema = insertReportSchema.extend({
  latitude: z.number().min(-90).max(90, "Please select a location on the map"),
  longitude: z.number().min(-180).max(180, "Please select a location on the map"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createReport = useCreateReport();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "single",
      description: "",
      imagePath: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const compressImage = (file: File, maxSizeMB: number = 2): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions to keep image under size limit
          const maxDimension = 1920; // Max width or height
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Start with high quality and reduce if needed
          let quality = 0.9;
          let result = canvas.toDataURL('image/jpeg', quality);

          // Reduce quality until size is acceptable
          while (result.length > maxSizeMB * 1024 * 1024 && quality > 0.1) {
            quality -= 0.1;
            result = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(result);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);

        if (fileSizeMB > 10) {
          toast({
            title: "Image Too Large",
            description: "Please select an image smaller than 10MB",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Processing Image",
          description: "Compressing image for upload...",
        });

        const compressed = await compressImage(file, 2); // Compress to max 2MB
        setImagePreview(compressed);
        form.setValue("imagePath", compressed);

        toast({
          title: "Image Ready",
          description: "Image has been optimized and is ready to submit",
        });
      } catch (error) {
        console.error("Image processing error:", error);
        toast({
          title: "Image Processing Failed",
          description: "Could not process the image. Please try a different file.",
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit = (data: FormValues) => {
    createReport.mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
        setImagePreview(null);
      },
      onError: (error: any) => {
        const message = error?.message || "Failed to submit report. The file might be too large.";
        toast({
          title: "Submission Failed",
          description: message,
          variant: "destructive",
        });
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full text-center p-8 shadow-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Submitted</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for your report. Our team will verify the information and take appropriate action.
            </p>
            <Button onClick={() => setIsSuccess(false)} className="w-full">
              Submit Another Report
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        {/* Unsplash image used for subtle texture: Dog running in field */}

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
              Report Stray Dogs
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
              Help us maintain a safe community and ensure humane treatment for stray animals.
              Your reports help coordinate vaccination and care efforts.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <main className="flex-1 container mx-auto px-4 -mt-10 mb-12 relative z-20">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl border-t-4 border-t-accent">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl">New Report</CardTitle>
              <CardDescription>
                Please provide accurate details to help our team locate the animal.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                  {/* Category Selection */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incident Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 bg-slate-50">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">Single Stray Dog</SelectItem>
                            <SelectItem value="group">Pack / Group of Dogs</SelectItem>
                            <SelectItem value="aggressive">Aggressive Behavior</SelectItem>
                            <SelectItem value="injured">Injured Animal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Photo Upload */}
                  <div className="space-y-3">
                    <FormLabel>Photo Evidence</FormLabel>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        className="h-32 w-32 border-dashed border-2 flex flex-col gap-2 hover:bg-slate-50"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} className="w-full h-full object-cover rounded-md" alt="Preview" />
                        ) : (
                          <>
                            <Camera className="w-6 h-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Upload Photo</span>
                          </>
                        )}
                      </Button>
                      <Input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <div className="text-sm text-muted-foreground flex-1">
                        Please upload a clear photo if safe to do so. This helps identify specific animals.
                      </div>
                    </div>
                    {/* Hidden input to hold the base64 string for validation */}
                    <FormField
                      control={form.control}
                      name="imagePath"
                      render={() => <FormItem><FormMessage /></FormItem>}
                    />
                  </div>

                  {/* Location Picker */}
                  <div className="space-y-3">
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </FormLabel>
                    <MapPicker
                      onLocationSelect={(lat, lng) => {
                        form.setValue("latitude", lat);
                        form.setValue("longitude", lng);
                      }}
                    />
                    {form.formState.errors.latitude && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.latitude.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the dog(s), their behavior, or any specific landmarks..."
                            className="resize-none h-32 bg-slate-50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Ethics Disclaimer */}
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
                    <strong>Note:</strong> This system supports humane, ABC (Animal Birth Control) based management only.
                    We do not support or facilitate inhumane removal.
                  </div>

                  {!user ? (
                    <Button
                      type="button"
                      onClick={() => setLocation("/login")}
                      className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20"
                    >
                      Login to Submit Report
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20"
                      disabled={createReport.isPending}
                    >
                      {createReport.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Report"
                      )}
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
