import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return new Response(JSON.stringify({ error: "Prompt is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Access Cloudflare Workers AI binding safely
        const runtime = (locals as any).runtime;
        const ai = runtime?.env?.AI;

        if (!ai) {
            return new Response(
                JSON.stringify({
                    response: `[Local Simulation] Processed edge request: "${prompt}". Connect production binding for live Llama-3 inference.`,
                }),
                { headers: { "Content-Type": "application/json" } }
            );
        }

        const output = await ai.run("@cf/meta/llama-3-8b-instruct", {
            prompt,
            max_tokens: 150,
        });

        return new Response(JSON.stringify(output), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
