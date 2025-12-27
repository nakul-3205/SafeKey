import { logger } from "../utils/logger";
import { db } from "../config/db";
import { vaultEmail } from "../db/schema/email.schema";
import { ApiError } from "../utils/apiError";
import { ERROR_CODES } from "../utils/errorCodes";
import { eq, and } from "drizzle-orm";

const MAX_EMAIL = 25;

export class vaultEmailService {

async createEmail(email: string, userId: string, name?: string) {

// 1. Check max email limit
const emailCount = await db
    .select({ id: vaultEmail.id })
    .from(vaultEmail)
    .where(eq(vaultEmail.user_id, userId));

if (emailCount.length >= MAX_EMAIL) {
    throw new ApiError(
    400,
    `You can only store up to ${MAX_EMAIL} emails`,
    ERROR_CODES.RATE_LIMITED
    );
}

// 2. Check duplicate email
const existing = await db
    .select({ id: vaultEmail.id })
    .from(vaultEmail)
    .where(
    and(
        eq(vaultEmail.user_id, userId),
        eq(vaultEmail.email, email)
    )
    )
    .limit(1);

if (existing.length > 0) {
    throw new ApiError(
    400,
    "Email already exists",
    ERROR_CODES.ALREADY_EXISTS
    );
}

// 3. Insert email
const [createdEmail] = await db
    .insert(vaultEmail)
    .values({
    email,
    user_id: userId,
    name,
    })
    .returning();

logger.info("Email added to vault");

return createdEmail;
}

async getAllEmails(userId: string) {
const emails = await db
    .select()
    .from(vaultEmail)
    .where(eq(vaultEmail.user_id, userId))
    .orderBy(vaultEmail.created_at);

return emails;
}
}
