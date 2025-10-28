import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Candidate, CandidateStage } from '@/lib/db';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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
  const [dragStartTime, setDragStartTime] = useState<number | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const handleMouseDown = () => {
    setDragStartTime(Date.now());
  };

  const handleClick = (e: React.MouseEvent) => {
    // If this was a drag operation (mouse was down for more than 200ms), prevent navigation
    if (dragStartTime && Date.now() - dragStartTime > 200) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDragStartTime(null);
  };

  return (
    <div className="mb-4">
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onMouseDown={handleMouseDown}
        className="cursor-grab active:cursor-grabbing bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors rounded-lg shadow-sm hover:shadow-md group"
      >
        <Link 
          to={`/candidates/${candidate.id}`} 
          onClick={handleClick}
          className="block"
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header with avatar and name */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                    {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 group-hover:text-blue-900 truncate transition-colors">
                    {candidate.name}
                  </h4>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex items-center gap-2 text-xs text-gray-600 group-hover:text-blue-600 transition-colors">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{candidate.email}</span>
              </div>
              
              {/* Date */}
              <div className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors">
                Applied: {new Date(candidate.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              
              {/* Click indicator */}
              <div className="text-xs text-gray-400 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view details • Drag to move
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}

function StageColumn({ stage, candidates }: { stage: typeof STAGES[0]; candidates: Candidate[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.value,
  });

  return (
    <div className="flex flex-col h-full">
      <Card 
        ref={setNodeRef}
        className={cn(
          "flex flex-col h-[calc(100vh-200px)] min-h-[500px] bg-white border border-gray-200 rounded-lg transition-colors",
          isOver && "border-blue-300 bg-blue-50/30"
        )}
      >
        {/* Header */}
        <CardHeader className="pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', stage.color)} />
              <CardTitle className="text-sm font-semibold text-gray-900">
                {stage.label}
              </CardTitle>
            </div>
            
            <Badge variant="secondary" className="text-xs">
              {candidates.length}
            </Badge>
          </div>
        </CardHeader>
        
        {/* Content Area */}
        <CardContent className="flex-1 p-4 overflow-hidden flex flex-col min-h-0">
          <SortableContext items={candidates.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="flex-1 overflow-y-auto min-h-[100px]">
              {candidates.length === 0 ? (
                <div className={cn(
                  "flex flex-col items-center justify-center h-32 text-center transition-colors",
                  isOver && "text-blue-600"
                )}>
                  <Users className="w-8 h-8 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-500 mb-1">
                    No candidates
                  </div>
                  <div className="text-xs text-gray-400">
                    Drag candidates here
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

    let targetStage: CandidateStage | null = null;

    // Check if dropped on a stage column directly
    if (STAGES.some(stage => stage.value === over.id)) {
      targetStage = over.id as CandidateStage;
    } else {
      // Check if dropped on a candidate card - find which stage that candidate belongs to
      const overCandidate = data?.data?.find((c: Candidate) => c.id === over.id);
      if (overCandidate) {
        targetStage = overCandidate.stage;
      }
    }

    // Update candidate stage if different from current
    if (targetStage && targetStage !== activeCandidate.stage) {
      updateStageMutation.mutate({
        id: activeCandidate.id,
        stage: targetStage,
      });
    }
  };

  const handleDragOver = (event: any) => {
    // Remove optimistic updates during drag over to prevent conflicts
    // Only update on drag end for better UX
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
      {/* Header with stats */}
      <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Candidate Pipeline</h2>
            <p className="text-sm text-gray-600">Track and manage candidates through your hiring process</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-semibold text-gray-900">{data?.data?.length || 0}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-green-600">
                {candidatesByStage['hired']?.length || 0}
              </div>
              <div className="text-xs text-gray-500">Hired</div>
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
        {/* Kanban columns container */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
            {STAGES.map((stage) => (
              <div key={stage.value} id={stage.value} className="w-full h-full">
                <SortableContext 
                  items={candidatesByStage[stage.value].map((c) => c.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  <StageColumn stage={stage} candidates={candidatesByStage[stage.value]} />
                </SortableContext>
              </div>
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
