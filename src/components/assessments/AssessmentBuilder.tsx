import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Job } from '@/lib/db';
import { FileQuestion, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AssessmentBuilderProps {
  job: Job;
}

export function AssessmentBuilder({ job }: AssessmentBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              <span>Job Assessment</span>
            </CardDescription>
          </div>
          <Badge>{job.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Create/Edit Assessment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Assessment Builder - {job.title}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Builder Pane */}
              <div className="space-y-4 border-r pr-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Builder</h3>
                  <p className="text-sm text-muted-foreground">
                    Add sections and questions to build your assessment.
                  </p>
                </div>
                
                <Card className="p-4">
                  <div className="space-y-4">
                    <div className="text-center text-muted-foreground">
                      <FileQuestion className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Assessment builder coming soon</p>
                      <p className="text-xs mt-1">
                        This will include drag-and-drop question building with validation rules
                      </p>
                    </div>
                    
                    {/* Basic Question Types */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Question Types</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 border rounded text-xs text-center">Multiple Choice</div>
                        <div className="p-2 border rounded text-xs text-center">Short Answer</div>
                        <div className="p-2 border rounded text-xs text-center">Long Answer</div>
                        <div className="p-2 border rounded text-xs text-center">File Upload</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Preview Pane */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    See how candidates will view this assessment.
                  </p>
                </div>
                
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{job.title} Assessment</h2>
                      <p className="text-muted-foreground">
                        Complete this assessment to proceed with your application.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Section 1: Technical Skills</h3>
                        <div className="space-y-3">
                          <div className="border-l-4 border-primary pl-3">
                            <p className="text-sm font-medium">What is your experience with React?</p>
                            <div className="mt-2 space-y-1">
                              <label className="flex items-center text-sm">
                                <input type="radio" className="mr-2" />
                                Less than 1 year
                              </label>
                              <label className="flex items-center text-sm">
                                <input type="radio" className="mr-2" />
                                1-3 years
                              </label>
                              <label className="flex items-center text-sm">
                                <input type="radio" className="mr-2" />
                                3+ years
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center text-muted-foreground py-4">
                        <p className="text-sm">Add questions to see preview</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
