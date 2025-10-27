import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Candidate, CandidateStage } from '@/lib/db';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGES: { value: CandidateStage; label: string; color: string }[] = [
  { value: 'applied', label: 'Applied', color: 'bg-status-applied' },
  { value: 'screen', label: 'Screening', color: 'bg-status-screen' },
  { value: 'tech', label: 'Technical', color: 'bg-status-tech' },
  { value: 'offer', label: 'Offer', color: 'bg-status-offer' },
  { value: 'hired', label: 'Hired', color: 'bg-status-hired' },
  { value: 'rejected', label: 'Rejected', color: 'bg-status-rejected' },
];

function SortableCandidateCard({ candidate }: { candidate: Candidate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing hover-lift-sm transition-all duration-300 mb-3 group border-none shadow-md hover:shadow-xl bg-white/90 backdrop-blur-sm rounded-xl"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="p-3 relative">
        <div className="space-y-3">
          {/* Header with avatar and name */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-xs font-bold text-primary">
                  {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              {/* Status indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white shadow-sm" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm group-hover:text-primary transition-colors duration-300 text-slate-800 truncate">
                {candidate.name}
              </h4>
            </div>
          </div>
          
          {/* Email */}
          <div className="bg-slate-50 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{candidate.email}</span>
            </div>
          </div>
          
          {/* Footer with date */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-500 font-medium">
              {new Date(candidate.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            
            {/* Priority indicator */}
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
            </div>
          </div>
        </div>
        
        {/* Drag indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-1">
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
            <div className="w-1 h-1 bg-slate-400 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StageColumn({ stage, candidates }: { stage: typeof STAGES[0]; candidates: Candidate[] }) {
  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col h-[calc(100vh-250px)] min-h-[600px] border-none shadow-xl bg-gradient-to-b from-white via-slate-50/50 to-white hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
        {/* Enhanced Header - Fixed height */}
        <CardHeader className="pb-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-white relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50" />
          
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2 min-w-0">
              <div className={cn('w-3 h-3 rounded-full shadow-sm flex-shrink-0', stage.color)} />
              <CardTitle className="text-sm font-bold text-slate-800 truncate">
                {stage.label}
              </CardTitle>
            </div>
            
            {/* Enhanced count badge */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge 
                className={cn(
                  'px-3 py-1 rounded-full font-bold text-white shadow-lg border-none text-xs',
                  stage.color
                )}
              >
                {candidates.length}
              </Badge>
              
              {/* Progress indicator */}
              <div className="w-2 h-8 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={cn('w-full rounded-full transition-all duration-500', stage.color)}
                  style={{ height: `${Math.min((candidates.length / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* Enhanced Content Area - Flexible height */}
        <CardContent className="flex-1 p-4 overflow-hidden flex flex-col min-h-0">
          <SortableContext items={candidates.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              {candidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  {/* Empty state illustration */}
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="text-sm font-medium text-slate-500 mb-2">
                    No candidates yet
                  </div>
                  <div className="text-xs text-slate-400 text-center">
                    Drag candidates here or add new ones
                  </div>
                </div>
              ) : (
                candidates.map((candidate) => (
                  <SortableCandidateCard key={candidate.id} candidate={candidate} />
                ))
              )}
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

export function KanbanBoard() {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/candidates?pageSize=1000');
        if (!res.ok) {
          // Return mock data if API fails
          return {
            data: [
              {
                id: '1',
                name: 'John Doe',
                email: 'john.doe@example.com',
                stage: 'applied',
                createdAt: new Date().toISOString(),
                jobId: 'job-1'
              },
              {
                id: '2',
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                stage: 'screen',
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                jobId: 'job-1'
              },
              {
                id: '3',
                name: 'Mike Johnson',
                email: 'mike.johnson@example.com',
                stage: 'tech',
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                jobId: 'job-2'
              },
              {
                id: '4',
                name: 'Sarah Wilson',
                email: 'sarah.wilson@example.com',
                stage: 'offer',
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                jobId: 'job-2'
              },
              {
                id: '5',
                name: 'David Brown',
                email: 'david.brown@example.com',
                stage: 'hired',
                createdAt: new Date(Date.now() - 345600000).toISOString(),
                jobId: 'job-3'
              }
            ]
          };
        }
        return res.json();
      } catch (error) {
        console.error('Candidates API error:', error);
        return {
          data: [
            {
              id: '1',
              name: 'John Doe',
              email: 'john.doe@example.com',
              stage: 'applied',
              createdAt: new Date().toISOString(),
              jobId: 'job-1'
            },
            {
              id: '2',
              name: 'Jane Smith',
              email: 'jane.smith@example.com',
              stage: 'screen',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              jobId: 'job-1'
            },
            {
              id: '3',
              name: 'Mike Johnson',
              email: 'mike.johnson@example.com',
              stage: 'tech',
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              jobId: 'job-2'
            },
            {
              id: '4',
              name: 'Sarah Wilson',
              email: 'sarah.wilson@example.com',
              stage: 'offer',
              createdAt: new Date(Date.now() - 259200000).toISOString(),
              jobId: 'job-2'
            },
            {
              id: '5',
              name: 'David Brown',
              email: 'david.brown@example.com',
              stage: 'hired',
              createdAt: new Date(Date.now() - 345600000).toISOString(),
              jobId: 'job-3'
            }
          ]
        };
      }
    },
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: CandidateStage }) => {
      const res = await fetch(`/api/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) throw new Error('Failed to update candidate');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast.success('Candidate stage updated');
    },
    onError: () => {
      toast.error('Failed to update candidate stage');
    },
  });

  const candidatesByStage = STAGES.reduce((acc, stage) => {
    acc[stage.value] = data?.data?.filter((c: Candidate) => c.stage === stage.value) || [];
    return acc;
  }, {} as Record<CandidateStage, Candidate[]>);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeCandidate = data?.data?.find((c: Candidate) => c.id === active.id);
    if (!activeCandidate) return;

    // Find which stage the candidate was dropped in
    const overStage = STAGES.find((stage) =>
      candidatesByStage[stage.value].some((c) => c.id === over.id)
    );

    // If dropped on a candidate card, use that candidate's stage
    if (overStage && overStage.value !== activeCandidate.stage) {
      updateStageMutation.mutate({
        id: activeCandidate.id,
        stage: overStage.value,
      });
    }
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeCandidate = data?.data?.find((c: Candidate) => c.id === active.id);
    if (!activeCandidate) return;

    // Check if dropped over a stage column
    const overStage = STAGES.find((stage) => over.id === stage.value);
    if (overStage && overStage.value !== activeCandidate.stage) {
      // Optimistically update
      queryClient.setQueryData(['candidates'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((c: Candidate) =>
            c.id === activeCandidate.id ? { ...c, stage: overStage.value } : c
          ),
        };
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
          {STAGES.map((stage) => (
            <div key={stage.value} className="w-full">
              <Card className="h-[calc(100vh-250px)] min-h-[600px] animate-pulse bg-gradient-to-b from-slate-100 to-slate-200 border-none rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activeCandidate = data?.data?.find((c: Candidate) => c.id === activeId);

  return (
    <div className="w-full">
      {/* Enhanced Header with stats */}
      <div className="mb-8 p-6 bg-gradient-to-r from-white via-slate-50 to-white rounded-3xl shadow-xl border border-slate-200/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-1">Candidate Pipeline</h2>
              <p className="text-slate-600">Track and manage candidates through your hiring process</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">{data?.data?.length || 0}</div>
              <div className="text-sm text-slate-500 font-medium">Total Candidates</div>
            </div>
            <div className="w-px h-12 bg-slate-300" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {candidatesByStage['hired']?.length || 0}
              </div>
              <div className="text-sm text-slate-500 font-medium">Successfully Hired</div>
            </div>
          </div>
        </div>
      </div>
      
      <DndContext 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd} 
        onDragOver={handleDragOver}
      >
        {/* Fixed alignment container with equal height columns */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
            {STAGES.map((stage) => (
              <SortableContext 
                key={stage.value} 
                items={[stage.value, ...candidatesByStage[stage.value].map((c) => c.id)]} 
                strategy={verticalListSortingStrategy}
              >
                <div id={stage.value} className="w-full h-full">
                  <StageColumn stage={stage} candidates={candidatesByStage[stage.value]} />
                </div>
              </SortableContext>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeCandidate ? (
            <Card className="cursor-grabbing shadow-lg">
              <CardContent className="p-3">
                <h4 className="font-semibold text-sm mb-1">{activeCandidate.name}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {activeCandidate.email}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
