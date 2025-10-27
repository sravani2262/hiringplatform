import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, Mail, Download, ChevronDown } from "lucide-react";
import { Candidate, CandidateStage } from "@/lib/db";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STAGES = [
  { value: "all", label: "All Stages" },
  { value: "applied", label: "Applied" },
  { value: "screen", label: "Screening" },
  { value: "tech", label: "Technical" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const stageColors: Record<string, string> = {
  applied: "bg-status-applied text-white",
  screen: "bg-status-screen text-white",
  tech: "bg-status-tech text-white",
  offer: "bg-status-offer text-white",
  hired: "bg-status-hired text-white",
  rejected: "bg-status-rejected text-white",
};

export function CandidatesList() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const pageSize = 50;
  const queryClient = useQueryClient();

  interface CandidatesResponse {
    data: Candidate[];
    total: number;
    pagination?: {
      page: number;
      total: number;
      totalPages: number;
    };
  }

  const { data, isLoading } = useQuery<CandidatesResponse>({
    queryKey: ["candidates", page, search, stage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        search: search,
        stage: stage === "all" ? "" : stage
      });
      const res = await fetch(`/api/candidates?${params}`);
      if (!res.ok) throw new Error("Failed to fetch candidates");
      return res.json();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (previousData) => previousData,
  });

  // Client-side filtering for search and stage
  const filteredCandidates = useMemo(() => {
    if (!data?.data) return [];

    let filtered = data.data;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (c: Candidate) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower)
      );
    }

    if (stage && stage !== "all") {
      filtered = filtered.filter((c: Candidate) => c.stage === stage);
    }

    return filtered;
  }, [data, search, stage]);

  // Export functions
  const exportToCSV = (candidatesToExport: Candidate[]) => {
    const headers = ['Name', 'Email', 'Phone', 'Stage', 'Applied Date'];
    const rows = candidatesToExport.map((c) => [
      c.name,
      c.email,
      c.phone || '',
      c.stage,
      new Date(c.createdAt).toLocaleDateString(),
    ]);
    
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates-${new Date().toISOString()}.csv`;
    a.click();
    toast.success('Candidates exported successfully');
  };

  const handleExportAll = () => {
    exportToCSV(filteredCandidates);
  };

  const handleExportSelected = () => {
    const selected = filteredCandidates.filter((c) =>
      selectedCandidates.includes(c.id)
    );
    exportToCSV(selected);
    setSelectedCandidates([]);
  };

  // Bulk stage change
  const bulkStageChangeMutation = useMutation({
    mutationFn: async ({ ids, newStage }: { ids: string[]; newStage: CandidateStage }) => {
      const promises = ids.map((id) =>
        fetch(`/api/candidates/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: newStage }),
        })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      setSelectedCandidates([]);
      toast.success(`${selectedCandidates.length} candidates updated successfully`);
    },
    onError: () => {
      toast.error('Failed to update candidates');
    },
  });

  const handleBulkStageChange = (newStage: CandidateStage) => {
    bulkStageChangeMutation.mutate({
      ids: selectedCandidates,
      newStage,
    });
  };

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Bulk Actions */}
            {selectedCandidates.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <ChevronDown className="h-4 w-4" />
                    Bulk Actions ({selectedCandidates.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Change Stage</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[
                    { value: 'screen', label: 'Move to Screening' },
                    { value: 'tech', label: 'Move to Technical' },
                    { value: 'offer', label: 'Move to Offer' },
                    { value: 'hired', label: 'Mark as Hired' },
                    { value: 'rejected', label: 'Mark as Rejected' },
                  ].map((stageOption) => (
                    <DropdownMenuItem
                      key={stageOption.value}
                      onClick={() => handleBulkStageChange(stageOption.value as CandidateStage)}
                    >
                      {stageOption.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportSelected}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Selected
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedCandidates([])}>
                    Clear Selection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Export All */}
            <Button variant="outline" onClick={handleExportAll} className="gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCandidates.length} of {data?.pagination?.total || data?.total || filteredCandidates.length}{" "}
        candidates
      </div>

      {/* Candidates List - Optimized with virtual scrolling behavior */}
      <div className="space-y-5 max-h-[600px] overflow-y-auto border rounded-lg p-4">
        {filteredCandidates.map((candidate: Candidate) => (
          <Card 
            key={candidate.id} 
            className="mb-5 hover:shadow-lg shadow-sm transition-all duration-200 group hover:scale-[1.02] bg-card"
          >
            <CardContent className="flex items-center gap-4 p-4">
              {/* Checkbox for bulk selection */}
              <input
                type="checkbox"
                checked={selectedCandidates.includes(candidate.id)}
                onChange={() => toggleCandidateSelection(candidate.id)}
                onClick={(e) => e.stopPropagation()}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />

              <Link 
                to={`/candidates/${candidate.id}`}
                className="flex items-center gap-4 flex-1 cursor-pointer"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-sm font-semibold text-primary">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {candidate.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    {candidate.email}
                  </div>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <Badge
                  className={stageColors[candidate.stage]}
                  variant="default"
                >
                  {candidate.stage}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {new Date(candidate.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data && (
        <div className="flex items-center justify-between py-4">
          <p className="text-sm text-muted-foreground">
            Showing page {page} of {data.pagination?.totalPages || Math.ceil((data.pagination?.total || data.total || 0) / pageSize)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm font-medium rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= (data.pagination?.totalPages || Math.ceil((data.pagination?.total || data.total || 0) / pageSize))}
              className="px-3 py-2 text-sm font-medium rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
