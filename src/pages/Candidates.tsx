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
      <div className="min-h-screen bg-white container-responsive">
        {/* Header Section */}
        <div className="mb-6 pt-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Candidates
            </h1>
            <p className="text-gray-600">
              Track, evaluate, and manage candidates through your hiring pipeline
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex items-center gap-2 border-b border-gray-200">
            <Button
              onClick={() => setView('list')}
              variant={view === 'list' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              List View
            </Button>
            <Button
              onClick={() => setView('kanban')}
              variant={view === 'kanban' ? 'default' : 'ghost'}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              Kanban Board
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {view === 'list' && (
            <CandidatesErrorBoundary>
              <CandidatesList />
            </CandidatesErrorBoundary>
          )}
          
          {view === 'kanban' && (
            <CandidatesErrorBoundary>
              <KanbanBoard />
            </CandidatesErrorBoundary>
          )}
        </div>
      </div>
    </Layout>
  );
}
