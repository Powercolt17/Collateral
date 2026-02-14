import { FastifyRequest } from 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        userId?: string;
        user?: {
            id: string;
            [key: string]: any;
        };
    }
}
