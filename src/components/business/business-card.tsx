"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, MessageCircle, Phone, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { Business } from "@/types";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  const { _id, businessName, name, category, city, description, logoUrl, mobile, whatsapp } =
    business;
  const [imgError, setImgError] = useState(false);

  const truncate = (str: string | undefined, n: number) => {
    return str && str.length > n ? `${str.substring(0, n)}...` : str;
  };

  const showPlaceholder = !logoUrl || imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <Card className="group h-full flex flex-col overflow-hidden border bg-card text-card-foreground transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10">
        {/* Image / Logo area - blog-style header */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {showPlaceholder ? (
            <div className="h-full w-full bg-muted dark:bg-muted/80" aria-hidden />
          ) : (
            <Image
              src={logoUrl}
              alt={businessName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          )}
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="text-xs font-medium shadow-sm">
              {category}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2 pt-4 px-4 sm:px-5">
          <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-foreground">
            {businessName}
          </h3>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 px-4 sm:px-5 pt-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User size={14} className="shrink-0" />
            <span className="truncate font-medium text-foreground/90">{name || business.name}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{city || "Location N/A"}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {truncate(description, 90) || "No description available for this business."}
          </p>
        </CardContent>

        <CardFooter className="flex flex-wrap items-center gap-2 p-4 sm:px-5 pt-0">
          <Link href={`/business/${_id}`} className="flex-1 min-w-[100px]">
            <Button variant="outline" size="sm" className="w-full group/btn">
              Details
              <ArrowRight size={14} className="ml-1 transition-transform group-hover/btn:translate-x-0.5" />
            </Button>
          </Link>
          <div className="flex gap-1.5">
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
              >
                <Button size="icon" variant="secondary" className="h-9 w-9 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400">
                  <MessageCircle size={16} />
                </Button>
              </a>
            )}
            <a href={`tel:${mobile}`} title="Call">
              <Button size="icon" variant="secondary" className="h-9 w-9">
                <Phone size={16} />
              </Button>
            </a>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
