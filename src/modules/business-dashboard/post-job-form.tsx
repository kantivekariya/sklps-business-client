import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { businessDashboardService } from "./business-dashboard.service";

const JOB_CATEGORIES = [
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

const COUNTRIES = ["India", "Kenya", "UAE", "Saudi Arabia", "Qatar", "Oman", "Other"];
const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Freelance", "Internship"];
const EXPERIENCE_LEVELS = ["Fresher", "1-2 Years", "3-5 Years", "5-10 Years", "10+ Years"];

interface JobFormData {
  jobTitle: string;
  companyName: string;
  category: string;
  jobType: string;
  experienceRequired: string;
  country: string;
  city: string;
  salaryRange: string;
  description: string;
  skillsRequired: string;
  email: string;
  mobile: string;
  whatsapp: string;
  contactPerson: string;
  accommodation: string;
  visaSupport: string;
}

export function PostJobForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobFormData>();

  const onSubmit = async (data: JobFormData) => {
    try {
      const payload = {
        ...data,
        skillsRequired: data.skillsRequired
          ? data.skillsRequired
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        accommodation: data.accommodation === "true",
        visaSupport: data.visaSupport === "true",
      };
      await businessDashboardService.createJob(payload);
      toast({ title: "Job Posted!", description: "Your job has been submitted for review." });
      navigate("/business-dashboard/jobs");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to post job",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input
            id="jobTitle"
            {...register("jobTitle", { required: "Job title is required" })}
            placeholder="e.g. Senior Software Engineer"
          />
          {errors.jobTitle && (
            <p className="mt-1 text-sm text-destructive">{errors.jobTitle.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            {...register("companyName", { required: "Company name is required" })}
            placeholder="Your company name"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-destructive">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <Label>Category *</Label>
          <Select onValueChange={(v) => setValue("category", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {JOB_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("category", { required: "Category is required" })} />
          {errors.category && (
            <p className="mt-1 text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label>Job Type *</Label>
          <Select onValueChange={(v) => setValue("jobType", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("jobType", { required: "Job type is required" })} />
          {errors.jobType && (
            <p className="mt-1 text-sm text-destructive">{errors.jobType.message}</p>
          )}
        </div>

        <div>
          <Label>Experience Required *</Label>
          <Select onValueChange={(v) => setValue("experienceRequired", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_LEVELS.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("experienceRequired", { required: "Experience is required" })}
          />
          {errors.experienceRequired && (
            <p className="mt-1 text-sm text-destructive">{errors.experienceRequired.message}</p>
          )}
        </div>

        <div>
          <Label>Country *</Label>
          <Select onValueChange={(v) => setValue("country", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("country", { required: "Country is required" })} />
          {errors.country && (
            <p className="mt-1 text-sm text-destructive">{errors.country.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            {...register("city", { required: "City is required" })}
            placeholder="e.g. Mumbai"
          />
          {errors.city && <p className="mt-1 text-sm text-destructive">{errors.city.message}</p>}
        </div>

        <div>
          <Label htmlFor="salaryRange">Salary Range</Label>
          <Input
            id="salaryRange"
            {...register("salaryRange")}
            placeholder="e.g. ₹50,000 - ₹80,000/month"
          />
        </div>

        <div>
          <Label htmlFor="email">Contact Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="jobs@company.com"
          />
          {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="mobile">Mobile *</Label>
          <Input
            id="mobile"
            {...register("mobile", { required: "Mobile is required" })}
            placeholder="+91 98765 43210"
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-destructive">{errors.mobile.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input id="whatsapp" {...register("whatsapp")} placeholder="+91 98765 43210" />
        </div>

        <div>
          <Label htmlFor="contactPerson">Contact Person *</Label>
          <Input
            id="contactPerson"
            {...register("contactPerson", { required: "Contact person is required" })}
            placeholder="HR Manager name"
          />
          {errors.contactPerson && (
            <p className="mt-1 text-sm text-destructive">{errors.contactPerson.message}</p>
          )}
        </div>

        <div>
          <Label>Accommodation Provided</Label>
          <Select onValueChange={(v) => setValue("accommodation", v)} defaultValue="false">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register("accommodation")} defaultValue="false" />
        </div>

        <div>
          <Label>Visa Support</Label>
          <Select onValueChange={(v) => setValue("visaSupport", v)} defaultValue="false">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register("visaSupport")} defaultValue="false" />
        </div>
      </div>

      <div>
        <Label htmlFor="skillsRequired">Skills Required (comma-separated)</Label>
        <Input
          id="skillsRequired"
          {...register("skillsRequired")}
          placeholder="React, Node.js, TypeScript"
        />
      </div>

      <div>
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          rows={6}
          {...register("description", { required: "Description is required" })}
          placeholder="Describe the role, responsibilities, and requirements..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/business-dashboard/jobs")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Post Job
        </Button>
      </div>
    </form>
  );
}
