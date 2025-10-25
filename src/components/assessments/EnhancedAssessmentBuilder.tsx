import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Save, 
  Trash2, 
  GripVertical, 
  Eye, 
  Settings, 
  Copy,
  Move,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  FileQuestion,
  Hash,
  Type,
  List,
  CheckSquare,
  Upload,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Assessment, 
  Section, 
  Question, 
  QuestionType, 
  QUESTION_TYPE_CONFIG,
  AssessmentBuilderState 
} from '@/types/assessment';
import { 
  AssessmentBuilderUtils, 
  LocalStorageUtils, 
  ValidationUtils,
  ConditionalUtils 
} from '@/utils/assessment';
import { QuestionRenderer, ValidationRuleEditor } from './QuestionRenderer';
import { ConditionalRuleEditor } from './ConditionalRuleEditor';

interface EnhancedAssessmentBuilderProps {
  job: any;
  hasAssessment?: boolean;
  onSave?: (assessment: Assessment) => void;
}

// Function to create sample assessment data
const createSampleAssessment = (jobId: string, jobTitle: string): Assessment => {
  return {
    id: AssessmentBuilderUtils.generateId(),
    jobId,
    title: `${jobTitle} Assessment`,
    description: 'Complete this comprehensive assessment to demonstrate your skills and qualifications for this position.',
    sections: [
      {
        id: AssessmentBuilderUtils.generateId(),
        title: 'Technical Skills',
        description: 'Questions about your technical background and experience',
        order: 0,
        questions: [
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'single-choice',
            text: 'What is your experience level with the primary technologies for this role?',
            description: 'Select the option that best describes your experience level',
            options: ['Beginner (0-1 years)', 'Intermediate (1-3 years)', 'Advanced (3-5 years)', 'Expert (5+ years)'],
            validation: { required: true },
            order: 0,
          },
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'multi-choice',
            text: 'Which of the following technologies/tools are you familiar with?',
            description: 'Select all that apply to your experience',
            options: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Git', 'Agile/Scrum'],
            validation: { required: true, minLength: 2 },
            order: 1,
          },
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'short-text',
            text: 'Describe your experience with version control systems',
            description: 'Briefly explain your familiarity with Git or other version control tools',
            validation: { required: true, maxLength: 150 },
            order: 2,
          },
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'long-text',
            text: 'Explain a challenging technical problem you solved recently',
            description: 'Provide details about the problem, your approach, and the solution',
            validation: { required: true, minLength: 100 },
            order: 3,
          },
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'numeric',
            text: 'How many years of professional experience do you have in this field?',
            description: 'Enter the number of years',
            validation: { required: true, min: 0, max: 20 },
            order: 4,
          },
        ],
      },
      {
        id: AssessmentBuilderUtils.generateId(),
        title: 'Problem Solving & Critical Thinking',
        description: 'Scenario-based questions to assess your problem-solving approach',
        order: 1,
        questions: [
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'single-choice',
            text: 'How do you typically approach debugging a complex issue?',
            description: 'Select your preferred debugging methodology',
            options: [
              'Start with console.log statements and work through the code',
              'Use browser dev tools and set breakpoints',
              'Write unit tests to isolate the problem',
              'Ask team members for help immediately',
            ],
            validation: { required: true },
            order: 0,
          },
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'long-text',
            text: 'Describe a time when you had to learn a new technology quickly for a project',
            description: 'Explain your learning process and how you applied the new knowledge',
            validation: { required: true, minLength: 120 },
            order: 1,
          },
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'single-choice',
            text: 'When working on a team project, how do you prefer to handle code reviews?',
            description: 'Select your preferred approach to code collaboration',
            options: [
              'Submit small, frequent pull requests for quick feedback',
              'Complete large features before requesting review',
              'Pair program with team members',
              'Use automated testing to validate changes',
            ],
            validation: { required: true },
            order: 2,
          },
        ],
      },
      {
        id: AssessmentBuilderUtils.generateId(),
        title: 'Communication & Collaboration',
        description: 'Questions about your communication style and teamwork experience',
        order: 2,
        questions: [
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'long-text',
            text: 'Describe your experience working in a team environment',
            description: 'Include examples of successful collaboration and any challenges you faced',
            validation: { required: true, minLength: 100 },
            order: 0,
          },
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'short-text',
            text: 'How do you prefer to communicate technical concepts to non-technical stakeholders?',
            description: 'Briefly describe your approach to technical communication',
            validation: { required: true, maxLength: 200 },
            order: 1,
          },
          {
            id: AssessmentBuilderUtils.generateId(),
            type: 'file-upload',
            text: 'Upload your portfolio, GitHub profile, or any relevant work samples',
            description: 'Upload a PDF, link to your GitHub, or other relevant materials',
            validation: { required: false },
            order: 2,
          },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  };
};

export function EnhancedAssessmentBuilder({ 
  job, 
  hasAssessment = false, 
  onSave 
}: EnhancedAssessmentBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [builderState, setBuilderState] = useState<AssessmentBuilderState>({
    assessment: createSampleAssessment(job.id, job.title),
    selectedSection: undefined,
    selectedQuestion: undefined,
    previewMode: false,
    unsavedChanges: false,
  });

  const [draggedItem, setDraggedItem] = useState<{ type: 'section' | 'question', id: string } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Load saved state on mount or create sample data
  useEffect(() => {
    const savedState = LocalStorageUtils.loadBuilderState();
    if (savedState && savedState.assessment?.jobId === job.id) {
      setBuilderState(savedState);
      // Expand all sections by default
      setExpandedSections(new Set(savedState.assessment.sections.map((s: Section) => s.id)));
    } else {
      // Create sample assessment with expanded sections
      const sampleAssessment = createSampleAssessment(job.id, job.title);
      setExpandedSections(new Set(sampleAssessment.sections.map(s => s.id)));
    }
  }, [job.id]);

  // Save state to localStorage on changes
  useEffect(() => {
    if (builderState.unsavedChanges) {
      LocalStorageUtils.saveBuilderState(builderState);
    }
  }, [builderState]);

  const updateAssessment = useCallback((updates: Partial<Assessment>) => {
    setBuilderState(prev => ({
      ...prev,
      assessment: { ...prev.assessment, ...updates, updatedAt: new Date().toISOString() },
      unsavedChanges: true,
    }));
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<Section>) => {
    setBuilderState(prev => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        sections: prev.assessment.sections.map(section =>
          section.id === sectionId ? { ...section, ...updates } : section
        ),
        updatedAt: new Date().toISOString(),
      },
      unsavedChanges: true,
    }));
  }, []);

  const updateQuestion = useCallback((sectionId: string, questionId: string, updates: Partial<Question>) => {
    setBuilderState(prev => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        sections: prev.assessment.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                questions: section.questions.map(q =>
                  q.id === questionId ? { ...q, ...updates } : q
                ),
              }
            : section
        ),
        updatedAt: new Date().toISOString(),
      },
      unsavedChanges: true,
    }));
  }, []);

  const addSection = () => {
    const newSection = AssessmentBuilderUtils.createEmptySection();
    const reorderedSections = AssessmentBuilderUtils.reorderItems([
      ...builderState.assessment.sections,
      { ...newSection, order: builderState.assessment.sections.length }
    ]);
    
    updateAssessment({ sections: reorderedSections });
    setExpandedSections(prev => new Set([...prev, newSection.id]));
  };

  const addQuestion = (sectionId: string, type: QuestionType = 'short-text') => {
    const section = builderState.assessment.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newQuestion = AssessmentBuilderUtils.createEmptyQuestion(type);
    const reorderedQuestions = AssessmentBuilderUtils.reorderItems([
      ...section.questions,
      { ...newQuestion, order: section.questions.length }
    ]);

    updateSection(sectionId, { questions: reorderedQuestions });
  };

  const deleteSection = (sectionId: string) => {
    const newSections = builderState.assessment.sections.filter(s => s.id !== sectionId);
    const reorderedSections = AssessmentBuilderUtils.reorderItems(newSections);
    updateAssessment({ sections: reorderedSections });
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    const section = builderState.assessment.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newQuestions = section.questions.filter(q => q.id !== questionId);
    const reorderedQuestions = AssessmentBuilderUtils.reorderItems(newQuestions);
    updateSection(sectionId, { questions: reorderedQuestions });
  };

  const duplicateQuestion = (sectionId: string, questionId: string) => {
    const section = builderState.assessment.sections.find(s => s.id === sectionId);
    if (!section) return;

    const question = section.questions.find(q => q.id === questionId);
    if (!question) return;

    const duplicatedQuestion = {
      ...question,
      id: AssessmentBuilderUtils.generateId(),
      text: `${question.text} (Copy)`,
      order: section.questions.length,
    };

    const reorderedQuestions = AssessmentBuilderUtils.reorderItems([
      ...section.questions,
      duplicatedQuestion
    ]);

    updateSection(sectionId, { questions: reorderedQuestions });
  };

  const moveQuestion = (fromSectionId: string, toSectionId: string, questionId: string) => {
    const fromSection = builderState.assessment.sections.find(s => s.id === fromSectionId);
    const toSection = builderState.assessment.sections.find(s => s.id === toSectionId);
    
    if (!fromSection || !toSection) return;

    const question = fromSection.questions.find(q => q.id === questionId);
    if (!question) return;

    // Remove from source section
    const fromQuestions = fromSection.questions.filter(q => q.id !== questionId);
    const reorderedFromQuestions = AssessmentBuilderUtils.reorderItems(fromQuestions);

    // Add to target section
    const toQuestions = [...toSection.questions, { ...question, order: toSection.questions.length }];
    const reorderedToQuestions = AssessmentBuilderUtils.reorderItems(toQuestions);

    updateAssessment({
      sections: builderState.assessment.sections.map(section => {
        if (section.id === fromSectionId) {
          return { ...section, questions: reorderedFromQuestions };
        }
        if (section.id === toSectionId) {
          return { ...section, questions: reorderedToQuestions };
        }
        return section;
      })
    });
  };

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleSaveAssessment = async () => {
    try {
      const response = await fetch(`/api/assessments/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(builderState.assessment)
      });

      if (response.ok) {
        toast.success('Assessment saved successfully!');
        setBuilderState(prev => ({ ...prev, unsavedChanges: false }));
        LocalStorageUtils.clearBuilderState();
        setIsOpen(false);
        onSave?.(builderState.assessment);
      } else {
        toast.error('Failed to save assessment');
      }
    } catch (error) {
      toast.error('Error saving assessment');
    }
  };

  const resetToSample = () => {
    const sampleAssessment = createSampleAssessment(job.id, job.title);
    setBuilderState({
      assessment: sampleAssessment,
      selectedSection: undefined,
      selectedQuestion: undefined,
      previewMode: false,
      unsavedChanges: true,
    });
    setExpandedSections(new Set(sampleAssessment.sections.map(s => s.id)));
    toast.success('Reset to sample assessment');
  };

  const getQuestionTypeIcon = (type: QuestionType) => {
    switch (type) {
      case 'single-choice': return <List className="h-4 w-4" />;
      case 'multi-choice': return <CheckSquare className="h-4 w-4" />;
      case 'short-text': return <Type className="h-4 w-4" />;
      case 'long-text': return <FileQuestion className="h-4 w-4" />;
      case 'numeric': return <Hash className="h-4 w-4" />;
      case 'file-upload': return <Upload className="h-4 w-4" />;
      default: return <FileQuestion className="h-4 w-4" />;
    }
  };

  const renderBuilderPane = () => (
    <div className="space-y-6">
      {/* Assessment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assessment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Assessment Title</Label>
            <Input
              id="title"
              value={builderState.assessment.title}
              onChange={(e) => updateAssessment({ title: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={builderState.assessment.description}
              onChange={(e) => updateAssessment({ description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Sections & Questions</CardTitle>
            <Button onClick={addSection} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {builderState.assessment.sections.map((section, sectionIndex) => (
            <Card key={section.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSectionExpansion(section.id)}
                      className="h-6 w-6 p-0"
                    >
                      {expandedSections.has(section.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1">
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        className="font-semibold border-0 p-0 h-auto"
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                        </Badge>
                        {section.questions.some(q => q.validation?.required) && (
                          <Badge variant="secondary" className="text-xs">
                            Has Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addQuestion(section.id)}
                      className="gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Question
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSection(section.id)}
                      className="h-8 w-8 p-0 text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedSections.has(section.id) && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {section.questions.map((question, questionIndex) => (
                      <Card key={question.id} className="border border-muted">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 flex-1">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                {getQuestionTypeIcon(question.type)}
                                <div className="flex-1">
                                  <Input
                                    value={question.text}
                                    onChange={(e) => updateQuestion(section.id, question.id, { text: e.target.value })}
                                    placeholder="Question text..."
                                    className="border-0 p-0 h-auto font-medium"
                                  />
                                  {question.description && (
                                    <Input
                                      value={question.description}
                                      onChange={(e) => updateQuestion(section.id, question.id, { description: e.target.value })}
                                      placeholder="Question description (optional)..."
                                      className="border-0 p-0 h-auto text-sm text-muted-foreground mt-1"
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Select
                                  value={question.type}
                                  onValueChange={(value: QuestionType) => updateQuestion(section.id, question.id, { type: value })}
                                >
                                  <SelectTrigger className="w-32 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(QUESTION_TYPE_CONFIG).map(([type, config]) => (
                                      <SelectItem key={type} value={type}>
                                        <div className="flex items-center gap-2">
                                          <span>{config.icon}</span>
                                          <span>{config.label}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => duplicateQuestion(section.id, question.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteQuestion(section.id, question.id)}
                                  className="h-8 w-8 p-0 text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Question Options */}
                            {question.type === 'single-choice' || question.type === 'multi-choice' ? (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Options</Label>
                                {question.options?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center gap-2">
                                    <Input
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...(question.options || [])];
                                        newOptions[optionIndex] = e.target.value;
                                        updateQuestion(section.id, question.id, { options: newOptions });
                                      }}
                                      placeholder={`Option ${optionIndex + 1}`}
                                      className="text-sm"
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const newOptions = question.options?.filter((_, i) => i !== optionIndex) || [];
                                        updateQuestion(section.id, question.id, { options: newOptions });
                                      }}
                                      className="h-8 w-8 p-0 text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
                                    updateQuestion(section.id, question.id, { options: newOptions });
                                  }}
                                  className="gap-1"
                                >
                                  <Plus className="h-3 w-3" />
                                  Add Option
                                </Button>
                              </div>
                            ) : null}

                            {/* Validation Rules */}
                            <ValidationRuleEditor
                              question={question}
                              onValidationChange={(validation) => updateQuestion(section.id, question.id, { validation })}
                            />

                            {/* Conditional Logic */}
                            <ConditionalRuleEditor
                              question={question}
                              assessment={builderState.assessment}
                              onConditionalChange={(conditional) => updateQuestion(section.id, question.id, { conditional })}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderPreviewPane = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Live Preview</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Eye className="h-3 w-3" />
            Preview Mode
          </Badge>
        </div>
      </div>
      
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{builderState.assessment.title}</h2>
            <p className="text-muted-foreground">{builderState.assessment.description}</p>
          </div>
          
          <div className="space-y-6">
            {builderState.assessment.sections.map((section) => (
              <div key={section.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4 text-lg">{section.title}</h3>
                <div className="space-y-4">
                  {section.questions.map((question) => (
                    <QuestionRenderer
                      key={question.id}
                      question={question}
                      isPreview={true}
                      onChange={() => {}} // No-op in preview
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg mb-1">{job.title}</CardTitle>
            <div className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              <span>{hasAssessment ? 'Assessment Exists' : 'No Assessment Yet'}</span>
            </div>
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
                  <Settings className="h-4 w-4" />
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
          <DialogContent className="max-w-7xl max-h-[95vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Assessment Builder - {job.title}</span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setBuilderState(prev => ({ ...prev, previewMode: !prev.previewMode }))}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {builderState.previewMode ? 'Builder' : 'Preview'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetToSample}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset to Sample
                  </Button>
                  <Button onClick={handleSaveAssessment} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Assessment
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              {builderState.previewMode ? renderPreviewPane() : renderBuilderPane()}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
