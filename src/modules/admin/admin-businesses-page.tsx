import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Loader2,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Business } from "@/types";
import { adminService } from "./admin.service";

function BusinessTable({
  data,
  loading,
  isPending,
  onApprove,
  onReject,
  onDelete,
  onView,
  pagination,
  onPageChange,
  limit,
  onLimitChange,
}: {
  data: Business[];
  loading: boolean;
  isPending: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView: (b: Business) => void;
  pagination?: { page: number; totalPages: number; total: number };
  onPageChange?: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}) {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <div className="text-center p-8 rounded-lg border bg-muted/50 text-muted-foreground">
        No businesses found.
      </div>
    );
  }
  return (
    <Card className="rounded-xl shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((biz) => (
            <TableRow key={biz._id}>
              <TableCell className="font-medium">{biz.businessName}</TableCell>
              <TableCell>
                <Badge variant="outline">{biz.category}</Badge>
              </TableCell>
              <TableCell>{biz.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{biz.status || "N/A"}</Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onView(biz)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {isPending && onApprove && onReject ? (
                  <>
                    <Button
                      size="icon"
                      className="bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                      onClick={() => onApprove(biz._id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="bg-rose-500 text-white hover:bg-rose-600 shadow-sm"
                      onClick={() => onReject(biz._id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  onDelete && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => onDelete(biz._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && onPageChange && onLimitChange && limit && (
        <div className="flex items-center justify-end px-4 py-3 border-t">
          <div className="flex gap-4 sm:gap-6 lg:gap-8 items-center">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={String(limit)} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-center text-sm font-medium">
              Page {pagination.page} of {Math.max(1, pagination.totalPages)}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(1)}
                disabled={pagination.page <= 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => onPageChange(pagination.totalPages)}
                disabled={pagination.page >= pagination.totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function AdminBusinessesPage() {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [currentTab, setCurrentTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [allPage, setAllPage] = useState(1);
  const [allLimit, setAllLimit] = useState(10);
  const [allPagination, setAllPagination] = useState<{
    page: number;
    totalPages: number;
    total: number;
  } | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset to page 1 whenever filters change
  useEffect(() => {
    setAllPage(1);
  }, [searchTerm, allLimit]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        if (currentTab === "pending") {
          const data = await adminService.getPendingBusinesses();
          setBusinesses(data);
          setAllPagination(null);
        } else {
          const data = await adminService.getBusinessesPaged(allPage, allLimit, searchTerm);
          setBusinesses(data.businesses);
          setAllPagination(data.pagination);
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load businesses.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, [currentTab, toast, allPage, allLimit, searchTerm]);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveBusiness(id);
      toast({ title: "Success", description: "Business approved." });
      setBusinesses((prev) => prev.filter((b) => b._id !== id));
    } catch {
      toast({ title: "Error", description: "Failed to approve.", variant: "destructive" });
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject and DELETE this business?")) return;
    try {
      await adminService.deleteBusiness(id);
      toast({ title: "Success", description: "Business rejected." });
      setBusinesses((prev) => prev.filter((b) => b._id !== id));
      setSelectedBusiness(null);
      if (allPagination) setAllPagination((p) => (p ? { ...p, total: p.total - 1 } : null));
    } catch {
      toast({ title: "Error", description: "Failed to reject.", variant: "destructive" });
    }
  };

  const filteredBusinesses =
    currentTab === "pending"
      ? businesses.filter(
          (b) =>
            b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : businesses;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
        <p className="text-muted-foreground">Review, approve, and manage business listings.</p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="all">All Businesses</TabsTrigger>
          </TabsList>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <TabsContent value="pending" className="mt-0">
          <BusinessTable
            data={filteredBusinesses}
            loading={loading}
            isPending={true}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={setSelectedBusiness}
          />
        </TabsContent>
        <TabsContent value="all" className="mt-0">
          <BusinessTable
            data={filteredBusinesses}
            loading={loading}
            isPending={false}
            onDelete={handleReject}
            onView={setSelectedBusiness}
            pagination={allPagination ?? undefined}
            onPageChange={setAllPage}
            limit={allLimit}
            onLimitChange={setAllLimit}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedBusiness} onOpenChange={(open) => !open && setSelectedBusiness(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedBusiness?.businessName}</DialogTitle>
            <DialogDescription>
              {selectedBusiness?.category} • {selectedBusiness?.city}
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">Owner Name</span>
                  {selectedBusiness.name}
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">Contact</span>
                  {selectedBusiness.mobile}
                  <br />
                  {selectedBusiness.email}
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">Location</span>
                  {[selectedBusiness.city, selectedBusiness.state, selectedBusiness.country]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">
                    Business Type
                  </span>
                  {selectedBusiness.businessType || "N/A"}
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">
                    Native Place
                  </span>
                  {selectedBusiness.nativePlace || "N/A"}
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">
                    Tax ID / Registration No.
                  </span>
                  {selectedBusiness.registrationNumber || "N/A"}
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">
                    Reference Name
                  </span>
                  {selectedBusiness.referenceName || "N/A"}
                </div>
                <div>
                  <span className="font-semibold block text-muted-foreground mb-1">
                    Reference Contact
                  </span>
                  {selectedBusiness.referenceContact || "N/A"}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold block text-muted-foreground mb-1">
                    Description
                  </span>
                  <p className="whitespace-pre-wrap rounded border bg-muted p-2 text-foreground text-xs">
                    {selectedBusiness.description}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold block text-muted-foreground mb-1">Address</span>
                  <p className="text-foreground">{selectedBusiness.address || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            {currentTab === "pending" && selectedBusiness ? (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleReject(selectedBusiness._id);
                    setSelectedBusiness(null);
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(selectedBusiness._id);
                    setSelectedBusiness(null);
                  }}
                >
                  Approve & Publish
                </Button>
              </>
            ) : (
              selectedBusiness && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleReject(selectedBusiness._id);
                    setSelectedBusiness(null);
                  }}
                >
                  Delete Business
                </Button>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
