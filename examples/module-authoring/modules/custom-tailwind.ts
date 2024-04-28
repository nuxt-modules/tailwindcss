// refer https://github.com/nuxt/starter/tree/module
import {
  defineNuxtModule,
  createResolver,
  addTemplate,
  installModule,
} from "@nuxt/kit";
import type { Config } from "tailwindcss";
import { defu } from "defu";
import { join } from "pathe";

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "custom-tailwind",
    configKey: "customTailwind",
  },
  defaults: {},
  async setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // @ts-ignore
    nuxt.hook("tailwindcss:config", (tailwindConfig: Partial<Config>) => {
      const contentPathsToAdd = [
        resolver.resolve("./components/**/*.{vue,jsx,tsx}"),
        resolver.resolve(
          `./composables/*.${nuxt.options.extensions.join(",")}`
        ),
      ];

      tailwindConfig.content = tailwindConfig.content ?? { files: [] };
      if (Array.isArray(tailwindConfig.content)) {
        tailwindConfig.content.push(...contentPathsToAdd);
      } else {
        tailwindConfig.content.files.push(...contentPathsToAdd, "another-path");
      }

      tailwindConfig.theme = tailwindConfig.theme ?? {};
      tailwindConfig.theme.extend = tailwindConfig.theme.extend ?? {};
      tailwindConfig.theme.extend.colors =
        tailwindConfig.theme.extend.colors ?? {};
      tailwindConfig.theme.extend.colors["custom-color"] = { default: "#fff" };

      tailwindConfig.theme = defu(tailwindConfig.theme, {
        screens: { xxs: "360px" },
      });
    });

    const customTailwindConfigTemplate = addTemplate({
      filename: "custom-tailwind.config.cjs",
      write: true,
      getContents: () => `
      const { wtfExtractor } = require(${JSON.stringify(resolver.resolve("./runtime/extractors"))});

      module.exports = {
        content: { extract: { wtf: wtfExtractor } },
        plugins: [
          require('@tailwindcss/typography'),
        ],
        safelist: [
          ${JSON.stringify("str-pattern")},
          { pattern: /\\/bg-(red|green|blue)-(100|200|300)\\// }
        ]
      }
      `,
    });

    await installModule(
      "@nuxtjs/tailwindcss",
      defu(
        {
          config: {
            theme: { extend: { colors: { primary: "#000" } } },
            content: ["my-files"],
          },
          exposeConfig: {
            alias: "#tw-config",
          },
          configPath: [
            customTailwindConfigTemplate.dst,
            join(nuxt.options.rootDir, "tailwind.config"),
          ],
        },
        // @ts-expect-error tailwindcss prop may not be there
        nuxt.options.tailwindcss
      )
    );
  },
});
