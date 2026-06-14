export interface Business {
  _id: string;
  businessName: string;
  name: string;
  category: string;
  city: string;
  description: string;
  logoUrl?: string;
  mobile: string;
  whatsapp?: string;
  email: string;
  address: string;
  website?: string;
  yearsInBusiness?: number;
  nativePlace?: string;
  registrationNumber?: string;
  referenceName?: string;
  referenceContact?: string;
  status?: string;
}

export interface Job {
  _id: string;
  jobTitle: string;
  companyName: string;
  contactPerson: string;
  email: string;
  mobile: string;
  whatsapp?: string;
  city: string;
  country: string;
  category: string;
  jobType: string;
  experienceRequired: string;
  description: string;
  salaryRange?: string;
  skillsRequired?: string[];
  accommodation?: boolean;
  visaSupport?: boolean;
  status?: string;
  businessId?: string | { _id: string; businessName: string; name: string; email?: string };
  createdAt?: string;
}

export interface User {
  name?: string;
  email: string;
  token?: string;
}
