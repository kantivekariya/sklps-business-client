"use client";

import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api, { API_ENDPOINTS } from "@/lib/api";

interface BusinessDetails {
  _id: string;
  businessName: string;
  name: string;
  email: string;
  mobile: string;
  whatsapp?: string;
  city?: string;
  category: string;
  description?: string;
  yearsInBusiness?: number;
  address?: string;
  website?: string;
  status: string;
}

export default function BusinessDashboardPage() {
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await api.get<BusinessDetails>(API_ENDPOINTS.BUSINESS_ME);
        setBusiness(res.data);
      } catch {
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Unable to load business details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Your business information (read-only)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {business.businessName}
          </CardTitle>
          <CardDescription>Status: {business.status}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-foreground">{business.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mobile</p>
                <p className="text-foreground">{business.mobile}</p>
              </div>
            </div>
            {business.whatsapp && (
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                  <p className="text-foreground">{business.whatsapp}</p>
                </div>
              </div>
            )}
            {business.city && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">City</p>
                  <p className="text-foreground">{business.city}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Category</p>
            <p className="text-foreground">{business.category}</p>
          </div>

          {business.yearsInBusiness != null && (
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Years in Business</p>
              <p className="text-foreground">{business.yearsInBusiness}</p>
            </div>
          )}

          {business.description && (
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-foreground">{business.description}</p>
            </div>
          )}

          {business.address && (
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-foreground">{business.address}</p>
            </div>
          )}

          {business.website && (
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Website</p>
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {business.website}
              </a>
            </div>
          )}

          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Contact Person</p>
            <p className="text-foreground">{business.name}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
