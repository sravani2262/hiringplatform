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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 container-responsive animate-fade-in">
        {/* Enhanced Header Section */}
        <div className="relative mb-16 text-center pt-8">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-radial from-primary/8 via-accent/4 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/15 to-accent/15 rounded-full blur-3xl opacity-30" />
          
          {/* Header content */}
          <div className="relative mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">Job Management Hub</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 gradient-text-rainbow tracking-tight">
              Job Positions
            </h1>
            
            <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              Create, manage, and track your open positions with intelligent hiring tools
            </p>
            
            {/* Action Button */}
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="group relative gap-3 px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:shadow-primary/30 hover:-translate-y-2 transition-all duration-300 bg-gradient-to-r from-primary via-primary to-accent border-none"
              size="lg"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Plus className="h-6 w-6 group-hover:rotate-180 transition-transform duration-300" />
              <span className="relative">Create New Job</span>
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
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
