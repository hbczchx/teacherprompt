export interface Scenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface PromptTemplate {
  id: string;
  scenarioId: string;
  title: string;
  content: string;
  tags: string[];
  isBuiltIn: boolean;
  useCount: number;
  createdAt: string;
}

export interface PromptHistory {
  id: string;
  templateIds: string[];
  filledValues: Record<string, Record<string, string>>;
  generatedContents: Record<string, string>;
  createdAt: string;
}
