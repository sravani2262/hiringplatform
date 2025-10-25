import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Settings } from 'lucide-react';
import { Question, Assessment, ConditionalRule, CONDITIONAL_OPERATORS } from '@/types/assessment';

interface ConditionalRuleEditorProps {
  question: Question;
  assessment: Assessment;
  onConditionalChange: (conditional: ConditionalRule | undefined) => void;
}

export function ConditionalRuleEditor({ 
  question, 
  assessment, 
  onConditionalChange 
}: ConditionalRuleEditorProps) {
  const [isEnabled, setIsEnabled] = useState(!!question.conditional);
  const [conditional, setConditional] = useState<ConditionalRule>(
    question.conditional || {
      questionId: '',
      operator: 'equals',
      value: '',
    }
  );

  // Get all questions that can be used as conditions (questions that come before this one)
  const getAvailableQuestions = (): Question[] => {
    const allQuestions: Question[] = [];
    assessment.sections.forEach(section => {
      section.questions.forEach(q => {
        allQuestions.push(q);
      });
    });
    
    // Only show questions that come before this question in the assessment
    const currentQuestionIndex = allQuestions.findIndex(q => q.id === question.id);
    return allQuestions.slice(0, currentQuestionIndex);
  };

  const availableQuestions = getAvailableQuestions();

  const updateConditional = (updates: Partial<ConditionalRule>) => {
    const newConditional = { ...conditional, ...updates };
    setConditional(newConditional);
    
    if (isEnabled) {
      onConditionalChange(newConditional);
    }
  };

  const handleToggleEnabled = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (enabled) {
      onConditionalChange(conditional);
    } else {
      onConditionalChange(undefined);
    }
  };

  const getSelectedQuestion = () => {
    return availableQuestions.find(q => q.id === conditional.questionId);
  };

  const renderValueInput = () => {
    const selectedQuestion = getSelectedQuestion();
    if (!selectedQuestion) return null;

    switch (selectedQuestion.type) {
      case 'single-choice':
        return (
          <Select
            value={conditional.value as string}
            onValueChange={(value) => updateConditional({ value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {selectedQuestion.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi-choice':
        return (
          <div className="space-y-2">
            <Label className="text-sm">Expected selected options (comma-separated)</Label>
            <Input
              value={conditional.value as string}
              onChange={(e) => updateConditional({ value: e.target.value })}
              placeholder="Option 1, Option 2"
            />
          </div>
        );

      case 'short-text':
      case 'long-text':
        return (
          <Input
            value={conditional.value as string}
            onChange={(e) => updateConditional({ value: e.target.value })}
            placeholder="Enter expected text"
          />
        );

      case 'numeric':
        return (
          <Input
            type="number"
            value={conditional.value as number}
            onChange={(e) => updateConditional({ value: Number(e.target.value) })}
            placeholder="Enter expected number"
          />
        );

      case 'file-upload':
        return (
          <div className="text-sm text-muted-foreground">
            File upload questions can only use "equals" or "not-equals" operators
          </div>
        );

      default:
        return (
          <Input
            value={conditional.value as string}
            onChange={(e) => updateConditional({ value: e.target.value })}
            placeholder="Enter expected value"
          />
        );
    }
  };

  const getAvailableOperators = () => {
    const selectedQuestion = getSelectedQuestion();
    if (!selectedQuestion) return Object.keys(CONDITIONAL_OPERATORS);

    switch (selectedQuestion.type) {
      case 'single-choice':
        return ['equals', 'not-equals'];
      case 'multi-choice':
        return ['contains', 'not-equals'];
      case 'short-text':
      case 'long-text':
        return ['equals', 'not-equals', 'contains'];
      case 'numeric':
        return ['equals', 'not-equals', 'greater-than', 'less-than'];
      case 'file-upload':
        return ['equals', 'not-equals'];
      default:
        return ['equals', 'not-equals'];
    }
  };

  if (availableQuestions.length === 0) {
    return (
      <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <Label className="text-sm font-medium">Conditional Logic</Label>
        </div>
        <div className="text-sm text-muted-foreground">
          No previous questions available for conditional logic.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <Label className="text-sm font-medium">Conditional Logic</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id={`conditional-${question.id}`}
            checked={isEnabled}
            onCheckedChange={handleToggleEnabled}
          />
          <Label htmlFor={`conditional-${question.id}`} className="text-sm">
            Enable
          </Label>
        </div>
      </div>

      {isEnabled && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Show this question only if:
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Question Selection */}
            <div>
              <Label className="text-sm">Previous Question</Label>
              <Select
                value={conditional.questionId}
                onValueChange={(value) => updateConditional({ questionId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a question" />
                </SelectTrigger>
                <SelectContent>
                  {availableQuestions.map((q) => (
                    <SelectItem key={q.id} value={q.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {q.type}
                        </Badge>
                        <span className="truncate">{q.text}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Operator Selection */}
            {conditional.questionId && (
              <div>
                <Label className="text-sm">Condition</Label>
                <Select
                  value={conditional.operator}
                  onValueChange={(value: any) => updateConditional({ operator: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableOperators().map((operator) => (
                      <SelectItem key={operator} value={operator}>
                        <div className="flex items-center gap-2">
                          <span>{CONDITIONAL_OPERATORS[operator as keyof typeof CONDITIONAL_OPERATORS]?.symbol}</span>
                          <span>{CONDITIONAL_OPERATORS[operator as keyof typeof CONDITIONAL_OPERATORS]?.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Value Input */}
            {conditional.questionId && (
              <div>
                <Label className="text-sm">Expected Value</Label>
                {renderValueInput()}
              </div>
            )}
          </div>

          {/* Preview */}
          {conditional.questionId && (
            <div className="p-2 bg-primary/5 rounded border border-primary/20">
              <div className="text-xs text-primary font-medium">
                This question will be shown when:
              </div>
              <div className="text-xs text-primary mt-1">
                "{getSelectedQuestion()?.text}" {CONDITIONAL_OPERATORS[conditional.operator]?.symbol} "{conditional.value}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
