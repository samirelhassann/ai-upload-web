export interface GetPromptsResponse {
  prompts: Prompt[];
}

export interface Prompt {
  id: string;
  title: string;
  template: string;
}
