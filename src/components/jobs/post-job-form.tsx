"use client";

import { Briefcase, Building2, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import api, { API_ENDPOINTS } from "@/lib/api";

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

const countries = ["India", "Kenya", "UAE", "Saudi Arabia", "Qatar", "Oman", "Other"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance"];

interface PostJobFormProps {
  redirectTo?: string;
}

export function PostJobForm({ redirectTo = "/jobs" }: PostJobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      const skillsArray = data.skillsRequired
        ? data.skillsRequired
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s)
        : [];

      const jobData = {
        ...data,
        skillsRequired: skillsArray,
        accommodation: data.accommodation === "true",
        visaSupport: data.visaSupport === "true",
      };

      await api.post(API_ENDPOINTS.JOB_CREATE, jobData);
      toast({
        title: "✅ Job Posted Successfully!",
        description: "Your job is now live and accepting applications.",
      });
      setTimeout(() => router.push(redirectTo), 2000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Submission Failed",
        description: err.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full">
      <div className="flex-1 min-h-0 flex flex-col w-full h-full">
        <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border shadow-lg">
          <CardHeader className="flex-shrink-0 bg-neutral-900 text-white rounded-t-lg px-4 sm:px-5 md:px-6 py-4 sm:py-5">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg lg:text-xl">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300 shrink-0" />
              Job Details
            </CardTitle>
            <CardDescription className="text-neutral-400 text-sm mt-1">
              Fill in the details below. Your job will be live once submitted.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1 min-h-0">
                <div className="space-y-6 lg:space-y-8 min-h-0">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-neutral-600" />
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        Company Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      {...register("companyName", {
                        required: "Company name is required",
                      })}
                      placeholder="ABC Corporation"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.companyName as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      {...register("contactPerson", {
                        required: "Contact person is required",
                      })}
                      placeholder="John Doe"
                    />
                    {errors.contactPerson && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.contactPerson as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      {...register("mobile", {
                        required: "Mobile is required",
                      })}
                      placeholder="+91 98765 43210"
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.mobile as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input id="whatsapp" {...register("whatsapp")} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="hr@company.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.email as { message?: string }).message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="lg:hidden" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-neutral-600" />
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">Location</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("country", value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register("country", { required: "Country is required" })}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.country as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register("city", { required: "City is required" })}
                      placeholder="Mumbai / Nairobi / Dubai"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.city as { message?: string }).message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
                </div>

                <div className="space-y-6 lg:space-y-8 min-h-0">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-5 h-5 text-neutral-600" />
                      <h3 className="text-base font-semibold text-foreground sm:text-lg">
                        Job Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      {...register("jobTitle", {
                        required: "Job title is required",
                      })}
                      placeholder="Senior Software Engineer"
                    />
                    {errors.jobTitle && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.jobTitle as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div>
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
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register("category", { required: "Category is required" })}
                    />
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.category as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="jobType">Job Type *</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("jobType", value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      {...register("jobType", { required: "Job type is required" })}
                    />
                    {errors.jobType && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.jobType as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="experienceRequired">Experience Required *</Label>
                    <Input
                      id="experienceRequired"
                      {...register("experienceRequired", {
                        required: "Experience is required",
                      })}
                      placeholder="2-5 years"
                    />
                    {errors.experienceRequired && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.experienceRequired as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="salaryRange">Salary Range</Label>
                    <Input
                      id="salaryRange"
                      {...register("salaryRange")}
                      placeholder="$50,000 - $70,000 per year"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="skillsRequired">Skills Required (comma separated)</Label>
                    <Input
                      id="skillsRequired"
                      {...register("skillsRequired")}
                      placeholder="JavaScript, React, Node.js"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      {...register("description", {
                        required: "Description is required",
                      })}
                      placeholder="Describe the role, responsibilities, and requirements..."
                      rows={6}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {(errors.description as { message?: string }).message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="accommodation">Accommodation Provided?</Label>
                    <Select
                      onValueChange={(value) => setValue("accommodation", value)}
                      defaultValue="false"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="visaSupport">Visa Support?</Label>
                    <Select
                      onValueChange={(value) => setValue("visaSupport", value)}
                      defaultValue="false"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
                </div>
              </div>

              <div className="flex-shrink-0 pt-6 sm:pt-8 mt-6 border-t flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto min-w-[140px] sm:min-w-[160px] bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-5 sm:py-6 text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Job"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
