import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { getContainerRenderer as svelteContainerRenderer } from "@astrojs/svelte";
import { getContainerRenderer as mdxContainerRenderer } from "@astrojs/mdx";

import { loadRenderers } from "astro:container";
import { experimental_AstroContainer } from "astro/container";



import testComp from 'src/content/docs/components/accordion/svelte.mdx'
const renderers = await loadRenderers([mdxContainerRenderer(), svelteContainerRenderer()]);
const container = await experimental_AstroContainer.create({
    renderers
})

const docs = await getCollection("docs");

export const GET: APIRoute = async ({}) => {

    const result = await container.renderToString(testComp, {
        
    });
    console.log(result)

    return new Response(
        `\n\n${docs
            .map((doc) => {
                return `# ${doc.data.title}\n\n${doc.body}\n\n`;
            })
            .join("")}`,
        { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
};