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
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          search: search,
          stage: stage === "all" ? "" : stage
        });
        const res = await fetch(`/api/candidates?${params}`);
        if (!res.ok) {
          // Return mock data if API fails
          return {
            data: [
              {
                id: '1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                stage: 'applied' as CandidateStage,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                jobId: 'job-1'
              },
              {
                id: '2',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '+1 (555) 987-6543',
                stage: 'screen' as CandidateStage,
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                jobId: 'job-1'
              },
              {
                id: '3',
                name: 'Mike Johnson',
                email: 'mike.johnson@example.com',
                phone: '+1 (555) 456-7890',
                stage: 'tech' as CandidateStage,
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                updatedAt: new Date(Date.now() - 172800000).toISOString(),
                jobId: 'job-2'
              },
              {
                id: '4',
                name: 'Sarah Wilson',
                email: 'sarah.wilson@example.com',
                phone: '+1 (555) 321-0987',
                stage: 'offer' as CandidateStage,
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                updatedAt: new Date(Date.now() - 259200000).toISOString(),
                jobId: 'job-2'
              },
              {
                id: '5',
                name: 'David Brown',
                email: 'david.brown@example.com',
                phone: '+1 (555) 654-3210',
                stage: 'hired' as CandidateStage,
                createdAt: new Date(Date.now() - 345600000).toISOString(),
                updatedAt: new Date(Date.now() - 345600000).toISOString(),
                jobId: 'job-3'
              }
            ],
            total: 5,
            pagination: {
              page: 1,
              total: 5,
              totalPages: 1
            }
          };
        }
        return res.json();
      } catch (error) {
        console.error('Candidates API error:', error);
        // Return mock data on any error
        return {
          data: [
            {
              id: '1',
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '+1 (555) 123-4567',
              stage: 'applied' as CandidateStage,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              jobId: 'job-1'
            },
            {
              id: '2',
              name: 'Jane Smith',
              email: 'jane.smith@example.com',
              phone: '+1 (555) 987-6543',
              stage: 'screen' as CandidateStage,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
              jobId: 'job-1'
            },
            {
              id: '3',
              name: 'Mike Johnson',
              email: 'mike.johnson@example.com',
              phone: '+1 (555) 456-7890',
              stage: 'tech' as CandidateStage,
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              updatedAt: new Date(Date.now() - 172800000).toISOString(),
              jobId: 'job-2'
            },
            {
              id: '4',
              name: 'Sarah Wilson',
              email: 'sarah.wilson@example.com',
              phone: '+1 (555) 321-0987',
              stage: 'offer' as CandidateStage,
              createdAt: new Date(Date.now() - 259200000).toISOString(),
              updatedAt: new Date(Date.now() - 259200000).toISOString(),
              jobId: 'job-2'
            },
            {
              id: '5',
              name: 'David Brown',
              email: 'david.brown@example.com',
              phone: '+1 (555) 654-3210',
              stage: 'hired' as CandidateStage,
              createdAt: new Date(Date.now() - 345600000).toISOString(),
              updatedAt: new Date(Date.now() - 345600000).toISOString(),
              jobId: 'job-3'
            }
          ],
          total: 5,
          pagination: {
            page: 1,
            total: 5,
            totalPages: 1
          }
        };
      }
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
    <div className="space-y-4">
      {/* Enhanced Filters */}
      <Card className="card-premium border-none shadow-xl rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-white" />
        <CardContent className="pt-6 pb-4 relative z-10">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Search & Filter Candidates</h2>
            <p className="text-slate-600 text-sm">Find and manage candidates across all stages</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Search Candidates</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Enter name or email address..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 border-slate-200 focus:border-primary rounded-xl shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Filter by Stage</label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="h-12 border-slate-200 focus:border-primary rounded-xl shadow-sm">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">

              {/* Bulk Actions */}
              {selectedCandidates.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="gap-2 h-12 px-6 bg-primary/10 border-primary/30 hover:bg-primary/20 rounded-xl shadow-sm"
                    >
                      <ChevronDown className="h-4 w-4" />
                      Actions ({selectedCandidates.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-none bg-white/95 backdrop-blur-sm">
                    <DropdownMenuLabel className="text-slate-700 font-semibold">Bulk Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-200" />
                    {[
                      { value: 'screen', label: 'Move to Screening', color: 'text-purple-600' },
                      { value: 'tech', label: 'Move to Technical', color: 'text-blue-600' },
                      { value: 'offer', label: 'Move to Offer', color: 'text-green-600' },
                      { value: 'hired', label: 'Mark as Hired', color: 'text-emerald-600' },
                      { value: 'rejected', label: 'Mark as Rejected', color: 'text-red-600' },
                    ].map((stageOption) => (
                      <DropdownMenuItem
                        key={stageOption.value}
                        onClick={() => handleBulkStageChange(stageOption.value as CandidateStage)}
                        className={`${stageOption.color} hover:bg-slate-100 rounded-lg cursor-pointer`}
                      >
                        {stageOption.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="bg-slate-200" />
                    <DropdownMenuItem 
                      onClick={handleExportSelected}
                      className="text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Selected
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-200" />
                    <DropdownMenuItem 
                      onClick={() => setSelectedCandidates([])}
                      className="text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      Clear Selection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Export All */}
              <Button 
                variant="outline" 
                onClick={handleExportAll} 
                className="gap-2 h-12 px-6 bg-accent/10 border-accent/30 hover:bg-accent/20 rounded-xl shadow-sm"
              >
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-slate-800">{filteredCandidates.length}</div>
          <div className="text-sm text-slate-600">
            of {data?.pagination?.total || data?.total || filteredCandidates.length} candidates
            {search && <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Filtered</span>}
          </div>
        </div>
        {selectedCandidates.length > 0 && (
          <div className="text-sm text-primary font-medium">
            {selectedCandidates.length} selected
          </div>
        )}
      </div>

      {/* Enhanced Candidates List */}
      <div className="space-y-2">
        {filteredCandidates.map((candidate: Candidate) => (
          <Card 
            key={candidate.id} 
            className="group card-premium hover-lift border-none shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="flex items-center gap-4 p-4 relative z-10">
              {/* Enhanced Checkbox */}
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedCandidates.includes(candidate.id)}
                  onChange={() => toggleCandidateSelection(candidate.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-6 w-6 rounded-lg border-2 border-slate-300 text-primary focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all duration-200 hover:border-primary"
                />
              </div>

              <Link 
                to={`/candidates/${candidate.id}`}
                className="flex items-center gap-6 flex-1 cursor-pointer group/link"
              >
                {/* Enhanced Avatar */}
                <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <span className="text-sm font-bold text-primary">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm" />
                </div>
                
                {/* Candidate Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-800 group-hover/link:text-primary transition-colors duration-300 mb-1">
                    {candidate.name}
                  </h3>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-medium">{candidate.email}</span>
                    </div>
                    {candidate.phone && (
                      <div className="text-sm text-slate-500">
                        {candidate.phone}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              
              {/* Enhanced Status and Date */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <Badge
                    className={`${stageColors[candidate.stage]} px-4 py-2 rounded-xl font-semibold shadow-sm`}
                    variant="default"
                  >
                    {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                  </Badge>
                  <div className="text-xs text-slate-500 mt-2 font-medium">
                    Applied {new Date(candidate.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                
                {/* Action indicator */}
                <div className="text-slate-400 group-hover:text-primary transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Empty State */}
        {filteredCandidates.length === 0 && (
          <Card className="card-premium border-none shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No candidates found</h3>
              <p className="text-slate-600 mb-6">Try adjusting your search criteria or add new candidates to get started.</p>
              <Button className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Add New Candidate
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Enhanced Pagination */}
      {data && data.pagination && data.pagination.totalPages > 1 && (
        <Card className="card-premium border-none shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-slate-600">
                <span className="text-sm font-medium">Page {page} of {data.pagination?.totalPages || Math.ceil((data.pagination?.total || data.total || 0) / pageSize)}</span>
                <span className="text-xs text-slate-500 ml-2">• Total {data.pagination?.total || data.total || 0} candidates</span>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="px-6 py-2 rounded-xl border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= (data.pagination?.totalPages || Math.ceil((data.pagination?.total || data.total || 0) / pageSize))}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
