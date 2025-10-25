import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, GripVertical, Archive, Edit, X } from 'lucide-react';
import { Job } from '@/lib/db';
import { Link, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

function SortableJobCard({ job, onArchiveToggle }: { job: Job; onArchiveToggle: (id: string, newStatus: string) => Promise<void> }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const navigate = useNavigate();

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary/40 hover:border-l-primary group overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 relative">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              aria-label="Drag job"
              className="cursor-grab hover:text-primary active:cursor-grabbing transition-colors"
              type="button"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-5 w-5" />
            </button>
            <Link to={`/jobs/${job.id}`} className="group/link">
              <CardTitle className="text-xl font-semibold group-hover/link:text-primary transition-colors">
                {job.title}
              </CardTitle>
            </Link>
          </div>
          <CardDescription className="mt-2 flex items-center gap-2 text-base">
            <span>{job.location}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{job.type}</span>
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={job.status === 'active' ? 'default' : 'secondary'}
            className={job.status === 'active' ? 'shadow-md shadow-primary/20' : ''}
          >
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex gap-2 flex-wrap mb-4">
          {job.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="hover:bg-primary/10 transition-colors">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="hover:border-primary hover:text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // prevent drag click
              navigate(`/jobs/${job.id}/edit`);
            }}
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="hover:border-primary hover:text-primary transition-colors"
            onClick={async (e) => {
              e.stopPropagation(); // prevent drag click
              const newStatus = job.status === 'active' ? 'archived' : 'active';
              await onArchiveToggle(job.id, newStatus);
            }}
          >
            <Archive className="h-3 w-3 mr-1" />
            {job.status === 'active' ? 'Archive' : 'Unarchive'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function JobsList() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when search or status changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', debouncedSearch, status, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: debouncedSearch,
        page: page.toString(),
        pageSize: '10',
        sort: 'order',
      });
      if (status !== 'all') {
        params.set('status', status);
      }
      const res = await fetch(`/api/jobs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      return res.json();
    },
  });

  // Reorder mutation (kept mostly as you had it)
  const reorderMutation = useMutation({
    mutationFn: async ({ id, fromOrder, toOrder }: { id: string; fromOrder: number; toOrder: number }) => {
      const res = await fetch(`/api/jobs/${id}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromOrder, toOrder }),
      });
      if (!res.ok) throw new Error('Failed to reorder');
      return res.json();
    },
    onMutate: async ({ id, toOrder }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs', debouncedSearch, status, page] });
      const previousData = queryClient.getQueryData(['jobs', debouncedSearch, status, page]);

      queryClient.setQueryData(['jobs', debouncedSearch, status, page], (old: any) => {
        if (!old) return old;
        const jobs = [...old.data];
        const fromIndex = jobs.findIndex((j: Job) => j.id === id);
        const [movedJob] = jobs.splice(fromIndex, 1);
        jobs.splice(toOrder, 0, movedJob);
        return { ...old, data: jobs };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['jobs', debouncedSearch, status, page], context.previousData);
      }
      toast.error('Failed to reorder jobs. Please try again.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', debouncedSearch, status, page] });
      toast.success('Jobs reordered successfully');
    },
  });

  // Archive / Unarchive mutation
  const archiveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // NOTE: adjust endpoint/payload if your API differs.
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || 'Failed to update job status');
      }
      return res.json();
    },
    onMutate: async ({ id, status: newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs', debouncedSearch, status, page] });
      const previousData = queryClient.getQueryData(['jobs', debouncedSearch, status, page]);

      queryClient.setQueryData(['jobs', debouncedSearch, status, page], (old: any) => {
        if (!old) return old;
        const jobs = old.data.map((j: Job) => (j.id === id ? { ...j, status: newStatus } : j));
        return { ...old, data: jobs };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['jobs', debouncedSearch, status, page], context.previousData);
      }
      toast.error('Failed to update job status. Please try again.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', debouncedSearch, status, page] });
    },
  });

  // Helper wrapper to call archive mutation and show toasts
  const handleArchiveToggle = async (id: string, newStatus: string) => {
    try {
      await archiveMutation.mutateAsync({ id, status: newStatus });
      toast.success(newStatus === 'archived' ? 'Job archived' : 'Job restored');
    } catch (err: any) {
      // error toast handled in onError, but keep this for extra safety
      toast.error(err?.message || 'Something went wrong');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !data?.data) return;

    const jobs = data.data;
    const oldIndex = jobs.findIndex((j: Job) => j.id === active.id);
    const newIndex = jobs.findIndex((j: Job) => j.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    reorderMutation.mutate({
      id: active.id as string,
      fromOrder: oldIndex,
      toOrder: newIndex,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-40 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, location, type, or tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-10 h-11 border-2 focus:border-primary transition-colors"
                />
                {search !== debouncedSearch ? (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : search ? (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                    type="button"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px] h-11 border-2 focus:border-primary transition-colors">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {/* Search Results Info */}
        {debouncedSearch && (
          <div className="text-sm text-muted-foreground">
            {data?.data?.length === 0 ? (
              <span>No jobs found for "{debouncedSearch}"</span>
            ) : (
              <span>
                {data?.data?.length || 0} job{(data?.data?.length || 0) !== 1 ? 's' : ''} found for "{debouncedSearch}"
              </span>
            )}
          </div>
        )}

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={data?.data?.map((j: Job) => j.id) || []} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {data?.data?.map((job: Job) => (
                <SortableJobCard key={job.id} job={job} onArchiveToggle={handleArchiveToggle} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {page} of {data.pagination.totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= data.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
