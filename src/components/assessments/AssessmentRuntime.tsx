import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  Save,
  ArrowLeft,
  ArrowRight,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Assessment, 
  Question, 
  QuestionResponse, 
  AssessmentResponse 
} from '@/types/assessment';
import { 
  AssessmentBuilderUtils, 
  LocalStorageUtils, 
  ValidationUtils,
  ConditionalUtils 
} from '@/utils/assessment';
import { QuestionRenderer } from './QuestionRenderer';

interface AssessmentRuntimeProps {
  assessment: Assessment;
  candidateId?: string;
  candidateName?: string;
  candidateEmail?: string;
  onComplete?: (response: AssessmentResponse) => void;
  onSave?: (response: AssessmentResponse) => void;
}

export function AssessmentRuntime({ 
  assessment, 
  candidateId,
  candidateName,
  candidateEmail,
  onComplete,
  onSave 
}: AssessmentRuntimeProps) {
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [startTime] = useState(new Date().toISOString());

  // Load saved responses on mount
  useEffect(() => {
    const savedResponse = LocalStorageUtils.getResponse(assessment.id);
    if (savedResponse) {
      setResponses(savedResponse.responses);
      setCurrentSectionIndex(savedResponse.currentSectionIndex || 0);
    }
  }, [assessment.id]);

  // Save responses to localStorage periodically
  useEffect(() => {
    if (responses.length > 0) {
      const response: AssessmentResponse = {
        id: AssessmentBuilderUtils.generateId(),
        assessmentId: assessment.id,
        candidateId,
        candidateName,
        candidateEmail,
        responses,
        startedAt: startTime,
        status: 'in-progress',
        currentSectionIndex,
      };
      
      LocalStorageUtils.saveResponse(assessment.id, response);
    }
  }, [responses, currentSectionIndex, assessment.id, candidateId, candidateName, candidateEmail, startTime]);

  const updateResponse = (questionId: string, value: any) => {
    const existingResponseIndex = responses.findIndex(r => r.questionId === questionId);
    const newResponse: QuestionResponse = {
      questionId,
      value,
      timestamp: new Date().toISOString(),
    };

    if (existingResponseIndex >= 0) {
      setResponses(prev => prev.map((r, index) => 
        index === existingResponseIndex ? newResponse : r
      ));
    } else {
      setResponses(prev => [...prev, newResponse]);
    }

    // Clear validation errors for this question
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const validateCurrentSection = () => {
    const currentSection = assessment.sections[currentSectionIndex];
    const sectionErrors: Record<string, string[]> = {};

    currentSection.questions.forEach(question => {
      const response = responses.find(r => r.questionId === question.id);
      if (response) {
        const errors = ValidationUtils.validateQuestion(question, response);
        if (errors.length > 0) {
          sectionErrors[question.id] = errors;
        }
      } else if (question.validation?.required) {
        sectionErrors[question.id] = ['This field is required'];
      }
    });

    setValidationErrors(prev => ({ ...prev, ...sectionErrors }));
    return Object.keys(sectionErrors).length === 0;
  };

  const getVisibleQuestions = (section: any) => {
    return section.questions.filter((question: Question) => 
      ConditionalUtils.shouldShowQuestion(question, responses)
    );
  };

  const getProgress = () => {
    const totalQuestions = assessment.sections.reduce((total, section) => 
      total + getVisibleQuestions(section).length, 0
    );
    const answeredQuestions = responses.length;
    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  };

  const getSectionProgress = (sectionIndex: number) => {
    const section = assessment.sections[sectionIndex];
    const visibleQuestions = getVisibleQuestions(section);
    const answeredInSection = visibleQuestions.filter((question: Question) => 
      responses.some(r => r.questionId === question.id)
    ).length;
    return visibleQuestions.length > 0 ? (answeredInSection / visibleQuestions.length) * 100 : 0;
  };

  const handleNextSection = () => {
    if (validateCurrentSection()) {
      if (currentSectionIndex < assessment.sections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
      }
    } else {
      toast.error('Please complete all required fields in this section');
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const handleSaveProgress = async () => {
    setIsSaving(true);
    try {
      const response: AssessmentResponse = {
        id: AssessmentBuilderUtils.generateId(),
        assessmentId: assessment.id,
        candidateId,
        candidateName,
        candidateEmail,
        responses,
        startedAt: startTime,
        status: 'in-progress',
        currentSectionIndex,
      };

      await fetch(`/api/assessments/${assessment.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      });

      toast.success('Progress saved successfully');
      onSave?.(response);
    } catch (error) {
      toast.error('Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitAssessment = async () => {
    // Validate all sections
    let allValid = true;
    assessment.sections.forEach((_, index) => {
      setCurrentSectionIndex(index);
      if (!validateCurrentSection()) {
        allValid = false;
      }
    });

    if (!allValid) {
      toast.error('Please complete all required fields before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const response: AssessmentResponse = {
        id: AssessmentBuilderUtils.generateId(),
        assessmentId: assessment.id,
        candidateId,
        candidateName,
        candidateEmail,
        responses,
        startedAt: startTime,
        completedAt: new Date().toISOString(),
        status: 'completed',
      };

      await fetch(`/api/assessments/${assessment.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      });

      toast.success('Assessment submitted successfully!');
      LocalStorageUtils.saveResponse(assessment.id, response);
      onComplete?.(response);
    } catch (error) {
      toast.error('Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSection = assessment.sections[currentSectionIndex];
  const visibleQuestions = getVisibleQuestions(currentSection);
  const progress = getProgress();
  const sectionProgress = getSectionProgress(currentSectionIndex);
  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{assessment.title}</CardTitle>
              <p className="text-muted-foreground mt-1">{assessment.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Section {currentSectionIndex + 1} of {assessment.sections.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePreviousSection}
                disabled={currentSectionIndex === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-center">
                <h3 className="font-semibold">{currentSection.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{visibleQuestions.length} question{visibleQuestions.length !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>{Math.round(sectionProgress)}% complete</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleNextSection}
                disabled={currentSectionIndex === assessment.sections.length - 1}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSaveProgress}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Progress'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the errors below before proceeding to the next section.
          </AlertDescription>
        </Alert>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {visibleQuestions.map((question) => (
          <QuestionRenderer
            key={question.id}
            question={question}
            response={responses.find(r => r.questionId === question.id)}
            onChange={(response) => updateResponse(question.id, response.value)}
            showValidation={true}
          />
        ))}
      </div>

      {/* Submit Section */}
      {currentSectionIndex === assessment.sections.length - 1 && (
        <Card className="border-primary">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Ready to Submit?</h3>
              </div>
              <p className="text-muted-foreground">
                Review your answers and submit when you're ready. You won't be able to make changes after submission.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleSaveProgress}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save for Later'}
                </Button>
                <Button
                  onClick={handleSubmitAssessment}
                  disabled={isSubmitting || hasErrors}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



