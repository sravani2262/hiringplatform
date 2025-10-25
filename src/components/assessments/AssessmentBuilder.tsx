import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Job } from '@/lib/db';
import { FileQuestion, Plus, Edit, Save, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AssessmentBuilderProps {
  job: Job;
  hasAssessment?: boolean;
}

export function AssessmentBuilder({ job, hasAssessment = false }: AssessmentBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [assessment, setAssessment] = useState({
    title: `${job.title} Assessment`,
    description: 'Complete this assessment to proceed with your application.',
    sections: [
      {
        id: 'section-1',
        title: 'Technical Skills',
        questions: [
          {
            id: 'q-1',
            type: 'single-choice',
            text: 'What is your experience with React?',
            options: ['Less than 1 year', '1-3 years', '3+ years'],
            required: true
          },
          {
            id: 'q-2',
            type: 'short-text',
            text: 'Describe your experience with TypeScript',
            required: true
          }
        ]
      }
    ]
  });

  const handleSaveAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessment)
      });

      if (response.ok) {
        toast.success('Assessment saved successfully!');
        setIsOpen(false);
      } else {
        toast.error('Failed to save assessment');
      }
    } catch (error) {
      toast.error('Error saving assessment');
    }
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion = {
      id: `q-${Date.now()}`,
      type: 'short-text',
      text: 'New question',
      required: false
    };

    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    }));
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: any) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(q =>
                q.id === questionId ? { ...q, ...updates } : q
              )
            }
          : section
      )
    }));
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
          : section
      )
    }));
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              <span>{hasAssessment ? 'Assessment Exists' : 'No Assessment Yet'}</span>
            </CardDescription>
          </div>
          <Badge>{job.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2">
              {hasAssessment ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Assessment
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Assessment
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Assessment Builder - {job.title}</span>
                <div className="flex gap-2">
                  <Button onClick={handleSaveAssessment} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Assessment
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Builder Pane */}
              <div className="space-y-4 border-r pr-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Assessment Details</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Assessment Title</Label>
                      <Input
                        id="title"
                        value={assessment.title}
                        onChange={(e) => setAssessment(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={assessment.description}
                        onChange={(e) => setAssessment(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Sections & Questions</h3>
                  {assessment.sections.map((section) => (
                    <Card key={section.id} className="p-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`section-${section.id}`}>Section Title</Label>
                          <Input
                            id={`section-${section.id}`}
                            value={section.title}
                            onChange={(e) => setAssessment(prev => ({
                              ...prev,
                              sections: prev.sections.map(s =>
                                s.id === section.id ? { ...s, title: e.target.value } : s
                              )
                            }))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Questions</h4>
                            <Button
                              size="sm"
                              onClick={() => addQuestion(section.id)}
                              className="gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              Add Question
                            </Button>
                          </div>
                          
                          {section.questions.map((question) => (
                            <div key={question.id} className="border rounded p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium">Question Text</Label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteQuestion(section.id, question.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <Input
                                value={question.text}
                                onChange={(e) => updateQuestion(section.id, question.id, { text: e.target.value })}
                                className="text-sm"
                              />
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Label className="text-xs">Type:</Label>
                                  <select
                                    value={question.type}
                                    onChange={(e) => updateQuestion(section.id, question.id, { type: e.target.value })}
                                    className="text-xs border rounded px-2 py-1"
                                  >
                                    <option value="short-text">Short Answer</option>
                                    <option value="long-text">Long Answer</option>
                                    <option value="single-choice">Multiple Choice</option>
                                    <option value="numeric">Numeric</option>
                                  </select>
                                </div>
                                <label className="flex items-center gap-1 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={question.required}
                                    onChange={(e) => updateQuestion(section.id, question.id, { required: e.target.checked })}
                                  />
                                  Required
                                </label>
                              </div>
                              
                              {question.type === 'single-choice' && (
                                <div className="space-y-1">
                                  <Label className="text-xs">Options:</Label>
                                  {question.options?.map((option, index) => (
                                    <Input
                                      key={index}
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...(question.options || [])];
                                        newOptions[index] = e.target.value;
                                        updateQuestion(section.id, question.id, { options: newOptions });
                                      }}
                                      className="text-xs"
                                      placeholder={`Option ${index + 1}`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
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
                      <h2 className="text-2xl font-bold mb-2">{assessment.title}</h2>
                      <p className="text-muted-foreground">
                        {assessment.description}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {assessment.sections.map((section) => (
                        <div key={section.id} className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-2">{section.title}</h3>
                          <div className="space-y-3">
                            {section.questions.map((question) => (
                              <div key={question.id} className="border-l-4 border-primary pl-3">
                                <p className="text-sm font-medium">
                                  {question.text}
                                  {question.required && <span className="text-red-500 ml-1">*</span>}
                                </p>
                                {question.type === 'single-choice' && (
                                  <div className="mt-2 space-y-1">
                                    {question.options?.map((option, index) => (
                                      <label key={index} className="flex items-center text-sm">
                                        <input type="radio" className="mr-2" />
                                        {option}
                                      </label>
                                    ))}
                                  </div>
                                )}
                                {question.type === 'short-text' && (
                                  <input 
                                    type="text" 
                                    className="mt-2 w-full p-2 border rounded text-sm"
                                    placeholder="Enter your answer..."
                                  />
                                )}
                                {question.type === 'long-text' && (
                                  <textarea 
                                    className="mt-2 w-full p-2 border rounded text-sm"
                                    rows={3}
                                    placeholder="Enter your detailed answer..."
                                  />
                                )}
                                {question.type === 'numeric' && (
                                  <input 
                                    type="number" 
                                    className="mt-2 w-full p-2 border rounded text-sm"
                                    placeholder="Enter a number..."
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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
