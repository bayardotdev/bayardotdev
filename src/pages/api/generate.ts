export const prerender = false;
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
    try {
        const { prompt } = await request.json();

        // Safely extract the Cloudflare edge environment
        const env = (locals as any).runtime?.env ?? (locals as any).env;

        if (!env?.AI) {
            return new Response(JSON.stringify({ error: 'Workers AI binding (AI) not found' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            prompt: prompt || 'Hello from Cloudflare Edge AI',
        });

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
