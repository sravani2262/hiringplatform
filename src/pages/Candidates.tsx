import { Layout } from '@/components/Layout';
import { CandidatesList } from '@/components/candidates/CandidatesList';
import { useState } from 'react';
import { KanbanBoard } from '@/components/candidates/KanbanBoard';
import { List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CandidatesErrorBoundary } from '@/components/candidates/CandidatesErrorBoundary';

export default function Candidates() {
  const [view, setView] = useState<'list' | 'kanban'>('list');

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 container-responsive">
        {/* Enhanced Header Section */}
        <div className="relative mb-16 text-center pt-8">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-radial from-accent/8 via-primary/4 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-3xl opacity-30" />
          
          {/* Header content */}
          <div className="relative mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-accent/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">Talent Pipeline</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 gradient-text-rainbow tracking-tight">
              Candidates
            </h1>
            
            <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              Track, evaluate, and manage candidates through your intelligent hiring pipeline
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>

        {/* Enhanced Custom Tabs */}
        <div className="relative">
          {/* Premium Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg">
              <Button
                onClick={() => setView('list')}
                className={cn(
                  "relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 border-none",
                  view === 'list'
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                    : "bg-transparent text-slate-600 hover:bg-slate-100"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <List className="w-4 h-4" />
                  List View
                </span>
              </Button>
              <Button
                onClick={() => setView('kanban')}
                className={cn(
                  "relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 border-none",
                  view === 'kanban'
                    ? "bg-gradient-to-r from-accent to-primary text-white shadow-lg"
                    : "bg-transparent text-slate-600 hover:bg-slate-100"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" />
                  Kanban Board
                </span>
              </Button>
            </div>
          </div>
          
          {/* Tab Content with enhanced styling */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent pointer-events-none rounded-3xl" />
            
            {view === 'list' && (
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                <CandidatesErrorBoundary>
                  <CandidatesList />
                </CandidatesErrorBoundary>
              </div>
            )}
            
            {view === 'kanban' && (
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                <CandidatesErrorBoundary>
                  <KanbanBoard />
                </CandidatesErrorBoundary>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
