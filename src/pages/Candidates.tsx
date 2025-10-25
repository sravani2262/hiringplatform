import { Layout } from '@/components/Layout';
import { CandidatesList } from '@/components/candidates/CandidatesList';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KanbanBoard } from '@/components/candidates/KanbanBoard';

export default function Candidates() {
  const [view, setView] = useState<'list' | 'kanban'>('list');

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Candidates</h1>
          <p className="text-muted-foreground">Track and manage applicants through your hiring pipeline</p>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as 'list' | 'kanban')} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-0">
            <CandidatesList />
          </TabsContent>
          
          <TabsContent value="kanban" className="mt-0">
            <KanbanBoard />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
