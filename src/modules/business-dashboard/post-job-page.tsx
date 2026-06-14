import { PostJobForm } from "./post-job-form";

export default function PostJobPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Post a Job</h1>
        <p className="mt-1 text-muted-foreground">
          Fill in the details below to post a new job listing.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <PostJobForm />
      </div>
    </div>
  );
}
