import { z } from 'zod';

const serverEnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

const clientEnvSchema = z.object({
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(10, 'WhatsApp number must be at least 10 digits'),
});

// Validate Client Env
const clientEnv = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
});

if (!clientEnv.success) {
    console.error('❌ Invalid client environment variables:', clientEnv.error.format());
    throw new Error('Invalid client environment variables');
}

// Validate Server Env (only if on server)
let serverEnv = { success: true, data: {} } as any;
if (typeof window === 'undefined') {
    serverEnv = serverEnvSchema.safeParse({
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
    });

    if (!serverEnv.success) {
        console.error('❌ Invalid server environment variables:', serverEnv.error.format());
        throw new Error('Invalid server environment variables');
    }
}

export const env = {
    ...clientEnv.data,
    ...serverEnv.data,
} as z.infer<typeof clientEnvSchema> & z.infer<typeof serverEnvSchema>;
