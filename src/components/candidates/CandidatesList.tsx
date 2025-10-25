import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Search, Mail } from "lucide-react";
import { Candidate } from "@/lib/db";
import { Link } from "react-router-dom";

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

  const { data, isLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res = await fetch("/api/candidates?pageSize=1000");
      if (!res.ok) throw new Error("Failed to fetch candidates");
      return res.json();
    },
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="h-20 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
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
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCandidates.length} of {data?.data?.length || 0}{" "}
        candidates
      </div>

      {/* Candidates List - Optimized with virtual scrolling behavior */}
      <div className="space-y-5 max-h-[600px] overflow-y-auto border rounded-lg p-4">
        {filteredCandidates.map((candidate: Candidate) => (
          <Link key={candidate.id} to={`/candidates/${candidate.id}`}>
           <Card className="mb-5 hover:shadow-lg shadow-sm transition-all duration-200 cursor-pointer group hover:scale-[1.02] bg-card">

              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
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
                </div>
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
          </Link>
        ))}
      </div>
    </div>
  );
}
