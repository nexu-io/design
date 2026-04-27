export interface ComponentMetadataRecord {
  id: string;
  name: string;
  status?: string;
  category?: string;
  package?: string;
  exports?: string[];
  import?: string;
  description?: string;
  overview?: string;
  usage?: string;
  docsUrl?: string;
  storybookId?: string;
  storybookUrl?: string;
  storybookTitle?: string;
  sourcePath?: string;
  examples?: string[];
  accessibility?: string[];
  inheritedProps?: string;
  coverage?: Record<string, unknown>;
  props?: ComponentPropRecord[];
}

export interface ComponentPropRecord {
  name: string;
  type: string;
  defaultValue?: string;
  description?: string;
}

export interface ExampleMetadataRecord {
  id: string;
  componentId: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  filePath?: string;
  source?: string;
  dependencies?: string[];
  docsUrl?: string;
}

export interface TokenMetadataRecord {
  name: string;
  category?: string;
  page?: string;
  group?: string;
  cssVar?: string;
  value?: string | number;
  resolvedValue?: string;
  description?: string;
  usage?: string;
  foreground?: string;
  themes?: {
    light?: string;
    dark?: string;
  };
}

export interface ComponentsApiResponse {
  schemaVersion?: string;
  generatedFrom?: string[];
  count?: number;
  components: ComponentMetadataRecord[];
}

export interface ExamplesApiResponse {
  schemaVersion?: string;
  generatedFrom?: string[];
  count?: number;
  examples: ExampleMetadataRecord[];
}

export interface TokensApiResponse {
  schemaVersion?: string;
  generatedFrom?: string[];
  count?: number;
  themes?: unknown;
  pages?: unknown[];
  tokens: TokenMetadataRecord[];
}

export interface MetadataStore {
  componentsApi: ComponentsApiResponse;
  examplesApi: ExamplesApiResponse;
  tokensApi: TokensApiResponse;
}
