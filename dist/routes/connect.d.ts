/**
 * Platform Connection Routes - V2 with Proof-of-Control (Production-Hardened)
 *
 * Two-step challenge flow for X:
 * 1. POST /v1/connect/x/start - Generate challenge code
 * 2. POST /v1/connect/x/verify - Verify challenge in bio
 *
 * SECURITY:
 * - 60-second cooldown between /start calls (atomic check)
 * - 60-second cooldown between /verify calls (atomic check, prevents rate limit exhaustion)
 * - Case-insensitive bio matching
 *
 * NOTE: challengeCode IS returned to frontend (first-party app needs to display it)
 *
 * STATUS SEMANTICS:
 * - status: 'ACTIVE' = account row exists and is usable
 * - verificationStatus: 'PENDING' = awaiting bio verification
 * - verificationStatus: 'VERIFIED' = proof-of-control completed
 */
import { FastifyInstance } from 'fastify';
declare function connectRoutes(fastify: FastifyInstance): Promise<void>;
export default connectRoutes;
