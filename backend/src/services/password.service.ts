// src/services/vault.service.ts
import { eq, and, count } from "drizzle-orm";
import { db } from "../config/db";
import { vaultPasswords } from "../db/schema/password.schema";
import { ApiError } from "../utils/apiError";
import { ERROR_CODES } from "../utils/errorCodes";
import { logger } from "../utils/logger";

const MAX_PASSWORDS_PER_USER = 100;

interface PasswordData {
name: string;
ciphertext: string;
iv: string;
auth_tag: string;
hibp_sha1_prefix: string;
}

export class VaultService {
    // Create a new password entry
    async createPassword(
        userId: string,
        data: PasswordData
        ): Promise<{ id: string }> {
        // Check password limit
        const [{ value }] = await db
            .select({ value: count() })
            .from(vaultPasswords)
            .where(eq(vaultPasswords.user_id, userId));

        const totalPasswords = Number(value);

        if (totalPasswords >= MAX_PASSWORDS_PER_USER) {
            throw new ApiError(
            400,
            `Password limit reached. Maximum ${MAX_PASSWORDS_PER_USER} passwords allowed.`,
            ERROR_CODES.RATE_LIMITED
            );
        }

        // Insert password
        const [row] = await db
            .insert(vaultPasswords)
            .values({
            user_id: userId,
            name: data.name,
            ciphertext: data.ciphertext,
            iv: data.iv,
            auth_tag: data.auth_tag,
            hibp_sha1_prefix: data.hibp_sha1_prefix,
            })
            .returning({ id: vaultPasswords.id });

        logger.info(
            { user_id: userId, password_id: row.id },
            "Password created in vault"
        );

        return row;
        }

        // Get all passwords for a user
        async getPasswords(userId: string) {
        const rows = await db
            .select({
            id: vaultPasswords.id,
            name: vaultPasswords.name,
            ciphertext: vaultPasswords.ciphertext,
            iv: vaultPasswords.iv,
            auth_tag: vaultPasswords.auth_tag,
            hibp_sha1_prefix: vaultPasswords.hibp_sha1_prefix,
            created_at: vaultPasswords.created_at,
            updated_at: vaultPasswords.updated_at,
            })
            .from(vaultPasswords)
            .where(eq(vaultPasswords.user_id, userId))
            .orderBy(vaultPasswords.created_at);

        logger.info({ user_id: userId, count: rows.length }, "Passwords retrieved");

        return rows;
    }

    // Get a single password
    async getPassword(userId: string, passwordId: string) {
    const [row] = await db
        .select({
        id: vaultPasswords.id,
        name: vaultPasswords.name,
        ciphertext: vaultPasswords.ciphertext,
        iv: vaultPasswords.iv,
        auth_tag: vaultPasswords.auth_tag,
        hibp_sha1_prefix: vaultPasswords.hibp_sha1_prefix,
        created_at: vaultPasswords.created_at,
        updated_at: vaultPasswords.updated_at,
        })
        .from(vaultPasswords)
        .where(
        and(
            eq(vaultPasswords.id, passwordId),
            eq(vaultPasswords.user_id, userId)
        )
        );

    if (!row) {
        throw new ApiError(
        404,
        "Password not found",
        ERROR_CODES.NOT_FOUND
        );
    }

    return row;
    }

    // Update a password
    async updatePassword(
    userId: string,
    passwordId: string,
    data: Partial<PasswordData>
    ) {
    const [updated] = await db
        .update(vaultPasswords)
        .set({
        ...(data.name && { name: data.name }),
        ...(data.ciphertext && { ciphertext: data.ciphertext }),
        ...(data.iv && { iv: data.iv }),
        ...(data.auth_tag && { auth_tag: data.auth_tag }),
        ...(data.hibp_sha1_prefix && { hibp_sha1_prefix: data.hibp_sha1_prefix }),
        })
        .where(
        and(
            eq(vaultPasswords.id, passwordId),
            eq(vaultPasswords.user_id, userId)
        )
        )
        .returning({ id: vaultPasswords.id });

    if (!updated) {
        throw new ApiError(
        404,
        "Password not found",
        ERROR_CODES.NOT_FOUND
        );
    }

    logger.info(
        { user_id: userId, password_id: passwordId },
        "Password updated"
    );

    return updated;
    }

    // Delete a password
    async deletePassword(userId: string, passwordId: string) {
    const [deleted] = await db
        .delete(vaultPasswords)
        .where(
        and(
            eq(vaultPasswords.id, passwordId),
            eq(vaultPasswords.user_id, userId)
        )
        )
        .returning({ id: vaultPasswords.id });

    if (!deleted) {
        throw new ApiError(
        404,
        "Password not found",
        ERROR_CODES.NOT_FOUND
        );
    }

    logger.info(
        { user_id: userId, password_id: passwordId },
        "Password deleted"
    );

    return deleted;
    }

    // Get password count for user
    async getPasswordCount(userId: string): Promise<number> {
    const [{ value }] = await db
        .select({ value: count() })
        .from(vaultPasswords)
        .where(eq(vaultPasswords.user_id, userId));

    return Number(value);
    }

    // Delete all passwords for a user (useful for account deletion)
    async deleteAllPasswords(userId: string): Promise<number> {
    const deleted = await db
        .delete(vaultPasswords)
        .where(eq(vaultPasswords.user_id, userId))
        .returning({ id: vaultPasswords.id });

    logger.info(
        { user_id: userId, count: deleted.length },
        "All passwords deleted for user"
    );

    return deleted.length;
    }
    }