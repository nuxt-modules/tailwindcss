export type TWConfig = import('tailwindcss').Config
export type Arrayable<T> = T | Array<T>
export type InjectPosition = 'first' | 'last' | number | { after: string };

interface ExtendTailwindConfig {
  content: TWConfig['content'] | ((contentDefaults: Array<string>) => TWConfig['content']);
}

export interface ModuleOptions {
  configPath: Arrayable<string>;
  cssPath: string | false;
  config: Omit<TWConfig, keyof ExtendTailwindConfig> & ExtendTailwindConfig;
  viewer: boolean;
  exposeConfig: boolean;
  exposeLevel: number;
  injectPosition: InjectPosition;
  disableHmrHotfix: boolean;
}
