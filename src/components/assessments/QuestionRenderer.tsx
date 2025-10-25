import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Upload, X } from 'lucide-react';
import { Question, QuestionResponse, ValidationRule } from '@/types/assessment';
import { ValidationUtils } from '@/utils/assessment';

interface QuestionRendererProps {
  question: Question;
  response?: QuestionResponse;
  onChange: (response: QuestionResponse) => void;
  isPreview?: boolean;
  showValidation?: boolean;
}

export function QuestionRenderer({ 
  question, 
  response, 
  onChange, 
  isPreview = false,
  showValidation = false 
}: QuestionRendererProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleValueChange = (value: any) => {
    const newResponse: QuestionResponse = {
      questionId: question.id,
      value,
      timestamp: new Date().toISOString(),
    };

    onChange(newResponse);

    // Validate if not in preview mode
    if (!isPreview && question.validation) {
      const validationErrors = ValidationUtils.validateQuestion(question, newResponse);
      setErrors(validationErrors);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFilePreview(file.name);
      handleValueChange(file);
    }
  };

  const removeFile = () => {
    setFilePreview(null);
    handleValueChange(null);
  };

  const renderQuestionContent = () => {
    const currentValue = response?.value || '';

    switch (question.type) {
      case 'single-choice':
        return (
          <RadioGroup
            value={currentValue as string}
            onValueChange={handleValueChange}
            className="space-y-2"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multi-choice':
        const selectedValues = (currentValue as string[]) || [];
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleValueChange([...selectedValues, option]);
                    } else {
                      handleValueChange(selectedValues.filter(v => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'short-text':
        return (
          <Input
            value={currentValue as string}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter your answer..."
            maxLength={question.validation?.maxLength}
            className="w-full"
          />
        );

      case 'long-text':
        return (
          <Textarea
            value={currentValue as string}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Enter your detailed answer..."
            rows={4}
            maxLength={question.validation?.maxLength}
            className="w-full"
          />
        );

      case 'numeric':
        return (
          <div className="space-y-2">
            <Input
              type="number"
              value={currentValue as number}
              onChange={(e) => handleValueChange(Number(e.target.value))}
              placeholder="Enter a number..."
              min={question.validation?.min}
              max={question.validation?.max}
              className="w-full"
            />
            {(question.validation?.min !== undefined || question.validation?.max !== undefined) && (
              <div className="text-xs text-muted-foreground">
                Range: {question.validation?.min ?? 'no minimum'} - {question.validation?.max ?? 'no maximum'}
              </div>
            )}
          </div>
        );

      case 'file-upload':
        return (
          <div className="space-y-2">
            {filePreview ? (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{filePreview}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload or drag and drop
                </p>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id={`file-${question.id}`}
                />
                <Label
                  htmlFor={`file-${question.id}`}
                  className="cursor-pointer text-sm text-primary hover:underline"
                >
                  Choose file
                </Label>
              </div>
            )}
          </div>
        );

      default:
        return <div className="text-sm text-muted-foreground">Unknown question type</div>;
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium">
                {question.text}
                {question.validation?.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {question.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {question.description}
                </p>
              )}
            </div>
            {showValidation && errors.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.length} error{errors.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {renderQuestionContent()}

          {showValidation && errors.length > 0 && (
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Validation Rule Editor Component
interface ValidationRuleEditorProps {
  question: Question;
  onValidationChange: (validation: ValidationRule) => void;
}

export function ValidationRuleEditor({ question, onValidationChange }: ValidationRuleEditorProps) {
  const [validation, setValidation] = useState<ValidationRule>(question.validation || {});

  const updateValidation = (updates: Partial<ValidationRule>) => {
    const newValidation = { ...validation, ...updates };
    setValidation(newValidation);
    onValidationChange(newValidation);
  };

  const renderValidationFields = () => {
    const fields = [];

    // Required field
    fields.push(
      <div key="required" className="flex items-center space-x-2">
        <Checkbox
          id="required"
          checked={validation.required || false}
          onCheckedChange={(checked) => updateValidation({ required: !!checked })}
        />
        <Label htmlFor="required" className="text-sm">Required</Label>
      </div>
    );

    // String length validations
    if (question.type === 'short-text' || question.type === 'long-text' || question.type === 'multi-choice') {
      fields.push(
        <div key="minLength" className="flex items-center space-x-2">
          <Label htmlFor="minLength" className="text-sm w-20">Min Length:</Label>
          <Input
            id="minLength"
            type="number"
            value={validation.minLength || ''}
            onChange={(e) => updateValidation({ minLength: e.target.value ? Number(e.target.value) : undefined })}
            className="w-20"
            min="0"
          />
        </div>
      );

      fields.push(
        <div key="maxLength" className="flex items-center space-x-2">
          <Label htmlFor="maxLength" className="text-sm w-20">Max Length:</Label>
          <Input
            id="maxLength"
            type="number"
            value={validation.maxLength || ''}
            onChange={(e) => updateValidation({ maxLength: e.target.value ? Number(e.target.value) : undefined })}
            className="w-20"
            min="1"
          />
        </div>
      );
    }

    // Numeric range validations
    if (question.type === 'numeric') {
      fields.push(
        <div key="min" className="flex items-center space-x-2">
          <Label htmlFor="min" className="text-sm w-20">Min Value:</Label>
          <Input
            id="min"
            type="number"
            value={validation.min || ''}
            onChange={(e) => updateValidation({ min: e.target.value ? Number(e.target.value) : undefined })}
            className="w-20"
          />
        </div>
      );

      fields.push(
        <div key="max" className="flex items-center space-x-2">
          <Label htmlFor="max" className="text-sm w-20">Max Value:</Label>
          <Input
            id="max"
            type="number"
            value={validation.max || ''}
            onChange={(e) => updateValidation({ max: e.target.value ? Number(e.target.value) : undefined })}
            className="w-20"
          />
        </div>
      );
    }

    // Pattern validation for text fields
    if (question.type === 'short-text') {
      fields.push(
        <div key="pattern" className="flex items-center space-x-2">
          <Label htmlFor="pattern" className="text-sm w-20">Pattern:</Label>
          <Input
            id="pattern"
            value={validation.pattern || ''}
            onChange={(e) => updateValidation({ pattern: e.target.value || undefined })}
            placeholder="Regex pattern"
            className="flex-1"
          />
        </div>
      );
    }

    return fields;
  };

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
      <Label className="text-sm font-medium">Validation Rules</Label>
      <div className="grid grid-cols-1 gap-2">
        {renderValidationFields()}
      </div>
    </div>
  );
}
