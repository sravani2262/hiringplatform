import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Candidate, CandidateStage } from '@/lib/db';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-all duration-200 mb-2 group hover:scale-105"
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary">
              {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{candidate.name}</h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{candidate.email}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {new Date(candidate.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StageColumn({ stage, candidates }: { stage: typeof STAGES[0]; candidates: Candidate[] }) {
  return (
    <div className="flex-1 min-w-[280px]">
      <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-colors">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">{stage.label}</CardTitle>
            <Badge className={stage.color} variant="default">
              {candidates.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="max-h-[calc(100vh-300px)] overflow-y-auto p-4">
          <SortableContext items={candidates.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {candidates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-sm">No candidates in this stage</div>
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
      const res = await fetch('/api/candidates?pageSize=1000');
      if (!res.ok) throw new Error('Failed to fetch candidates');
      return res.json();
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
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div key={stage.value} className="flex-1 min-w-[280px]">
            <Card className="h-[600px] animate-pulse bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  const activeCandidate = data?.data?.find((c: Candidate) => c.id === activeId);

  return (
    <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <SortableContext key={stage.value} items={[stage.value, ...candidatesByStage[stage.value].map((c) => c.id)]} strategy={verticalListSortingStrategy}>
            <div id={stage.value} className="flex-1 min-w-[280px]">
              <StageColumn stage={stage} candidates={candidatesByStage[stage.value]} />
            </div>
          </SortableContext>
        ))}
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
  );
}
