"use client";

import {
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  Filter,
  Globe,
  MapPin,
  Search,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateDDMMMYYYY } from "@/lib/date-utils";
import type { Job } from "@/types";

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

interface JobsListProps {
  initialJobs: Job[];
}

export function JobsList({ initialJobs }: JobsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const matchesSearch =
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = selectedCountry === "all" || job.country === selectedCountry;
      const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
      return matchesSearch && matchesCountry && matchesCategory;
    });
  }, [initialJobs, searchTerm, selectedCountry, selectedCategory]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <Globe className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">{filteredJobs.length} Jobs Available</h2>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredJobs.map((job) => (
              <Card
                key={job._id}
                className="group h-full flex flex-col justify-between border-l-4 border-l-primary transition-all duration-300 hover:shadow-xl"
              >
                <CardHeader className="flex-shrink-0">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      {job.category}
                    </Badge>
                    {job.createdAt && (
                      <span className="text-xs text-muted-foreground">
                        {formatDateDDMMMYYYY(job.createdAt)}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {job.jobTitle}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {job.companyName}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>
                        {job.city}, {job.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>{job.jobType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      <span>{job.experienceRequired}</span>
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 shrink-0" />
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{job.salaryRange}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.accommodation && (
                      <Badge variant="secondary" className="text-xs">
                        Accommodation
                      </Badge>
                    )}
                    {job.visaSupport && (
                      <Badge variant="secondary" className="text-xs">
                        Visa Support
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex-shrink-0">
                  <Link href={`/jobs/${job._id}`} className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/80">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <Briefcase className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">No jobs found</h3>
              <p className="mb-6 text-muted-foreground">Try adjusting your filters or search terms</p>
              <Link href="/jobs/post">
                <Button>Post a Job</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
