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
      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Jobs
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">Manage your open positions and hiring pipeline</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all w-full sm:w-auto"
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
