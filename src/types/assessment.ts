// Assessment Types and Interfaces
export type QuestionType = 
  | 'single-choice' 
  | 'multi-choice' 
  | 'short-text' 
  | 'long-text' 
  | 'numeric' 
  | 'file-upload';

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customMessage?: string;
};

export type ConditionalRule = {
  questionId: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
  value: string | number;
};

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  description?: string;
  options?: string[]; // For choice questions
  validation?: ValidationRule;
  conditional?: ConditionalRule;
  order: number;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  order: number;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description: string;
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface QuestionResponse {
  questionId: string;
  value: string | string[] | number | File;
  timestamp: string;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId?: string;
  candidateName?: string;
  candidateEmail?: string;
  responses: QuestionResponse[];
  completedAt?: string;
  startedAt: string;
  score?: number;
  status: 'in-progress' | 'completed' | 'abandoned';
}

export interface AssessmentBuilderState {
  assessment: Assessment;
  selectedSection?: string;
  selectedQuestion?: string;
  previewMode: boolean;
  unsavedChanges: boolean;
}

// Question Type Configurations
export const QUESTION_TYPE_CONFIG = {
  'single-choice': {
    label: 'Single Choice',
    icon: '🔘',
    description: 'Select one option from multiple choices',
    hasOptions: true,
    hasValidation: ['required'],
  },
  'multi-choice': {
    label: 'Multiple Choice',
    icon: '☑️',
    description: 'Select multiple options from choices',
    hasOptions: true,
    hasValidation: ['required', 'minLength', 'maxLength'],
  },
  'short-text': {
    label: 'Short Text',
    icon: '📝',
    description: 'Brief text response',
    hasOptions: false,
    hasValidation: ['required', 'minLength', 'maxLength', 'pattern'],
  },
  'long-text': {
    label: 'Long Text',
    icon: '📄',
    description: 'Detailed text response',
    hasOptions: false,
    hasValidation: ['required', 'minLength', 'maxLength'],
  },
  'numeric': {
    label: 'Numeric',
    icon: '🔢',
    description: 'Number input with range validation',
    hasOptions: false,
    hasValidation: ['required', 'min', 'max'],
  },
  'file-upload': {
    label: 'File Upload',
    icon: '📎',
    description: 'Upload a file',
    hasOptions: false,
    hasValidation: ['required'],
  },
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  required: 'This field is required',
  minLength: 'Minimum length is {min} characters',
  maxLength: 'Maximum length is {max} characters',
  min: 'Minimum value is {min}',
  max: 'Maximum value is {max}',
  pattern: 'Invalid format',
  fileRequired: 'Please upload a file',
  fileSize: 'File size must be less than {max}MB',
  fileType: 'Invalid file type. Allowed: {types}',
};

// Conditional Operators
export const CONDITIONAL_OPERATORS = {
  'equals': { label: 'Equals', symbol: '=' },
  'not-equals': { label: 'Not Equals', symbol: '≠' },
  'contains': { label: 'Contains', symbol: '⊃' },
  'greater-than': { label: 'Greater Than', symbol: '>' },
  'less-than': { label: 'Less Than', symbol: '<' },
};



