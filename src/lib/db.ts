import Dexie, { Table } from 'dexie';

export type JobStatus = 'active' | 'archived';
export type CandidateStage = 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';

export interface Job {
  id: string;
  title: string;
  slug: string;
  status: JobStatus;
  tags: string[];
  order: number;
  description?: string;
  location?: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: CandidateStage;
  jobId: string;
  phone?: string;
  resume?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  candidateId: string;
  type: 'stage_change' | 'note_added' | 'assessment_completed';
  fromStage?: CandidateStage;
  toStage?: CandidateStage;
  note?: string;
  userId?: string;
  userName?: string;
  timestamp: string;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  sections: AssessmentSection[];
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export type QuestionType = 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  description?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    maxLength?: number;
  };
  conditionalOn?: {
    questionId: string;
    value: string;
  };
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  responses: Record<string, any>;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  timeline!: Table<TimelineEvent>;
  assessments!: Table<Assessment>;
  assessmentResponses!: Table<AssessmentResponse>;

  constructor() {
    super('TalentFlowDB');
    this.version(1).stores({
      jobs: 'id, title, status, order, slug',
      candidates: 'id, name, email, stage, jobId',
      timeline: 'id, candidateId, timestamp',
      assessments: 'id, jobId',
      assessmentResponses: 'id, assessmentId, candidateId',
    });
  }
}

export const db = new TalentFlowDB();
