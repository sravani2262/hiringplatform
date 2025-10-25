import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, GripVertical, Archive, Edit } from 'lucide-react';
import { Job } from '@/lib/db';
import { Link } from 'react-router-dom';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

function SortableJobCard({ job }: { job: Job }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
              className="cursor-grab hover:text-primary active:cursor-grabbing transition-colors"
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
          <Button size="sm" variant="outline" className="hover:border-primary hover:text-primary transition-colors">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="outline" className="hover:border-primary hover:text-primary transition-colors">
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
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', search, status, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        search,
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
      await queryClient.cancelQueries({ queryKey: ['jobs'] });
      const previousData = queryClient.getQueryData(['jobs', search, status, page]);
      
      queryClient.setQueryData(['jobs', search, status, page], (old: any) => {
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
        queryClient.setQueryData(['jobs', search, status, page], context.previousData);
      }
      toast.error('Failed to reorder jobs. Please try again.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Jobs reordered successfully');
    },
  });

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
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 border-2 focus:border-primary transition-colors"
                />
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
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data?.data?.map((j: Job) => j.id) || []} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {data?.data?.map((job: Job) => (
              <SortableJobCard key={job.id} job={job} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
