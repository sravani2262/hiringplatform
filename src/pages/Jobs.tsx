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
      <div className="min-h-screen bg-white container-responsive">
        {/* Header Section */}
        <div className="mb-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Job Positions
              </h1>
              <p className="text-gray-600">
                Create, manage, and track your open positions
              </p>
            </div>
            
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Job
            </Button>
          </div>
        </div>

        {/* Enhanced Jobs List */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent pointer-events-none rounded-3xl" />
          <JobsList />
        </div>
        
        <JobModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
        />
      </div>
    </Layout>
  );
}
