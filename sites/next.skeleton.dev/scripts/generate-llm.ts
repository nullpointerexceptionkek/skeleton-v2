import { experimental_AstroContainer } from "astro/container";
import mdxRenderer from "@astrojs/mdx/server.js";
import svelteRenderer from "@astrojs/svelte/server.js";
import reactRenderer from "@astrojs/svelte/server.js";
import TestComp from "../src/content/docs/components/accordion/svelte.mdx"; // MDX Component
import componentSet from "@components/mdx";



(async () => {
    const container = await experimental_AstroContainer.create();
    container.addServerRenderer({ renderer: mdxRenderer } as never);
    container.addServerRenderer({ renderer: svelteRenderer } as never);
    container.addServerRenderer({ renderer: reactRenderer } as never);



    const result = await container.renderToString(TestComp, {
        props: { components: componentSet }
      });

      console.log(result)
      


})();
