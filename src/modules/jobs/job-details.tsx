import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Globe,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/types";
import { type JobApplication, jobsService } from "./jobs.service";

interface JobDetailsProps {
  job: Job;
}

export function JobDetails({ job }: JobDetailsProps) {
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { toast } = useToast();

  const onSubmitApplication = async (data: Record<string, string>) => {
    setApplying(true);
    try {
      await jobsService.apply(job._id, data as unknown as JobApplication);
      toast({
        title: "✅ Application Submitted!",
        description: "Your application has been sent to the employer.",
      });
      setDialogOpen(false);
      reset();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Submission Failed",
        description: err.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate("/jobs")} className="mb-6 hover:bg-muted">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>

        <Card className="shadow-xl border-0 mb-6">
          <CardHeader className="rounded-t-lg bg-primary pb-8 text-primary-foreground">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className="border-primary-foreground/30 bg-primary-foreground/20 text-primary-foreground"
                  >
                    {job.category}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="border-primary-foreground/30 bg-primary-foreground/20 text-primary-foreground"
                  >
                    {job.jobType}
                  </Badge>
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold mb-2">
                  {job.jobTitle}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-lg text-primary-foreground/90">
                  <Building2 className="w-5 h-5" />
                  {job.companyName}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                {job.status === "Approved" && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="lg"
                        className="bg-primary-foreground font-semibold text-primary hover:bg-primary-foreground/90"
                      >
                        <Send className="mr-2 h-5 w-5" />
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Apply for {job.jobTitle}</DialogTitle>
                        <DialogDescription>
                          Fill in your details to apply for this position
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit(onSubmitApplication)} className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            placeholder="John Doe"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-destructive">
                              {(errors.name as { message?: string }).message}
                            </p>
                          )}
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
                                message: "Invalid email",
                              },
                            })}
                            placeholder="john@example.com"
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-destructive">
                              {(errors.email as { message?: string }).message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="mobile">Mobile Number *</Label>
                          <Input
                            id="mobile"
                            {...register("mobile", { required: "Mobile is required" })}
                            placeholder="+91 98765 43210"
                          />
                          {errors.mobile && (
                            <p className="mt-1 text-sm text-destructive">
                              {(errors.mobile as { message?: string }).message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="location">Current Location *</Label>
                          <Input
                            id="location"
                            {...register("location", { required: "Location is required" })}
                            placeholder="Mumbai, India"
                          />
                          {errors.location && (
                            <p className="mt-1 text-sm text-destructive">
                              {(errors.location as { message?: string }).message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="experience">Total Experience *</Label>
                          <Input
                            id="experience"
                            {...register("experience", { required: "Experience is required" })}
                            placeholder="3 years"
                          />
                          {errors.experience && (
                            <p className="mt-1 text-sm text-destructive">
                              {(errors.experience as { message?: string }).message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="resumeUrl">Resume URL (Google Drive / Dropbox)</Label>
                          <Input
                            id="resumeUrl"
                            type="url"
                            {...register("resumeUrl")}
                            placeholder="https://drive.google.com/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="coverLetter">Cover Letter</Label>
                          <Textarea
                            id="coverLetter"
                            {...register("coverLetter")}
                            placeholder="Why are you a good fit for this role?"
                            rows={4}
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={applying}
                          className="w-full bg-primary hover:bg-primary/80"
                        >
                          {applying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit Application
                            </>
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4">
                <MapPin className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold text-foreground">
                    {job.city}, {job.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 p-4">
                <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-semibold text-foreground">{job.experienceRequired}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-violet-500/10 p-4">
                <Clock className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Job Type</p>
                  <p className="font-semibold text-foreground">{job.jobType}</p>
                </div>
              </div>
            </div>

            {job.salaryRange && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-500/10 p-4 dark:border-emerald-800">
                <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Salary Range</p>
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    {job.salaryRange}
                  </p>
                </div>
              </div>
            )}

            <Separator className="my-6" />

            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                <Briefcase className="w-5 h-5 text-primary" />
                Job Description
              </h3>
              <p className="whitespace-pre-line leading-relaxed text-foreground/90">
                {job.description}
              </p>
            </div>

            {job.skillsRequired && job.skillsRequired.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-bold text-foreground">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(job.accommodation || job.visaSupport) && (
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-bold text-foreground">Benefits</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {job.accommodation && (
                    <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 p-4">
                      <Home className="w-6 h-6 text-primary" />
                      <span className="font-medium text-foreground">Accommodation Provided</span>
                    </div>
                  )}
                  {job.visaSupport && (
                    <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 p-4">
                      <Globe className="w-6 h-6 text-primary" />
                      <span className="font-medium text-foreground">Visa Support Available</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            <div>
              <h3 className="mb-4 text-xl font-bold text-foreground">Contact Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${job.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {job.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile</p>
                    <a
                      href={`tel:${job.mobile}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {job.mobile}
                    </a>
                  </div>
                </div>
                {job.whatsapp && (
                  <div className="flex items-center gap-3 rounded-lg bg-emerald-500/10 p-4">
                    <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <a
                        href={`https://wa.me/${job.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                      >
                        {job.whatsapp}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p className="font-medium text-foreground">{job.contactPerson}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
