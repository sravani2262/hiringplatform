import { Layout } from '@/components/Layout';
import { JobsList } from '@/components/jobs/JobsList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { JobModal } from '@/components/jobs/JobModal';

export default function Jobs() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout>
      <div className="p-8 animate-fade-in">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Jobs
            </h1>
            <p className="text-muted-foreground text-lg">Manage your open positions and hiring pipeline</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            New Job
          </Button>
        </div>

        <JobsList />
        
        <JobModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
        />
      </div>
    </Layout>
  );
}
