import { FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/health', async (_request, _reply) => {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'collateral-backend',
            version: '1.0.0',
        };
    });
};

export default healthRoutes;
