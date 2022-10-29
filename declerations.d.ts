import { ResolvePathOptions } from "@nuxt/kit";

export type CSSOptionObjectFormat = {
  src: string;
  lang: string;
};
export type CSSOption = CSSOptionObjectFormat | string;
declare interface ConfigSchema {
  css: CSSOption;
}

declare module "@nuxt/kit" {
  function resolvePath(
    path: CSSOption,
    opts?: ResolvePathOptions
  ): Promise<string>;
}
