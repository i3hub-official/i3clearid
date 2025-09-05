-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('ACCOUNT_DELETION_REQUEST', 'ACCOUNT_DEACTIVATION', 'LOGIN_ATTEMPT', 'LOGIN_SUCCESS', 'PASSWORD_CHANGE', 'PASSWORD_RESET', 'DATA_EXPORT', 'DATA_DELETION', 'PERMISSION_CHANGE', 'SYSTEM_EVENT');

-- CreateEnum
CREATE TYPE "public"."AuditStatus" AS ENUM ('SUCCESS', 'FAILED', 'PENDING', 'REVERTED');

-- CreateEnum
CREATE TYPE "public"."Severity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."AgentStatus" AS ENUM ('ACTIVE', 'DEACTIVATED', 'PENDING_DELETION', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."UserRoleEnum" AS ENUM ('ADMIN', 'AGENT', 'USER');

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" TEXT NOT NULL,
    "action" "public"."AuditAction" NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT NOT NULL DEFAULT 'unknown',
    "userAgent" TEXT NOT NULL DEFAULT 'unknown',
    "status" "public"."AuditStatus" NOT NULL DEFAULT 'SUCCESS',
    "severity" "public"."Severity" NOT NULL DEFAULT 'MEDIUM',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) DEFAULT (NOW() + interval '7 years'),
    "agentId" TEXT,
    "targetId" TEXT,
    "targetType" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."agent" (
    "id" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "otherName" TEXT NOT NULL,
    "gender" TEXT,
    "dob" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nin" TEXT,
    "bvn" TEXT,
    "state" TEXT NOT NULL,
    "lga" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "emailHash" TEXT NOT NULL,
    "phoneHash" TEXT NOT NULL,
    "ninHash" TEXT NOT NULL,
    "bvnHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginAttemptIp" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "admittedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "deletionReason" TEXT,
    "deactivatedAt" TIMESTAMP(3),
    "deactivationReason" TEXT,
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."agent_profile" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailHash" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneHash" TEXT NOT NULL,
    "pin" TEXT NOT NULL DEFAULT '',
    "pinHash" TEXT NOT NULL DEFAULT '',
    "passwordHash" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passwordResetAttempts" INTEGER,
    "accountLockedUntil" TIMESTAMP(3),
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "lockoutCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastPasswordResetAt" TIMESTAMP(3),
    "avatarUrl" TEXT NOT NULL DEFAULT '',
    "failedDeletionAttempts" TIMESTAMP(3),
    "deletionLockedUntil" TIMESTAMP(3),
    "deletionLockoutCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "agent_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AgentSession" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "AgentSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeletionSchedule" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "deletionType" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeletionSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification_status" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedDate" TIMESTAMP(3),
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerifiedDate" TIMESTAMP(3),
    "ninVerified" BOOLEAN NOT NULL DEFAULT false,
    "ninVerifiedDate" TIMESTAMP(3),
    "bvnVerified" BOOLEAN NOT NULL DEFAULT false,
    "bvnVerifiedDate" TIMESTAMP(3),
    "documentVerified" BOOLEAN NOT NULL DEFAULT false,
    "documentVerifiedDate" TIMESTAMP(3),
    "dobVerified" BOOLEAN NOT NULL DEFAULT false,
    "dobVerifiedDate" TIMESTAMP(3),
    "genderVerified" BOOLEAN NOT NULL DEFAULT false,
    "genderVerifiedDate" TIMESTAMP(3),
    "nameVerified" BOOLEAN NOT NULL DEFAULT false,
    "nameVerificationDate" TIMESTAMP(3),
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."failed_attempts" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "failed_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."failed_deletion_attempts" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'ACCOUNT_DELETION',
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "failed_deletion_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account_locks" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "reason" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "action" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "account_locks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_token" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "agentProfileId" TEXT,

    CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."password_reset_event" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,

    CONSTRAINT "password_reset_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "fullName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bio" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "hasPin" BOOLEAN NOT NULL DEFAULT false,
    "pinHash" TEXT,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "passwordChangedAt" TIMESTAMP(3),
    "role" "public"."UserRoleEnum" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_role" (
    "id" TEXT NOT NULL,
    "role" "public"."UserRoleEnum" NOT NULL DEFAULT 'AGENT',

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "userAgent" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."oauth_account" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oauth_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session_cleanup_log" (
    "id" TEXT NOT NULL,
    "removed" INTEGER NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_cleanup_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session_cleanup_config" (
    "id" TEXT NOT NULL,
    "cleanupProbability" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "maxLifetimeHours" INTEGER NOT NULL DEFAULT 48,
    "lastRunAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_cleanup_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "public"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_agentId_idx" ON "public"."audit_logs"("agentId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "public"."audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_severity_idx" ON "public"."audit_logs"("severity");

-- CreateIndex
CREATE INDEX "audit_logs_status_idx" ON "public"."audit_logs"("status");

-- CreateIndex
CREATE INDEX "audit_logs_targetId_targetType_idx" ON "public"."audit_logs"("targetId", "targetType");

-- CreateIndex
CREATE UNIQUE INDEX "agent_email_key" ON "public"."agent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agent_phone_key" ON "public"."agent"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "agent_nin_key" ON "public"."agent"("nin");

-- CreateIndex
CREATE UNIQUE INDEX "agent_bvn_key" ON "public"."agent"("bvn");

-- CreateIndex
CREATE UNIQUE INDEX "agent_emailHash_key" ON "public"."agent"("emailHash");

-- CreateIndex
CREATE UNIQUE INDEX "agent_phoneHash_key" ON "public"."agent"("phoneHash");

-- CreateIndex
CREATE UNIQUE INDEX "agent_ninHash_key" ON "public"."agent"("ninHash");

-- CreateIndex
CREATE UNIQUE INDEX "agent_bvnHash_key" ON "public"."agent"("bvnHash");

-- CreateIndex
CREATE INDEX "agent_emailHash_idx" ON "public"."agent"("emailHash");

-- CreateIndex
CREATE INDEX "agent_phoneHash_idx" ON "public"."agent"("phoneHash");

-- CreateIndex
CREATE INDEX "agent_ninHash_idx" ON "public"."agent"("ninHash");

-- CreateIndex
CREATE INDEX "agent_state_idx" ON "public"."agent"("state");

-- CreateIndex
CREATE INDEX "agent_lga_idx" ON "public"."agent"("lga");

-- CreateIndex
CREATE INDEX "agent_createdAt_idx" ON "public"."agent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "agent_profile_agentId_key" ON "public"."agent_profile"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "agent_profile_emailHash_key" ON "public"."agent_profile"("emailHash");

-- CreateIndex
CREATE UNIQUE INDEX "agent_profile_phoneHash_key" ON "public"."agent_profile"("phoneHash");

-- CreateIndex
CREATE INDEX "agent_profile_agentId_idx" ON "public"."agent_profile"("agentId");

-- CreateIndex
CREATE INDEX "agent_profile_phoneHash_idx" ON "public"."agent_profile"("phoneHash");

-- CreateIndex
CREATE INDEX "agent_profile_emailHash_idx" ON "public"."agent_profile"("emailHash");

-- CreateIndex
CREATE INDEX "agent_profile_pinHash_idx" ON "public"."agent_profile"("pinHash");

-- CreateIndex
CREATE INDEX "agent_profile_createdAt_idx" ON "public"."agent_profile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AgentSession_token_key" ON "public"."AgentSession"("token");

-- CreateIndex
CREATE INDEX "AgentSession_agentId_idx" ON "public"."AgentSession"("agentId");

-- CreateIndex
CREATE INDEX "AgentSession_expiresAt_idx" ON "public"."AgentSession"("expiresAt");

-- CreateIndex
CREATE INDEX "DeletionSchedule_agentId_idx" ON "public"."DeletionSchedule"("agentId");

-- CreateIndex
CREATE INDEX "DeletionSchedule_scheduledAt_idx" ON "public"."DeletionSchedule"("scheduledAt");

-- CreateIndex
CREATE INDEX "verification_status_emailVerified_idx" ON "public"."verification_status"("emailVerified");

-- CreateIndex
CREATE INDEX "verification_status_phoneVerified_idx" ON "public"."verification_status"("phoneVerified");

-- CreateIndex
CREATE INDEX "verification_status_ninVerified_idx" ON "public"."verification_status"("ninVerified");

-- CreateIndex
CREATE INDEX "verification_status_bvnVerified_idx" ON "public"."verification_status"("bvnVerified");

-- CreateIndex
CREATE INDEX "verification_status_dobVerified_idx" ON "public"."verification_status"("dobVerified");

-- CreateIndex
CREATE INDEX "verification_status_genderVerified_idx" ON "public"."verification_status"("genderVerified");

-- CreateIndex
CREATE INDEX "verification_status_documentVerified_idx" ON "public"."verification_status"("documentVerified");

-- CreateIndex
CREATE INDEX "verification_status_lastCheckedAt_idx" ON "public"."verification_status"("lastCheckedAt");

-- CreateIndex
CREATE INDEX "verification_status_emailVerifiedDate_idx" ON "public"."verification_status"("emailVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_phoneVerifiedDate_idx" ON "public"."verification_status"("phoneVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_ninVerifiedDate_idx" ON "public"."verification_status"("ninVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_bvnVerifiedDate_idx" ON "public"."verification_status"("bvnVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_dobVerifiedDate_idx" ON "public"."verification_status"("dobVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_genderVerifiedDate_idx" ON "public"."verification_status"("genderVerifiedDate");

-- CreateIndex
CREATE INDEX "verification_status_documentVerifiedDate_idx" ON "public"."verification_status"("documentVerifiedDate");

-- CreateIndex
CREATE INDEX "failed_attempts_agentId_idx" ON "public"."failed_attempts"("agentId");

-- CreateIndex
CREATE INDEX "failed_attempts_action_idx" ON "public"."failed_attempts"("action");

-- CreateIndex
CREATE INDEX "failed_attempts_createdAt_idx" ON "public"."failed_attempts"("createdAt");

-- CreateIndex
CREATE INDEX "failed_attempts_ipAddress_idx" ON "public"."failed_attempts"("ipAddress");

-- CreateIndex
CREATE INDEX "failed_deletion_attempts_agentId_idx" ON "public"."failed_deletion_attempts"("agentId");

-- CreateIndex
CREATE INDEX "failed_deletion_attempts_createdAt_idx" ON "public"."failed_deletion_attempts"("createdAt");

-- CreateIndex
CREATE INDEX "failed_deletion_attempts_ipAddress_idx" ON "public"."failed_deletion_attempts"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "account_locks_agentId_key" ON "public"."account_locks"("agentId");

-- CreateIndex
CREATE INDEX "account_locks_agentId_idx" ON "public"."account_locks"("agentId");

-- CreateIndex
CREATE INDEX "account_locks_expiresAt_idx" ON "public"."account_locks"("expiresAt");

-- CreateIndex
CREATE INDEX "account_locks_action_idx" ON "public"."account_locks"("action");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_tokenHash_key" ON "public"."password_reset_token"("tokenHash");

-- CreateIndex
CREATE INDEX "password_reset_token_agentId_idx" ON "public"."password_reset_token"("agentId");

-- CreateIndex
CREATE INDEX "password_reset_token_expiresAt_idx" ON "public"."password_reset_token"("expiresAt");

-- CreateIndex
CREATE INDEX "password_reset_event_agentId_createdAt_idx" ON "public"."password_reset_event"("agentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "public"."user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "public"."user"("phoneNumber");

-- CreateIndex
CREATE INDEX "user_username_idx" ON "public"."user"("username");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "public"."user"("email");

-- CreateIndex
CREATE INDEX "user_phoneNumber_idx" ON "public"."user"("phoneNumber");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "public"."user"("createdAt");

-- CreateIndex
CREATE INDEX "user_updatedAt_idx" ON "public"."user"("updatedAt");

-- CreateIndex
CREATE INDEX "user_country_idx" ON "public"."user"("country");

-- CreateIndex
CREATE INDEX "user_state_idx" ON "public"."user"("state");

-- CreateIndex
CREATE INDEX "user_city_idx" ON "public"."user"("city");

-- CreateIndex
CREATE INDEX "user_address_idx" ON "public"."user"("address");

-- CreateIndex
CREATE INDEX "user_bio_idx" ON "public"."user"("bio");

-- CreateIndex
CREATE INDEX "user_phoneVerified_idx" ON "public"."user"("phoneVerified");

-- CreateIndex
CREATE INDEX "user_hasPin_idx" ON "public"."user"("hasPin");

-- CreateIndex
CREATE INDEX "user_isBanned_idx" ON "public"."user"("isBanned");

-- CreateIndex
CREATE INDEX "user_passwordChangedAt_idx" ON "public"."user"("passwordChangedAt");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "public"."session"("userId");

-- CreateIndex
CREATE INDEX "session_expiresAt_idx" ON "public"."session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_account_provider_providerId_key" ON "public"."oauth_account"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."agent_profile" ADD CONSTRAINT "agent_profile_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentSession" ADD CONSTRAINT "AgentSession_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeletionSchedule" ADD CONSTRAINT "DeletionSchedule_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."verification_status" ADD CONSTRAINT "verification_status_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."failed_attempts" ADD CONSTRAINT "failed_attempts_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."failed_deletion_attempts" ADD CONSTRAINT "failed_deletion_attempts_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account_locks" ADD CONSTRAINT "account_locks_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."password_reset_token" ADD CONSTRAINT "password_reset_token_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."password_reset_token" ADD CONSTRAINT "password_reset_token_agentProfileId_fkey" FOREIGN KEY ("agentProfileId") REFERENCES "public"."agent_profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."password_reset_event" ADD CONSTRAINT "password_reset_event_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_role" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."oauth_account" ADD CONSTRAINT "oauth_account_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
