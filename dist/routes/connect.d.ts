/**
 * Platform Connection Routes - V2 with Proof-of-Control (Production-Hardened)
 *
 * Two-step challenge flow for X:
 * 1. POST /v1/connect/x/start - Generate challenge code
 * 2. POST /v1/connect/x/verify - Verify challenge in bio
 *
 * SECURITY:
 * - challengeCode never exposed in production responses (including instructions)
 * - 60-second cooldown between /start calls (atomic check)
 * - Case-insensitive bio matching
 *
 * STATUS SEMANTICS:
 * - status: 'ACTIVE' = account row exists and is usable
 * - verificationStatus: 'PENDING' = awaiting bio verification
 * - verificationStatus: 'VERIFIED' = proof-of-control completed
 */
import { FastifyInstance } from 'fastify';
declare function connectRoutes(fastify: FastifyInstance): Promise<void>;
export default connectRoutes;
