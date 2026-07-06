import { CheckCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS_TYPES, COUNTRIES, EMPLOYEE_COUNT_RANGES, flagEmoji } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { businessService } from "./business.service";

const DIAL_CODES = COUNTRIES.filter((c) => c.dialCode);

const categories = [
  "Agriculture",
  "Art & Design",
  "Automotive",
  "Beauty & Care",
  "Construction",
  "Diamond",
  "Education",
  "Electronics",
  "Event Planning",
  "Finance",
  "Food & Beverage",
  "Health",
  "Hospitality",
  "IT Services",
  "Legal Services",
  "Manufacturing",
  "Marketing",
  "Media",
  "Real Estate",
  "Retail",
  "Textile",
  "Trading",
  "Transportation",
  "Professional",
  "Other",
];

export function AddBusinessForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const mobile = `+${data.mobileDialCode}${data.mobileNumber}`;
      const whatsapp = data.whatsappNumber ? `+${data.whatsappDialCode}${data.whatsappNumber}` : "";

      const fields: Record<string, string | undefined> = {
        name: data.name,
        email: data.email,
        mobile,
        whatsapp,
        city: data.city,
        country: data.country,
        state: data.state,
        postalCode: data.postalCode,
        registrationNumber: data.registrationNumber,
        nativePlace: data.nativePlace,
        referenceName: data.referenceName,
        referenceContact: data.referenceContact,
        businessName: data.businessName,
        category: data.category,
        businessType: data.businessType,
        employeeCount: data.employeeCount,
        yearsInBusiness: data.yearsInBusiness ? String(Number(data.yearsInBusiness)) : undefined,
        website: data.website,
        socialMediaUrl: data.socialMediaUrl,
        description: data.description,
        address: data.address,
      };
      Object.entries(fields).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (selectedFile) formData.append("logo", selectedFile);
      await businessService.create(formData);
      setSubmitSuccess(true);
      toast({ title: "Success", description: "Business submitted for approval!" });
      setTimeout(() => navigate("/"), 3000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to submit business.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle>Submission Successful!</CardTitle>
            <CardDescription>
              Your business has been submitted for approval. An admin will review it shortly.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/")}>
              Return Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-foreground">Add Your Business</h1>
          <p className="mt-2 text-muted-foreground">Join the SKLPS community business network.</p>
        </div>

        <Card>
          <CardHeader className="rounded-t-xl bg-primary text-primary-foreground">
            <CardTitle>Business Registration Form</CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Please fill in all required fields accurately.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h3 className="mb-4 border-b pb-2 text-lg font-medium text-foreground">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">
                        {(errors.name as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <div className="flex gap-2">
                      <Select defaultValue="91" onValueChange={(v) => setValue("mobileDialCode", v)}>
                        <SelectTrigger className="w-14 shrink-0 px-2 sm:w-[110px] sm:px-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {DIAL_CODES.map((c) => (
                            <SelectItem key={c.name} value={c.dialCode}>
                              <span className="sm:hidden">{flagEmoji(c.iso2)}</span>
                              <span className="hidden sm:inline">
                                +{c.dialCode} {c.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input type="hidden" defaultValue="91" {...register("mobileDialCode")} />
                      <Input
                        id="mobileNumber"
                        {...register("mobileNumber", {
                          required: "Mobile number is required",
                          pattern: { value: /^[0-9]{6,15}$/, message: "Invalid mobile number" },
                        })}
                        placeholder="Mobile number"
                      />
                    </div>
                    {errors.mobileNumber && (
                      <p className="text-xs text-destructive">
                        {(errors.mobileNumber as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <div className="flex gap-2">
                      <Select defaultValue="91" onValueChange={(v) => setValue("whatsappDialCode", v)}>
                        <SelectTrigger className="w-14 shrink-0 px-2 sm:w-[110px] sm:px-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {DIAL_CODES.map((c) => (
                            <SelectItem key={c.name} value={c.dialCode}>
                              <span className="sm:hidden">{flagEmoji(c.iso2)}</span>
                              <span className="hidden sm:inline">
                                +{c.dialCode} {c.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input type="hidden" defaultValue="91" {...register("whatsappDialCode")} />
                      <Input
                        id="whatsappNumber"
                        {...register("whatsappNumber", {
                          pattern: { value: /^[0-9]{6,15}$/, message: "Invalid WhatsApp number" },
                        })}
                        placeholder="Optional"
                      />
                    </div>
                    {errors.whatsappNumber && (
                      <p className="text-xs text-destructive">
                        {(errors.whatsappNumber as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                      })}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {(errors.email as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register("city", { required: "City is required" })}
                      placeholder="Current City"
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive">
                        {(errors.city as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select onValueChange={(value) => setValue("country", value, { shouldValidate: true })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("country", { required: "Country is required" })} />
                    {errors.country && (
                      <p className="text-xs text-destructive">
                        {(errors.country as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" {...register("state")} placeholder="State or province" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal / ZIP Code</Label>
                    <Input id="postalCode" {...register("postalCode")} placeholder="Postal code" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 border-b pb-2 text-lg font-medium text-foreground">
                  Verification Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Tax ID / Business Registration No.</Label>
                    <Input
                      id="registrationNumber"
                      {...register("registrationNumber")}
                      placeholder="e.g. VAT, GST, EIN, Company Reg. No."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nativePlace">Native Place</Label>
                    <Input
                      id="nativePlace"
                      {...register("nativePlace")}
                      placeholder="Native village/town"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referenceName">Reference Name</Label>
                    <Input
                      id="referenceName"
                      {...register("referenceName")}
                      placeholder="Person who can verify"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referenceContact">Reference Contact</Label>
                    <Input
                      id="referenceContact"
                      {...register("referenceContact")}
                      placeholder="Phone or Mobile"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 border-b pb-2 text-lg font-medium text-foreground">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      {...register("businessName", { required: "Business Name is required" })}
                      placeholder="Enter business name"
                    />
                    {errors.businessName && (
                      <p className="text-xs text-destructive">
                        {(errors.businessName as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("category", value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register("category", { required: "Category is required" })}
                    />
                    {errors.category && (
                      <p className="text-xs text-destructive">
                        {(errors.category as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsInBusiness">Years in Business</Label>
                    <Input
                      id="yearsInBusiness"
                      type="number"
                      {...register("yearsInBusiness")}
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      {...register("website")}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select onValueChange={(value) => setValue("businessType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Business Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("businessType")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">Number of Employees</Label>
                    <Select onValueChange={(value) => setValue("employeeCount", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Range" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPLOYEE_COUNT_RANGES.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("employeeCount")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="socialMediaUrl">Social Media Link</Label>
                    <Input
                      id="socialMediaUrl"
                      type="url"
                      {...register("socialMediaUrl")}
                      placeholder="Instagram, Facebook, or LinkedIn URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Business Logo (PNG/JPG)</Label>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {previewUrl && (
                      <div className="mt-2 relative h-16 w-16 border rounded-md overflow-hidden bg-white">
                        <img
                          src={previewUrl}
                          alt="Logo Preview"
                          className="h-full w-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-0.5 rounded-bl-md"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="description">Business Description *</Label>
                    <Textarea
                      id="description"
                      {...register("description", { required: "Description is required" })}
                      placeholder="Describe your business services and products..."
                    />
                    {errors.description && (
                      <p className="text-xs text-destructive">
                        {(errors.description as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      {...register("address", { required: "Address is required" })}
                      placeholder="Full business address"
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive">
                        {(errors.address as { message?: string }).message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Business
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
