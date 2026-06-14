"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import api, { API_ENDPOINTS } from "@/lib/api";

interface SeoSettings {
  siteName: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  twitterHandle: string;
  favicon: string;
}

export function SeoManagement() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SeoSettings>({
    siteName: "",
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
    twitterHandle: "",
    favicon: "",
  });

  useEffect(() => {
    api
      .get<SeoSettings>("/seo")
      .then(({ data }) => setSettings(data))
      .catch(() => toast({ title: "Error", description: "Failed to load SEO settings.", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(API_ENDPOINTS.SEO, settings);
      toast({ title: "Success", description: "SEO settings updated. Refresh the site to see changes." });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">SEO Settings</h1>
        <p className="text-muted-foreground">Manage site metadata for search engines and social sharing.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Site name and default metadata used across the site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
              placeholder="SKLPS Business Directory"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Default Title</Label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) => setSettings((s) => ({ ...s, title: e.target.value }))}
              placeholder="SKLPS – Community Job Portal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Default Description</Label>
            <Textarea
              id="description"
              rows={3}
              value={settings.description}
              onChange={(e) => setSettings((s) => ({ ...s, description: e.target.value }))}
              placeholder="Connect, collaborate, and grow..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (comma separated)</Label>
            <Input
              id="keywords"
              value={settings.keywords}
              onChange={(e) => setSettings((s) => ({ ...s, keywords: e.target.value }))}
              placeholder="business directory, jobs, community"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social & Open Graph</CardTitle>
          <CardDescription>Images and handles for social sharing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ogImage">OG Image URL</Label>
            <Input
              id="ogImage"
              value={settings.ogImage}
              onChange={(e) => setSettings((s) => ({ ...s, ogImage: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitterHandle">Twitter Handle</Label>
            <Input
              id="twitterHandle"
              value={settings.twitterHandle}
              onChange={(e) => setSettings((s) => ({ ...s, twitterHandle: e.target.value }))}
              placeholder="@sklps"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="favicon">Favicon URL</Label>
            <Input
              id="favicon"
              value={settings.favicon}
              onChange={(e) => setSettings((s) => ({ ...s, favicon: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save SEO Settings"
        )}
      </Button>
    </div>
  );
}
