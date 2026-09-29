export type AIOperationType = 
  | 'resume-summary'
  | 'experience-enhance'
  | 'project-enhance'
  | 'skill-description'
  | 'ats-optimize'
  | 'general-assistant'
  | 'shorten'
  | 'professionalize'
  | 'expand'
  | 'grammar';

export interface AIEnhanceRequest {
  type: AIOperationType;
  content: string;
  context?: Record<string, any>;
}

export interface AIEnhanceResponse {
  enhanced: string;
  original: string;
  suggestions?: string[];
  metrics?: {
    wordCountBefore: number;
    wordCountAfter: number;
    readabilityScore?: number;
  };
}

export interface AIGenerationRecord {
  id: string;
  prompt: string;
  response: string;
  type: string;
  status: 'applied' | 'discarded' | 'draft';
  createdAt: string;
}
