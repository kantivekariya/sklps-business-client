import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AddBusinessForm } from "@/components/add-business/add-business-form";

export const metadata: Metadata = {
  title: "Add Your Business",
  description: "Join the SKLPS community business network. Register your business for free.",
};

export default function AddBusinessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AddBusinessForm />
      </main>
      <Footer />
    </div>
  );
}
