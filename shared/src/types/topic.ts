export enum Category {
  JAVASCRIPT = 'javascript',
  REACT = 'react',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

export interface Topic {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  topics: Topic[];
}

// JavaScript topics
export enum JavaScriptTopic {
  VARIABLES = 'variables',
  FUNCTIONS = 'functions',
  ARRAYS = 'arrays',
  OBJECTS = 'objects',
  PROMISES = 'promises-async',
  DOM = 'dom',
  ALGORITHMS = 'algorithms',
  CLOSURES = 'closures',
  PROTOTYPES = 'prototypes',
}

// React topics
export enum ReactTopic {
  JSX_COMPONENTS = 'jsx-components',
  STATE_PROPS = 'state-props',
  HOOKS = 'hooks',
  CUSTOM_HOOKS = 'custom-hooks',
  CONTEXT = 'context',
  USE_REDUCER = 'use-reducer',
  REDUX = 'redux',
  ROUTER = 'router',
  PERFORMANCE = 'performance',
}
