import { Assessment, Section, Question, QuestionResponse, AssessmentResponse } from '../types/assessment';

// Assessment Builder Utilities
export class AssessmentBuilderUtils {
  static generateId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static createEmptySection(): Section {
    return {
      id: this.generateId(),
      title: 'New Section',
      description: '',
      questions: [],
      order: 0,
    };
  }

  static createEmptyQuestion(type: string = 'short-text'): Question {
    return {
      id: this.generateId(),
      type: type as any,
      text: 'New Question',
      description: '',
      options: type.includes('choice') ? ['Option 1', 'Option 2'] : undefined,
      validation: { required: false },
      order: 0,
    };
  }

  static createEmptyAssessment(jobId: string, jobTitle: string): Assessment {
    return {
      id: this.generateId(),
      jobId,
      title: `${jobTitle} Assessment`,
      description: 'Complete this assessment to proceed with your application.',
      sections: [this.createEmptySection()],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    };
  }

  static reorderItems<T extends { order: number }>(items: T[]): T[] {
    return items.map((item, index) => ({ ...item, order: index }));
  }

  static moveItem<T extends { order: number }>(
    items: T[],
    fromIndex: number,
    toIndex: number
  ): T[] {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    return this.reorderItems(newItems);
  }
}

// Validation Utilities
export class ValidationUtils {
  static validateQuestion(question: Question, response: QuestionResponse): string[] {
    const errors: string[] = [];
    const { validation } = question;

    if (!validation) return errors;

    // Required validation
    if (validation.required) {
      if (!response.value || 
          (typeof response.value === 'string' && response.value.trim() === '') ||
          (Array.isArray(response.value) && response.value.length === 0)) {
        errors.push(VALIDATION_MESSAGES.required);
      }
    }

    // Skip other validations if no value
    if (!response.value) return errors;

    // String validations
    if (typeof response.value === 'string') {
      if (validation.minLength && response.value.length < validation.minLength) {
        errors.push(VALIDATION_MESSAGES.minLength.replace('{min}', validation.minLength.toString()));
      }
      if (validation.maxLength && response.value.length > validation.maxLength) {
        errors.push(VALIDATION_MESSAGES.maxLength.replace('{max}', validation.maxLength.toString()));
      }
      if (validation.pattern && !new RegExp(validation.pattern).test(response.value)) {
        errors.push(VALIDATION_MESSAGES.pattern);
      }
    }

    // Numeric validations
    if (typeof response.value === 'number') {
      if (validation.min !== undefined && response.value < validation.min) {
        errors.push(VALIDATION_MESSAGES.min.replace('{min}', validation.min.toString()));
      }
      if (validation.max !== undefined && response.value > validation.max) {
        errors.push(VALIDATION_MESSAGES.max.replace('{max}', validation.max.toString()));
      }
    }

    // Array validations (for multi-choice)
    if (Array.isArray(response.value)) {
      if (validation.minLength && response.value.length < validation.minLength) {
        errors.push(VALIDATION_MESSAGES.minLength.replace('{min}', validation.minLength.toString()));
      }
      if (validation.maxLength && response.value.length > validation.maxLength) {
        errors.push(VALIDATION_MESSAGES.maxLength.replace('{max}', validation.maxLength.toString()));
      }
    }

    return errors;
  }

  static validateAssessment(assessment: Assessment, responses: QuestionResponse[]): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    
    assessment.sections.forEach(section => {
      section.questions.forEach(question => {
        const response = responses.find(r => r.questionId === question.id);
        if (response) {
          const questionErrors = this.validateQuestion(question, response);
          if (questionErrors.length > 0) {
            errors[question.id] = questionErrors;
          }
        } else if (question.validation?.required) {
          errors[question.id] = [VALIDATION_MESSAGES.required];
        }
      });
    });

    return errors;
  }
}

// Conditional Logic Utilities
export class ConditionalUtils {
  static shouldShowQuestion(
    question: Question,
    responses: QuestionResponse[]
  ): boolean {
    if (!question.conditional) return true;

    const { questionId, operator, value } = question.conditional;
    const response = responses.find(r => r.questionId === questionId);
    
    if (!response || !response.value) return false;

    switch (operator) {
      case 'equals':
        return response.value === value;
      case 'not-equals':
        return response.value !== value;
      case 'contains':
        return typeof response.value === 'string' && 
               response.value.toLowerCase().includes(String(value).toLowerCase());
      case 'greater-than':
        return typeof response.value === 'number' && response.value > Number(value);
      case 'less-than':
        return typeof response.value === 'number' && response.value < Number(value);
      default:
        return true;
    }
  }

  static getVisibleQuestions(
    assessment: Assessment,
    responses: QuestionResponse[]
  ): Question[] {
    const visibleQuestions: Question[] = [];
    
    assessment.sections.forEach(section => {
      section.questions.forEach(question => {
        if (this.shouldShowQuestion(question, responses)) {
          visibleQuestions.push(question);
        }
      });
    });

    return visibleQuestions;
  }
}

// Local Storage Utilities
export class LocalStorageUtils {
  private static readonly ASSESSMENT_BUILDER_KEY = 'assessment-builder-state';
  private static readonly ASSESSMENT_RESPONSES_KEY = 'assessment-responses';

  static saveBuilderState(state: any): void {
    try {
      localStorage.setItem(this.ASSESSMENT_BUILDER_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save builder state:', error);
    }
  }

  static loadBuilderState(): any {
    try {
      const state = localStorage.getItem(this.ASSESSMENT_BUILDER_KEY);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.error('Failed to load builder state:', error);
      return null;
    }
  }

  static saveResponse(assessmentId: string, response: AssessmentResponse): void {
    try {
      const responses = this.getAllResponses();
      responses[assessmentId] = response;
      localStorage.setItem(this.ASSESSMENT_RESPONSES_KEY, JSON.stringify(responses));
    } catch (error) {
      console.error('Failed to save response:', error);
    }
  }

  static getResponse(assessmentId: string): AssessmentResponse | null {
    try {
      const responses = this.getAllResponses();
      return responses[assessmentId] || null;
    } catch (error) {
      console.error('Failed to get response:', error);
      return null;
    }
  }

  static getAllResponses(): Record<string, AssessmentResponse> {
    try {
      const responses = localStorage.getItem(this.ASSESSMENT_RESPONSES_KEY);
      return responses ? JSON.parse(responses) : {};
    } catch (error) {
      console.error('Failed to get responses:', error);
      return {};
    }
  }

  static clearBuilderState(): void {
    try {
      localStorage.removeItem(this.ASSESSMENT_BUILDER_KEY);
    } catch (error) {
      console.error('Failed to clear builder state:', error);
    }
  }

  static clearResponses(): void {
    try {
      localStorage.removeItem(this.ASSESSMENT_RESPONSES_KEY);
    } catch (error) {
      console.error('Failed to clear responses:', error);
    }
  }
}

// Import validation messages
import { VALIDATION_MESSAGES } from '../types/assessment';
