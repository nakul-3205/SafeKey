import { logger } from "../utils/logger";
import { db } from "../config/db";
import { vault } from "../db/schema/vault.schema";
import { ApiError } from "../utils/apiError";
import { ERROR_CODES } from "../utils/errorCodes";
import { eq } from "drizzle-orm";



export class SaltVaultService {
async createSalt(
    userId: string,
    salt: string,
    version: number = 1
): Promise<{ id: string }> {
    const existingSalt = await db
                        .select()
                        .from(vault)
                        .where(eq(vault.user_id, userId))
                        .limit(1);


    if (existingSalt) {
        throw new ApiError(
        409,
        "Salt already exists for this user. Use updateSalt instead.",
        ERROR_CODES.USER_EXISTS
        );
      }

    const [row] = await db
    .insert(vault)
    .values({
        user_id: userId,
        salt,
        version,
    })
    .returning({ id: vault.id });

    logger.info({ user_id: userId, version }, "Salt created in vault");

    return row;
}

// Get salt for user
async getSalt(userId: string) {
    const result = await db
                    .select({
                        salt: vault.salt,
                        version: vault.version,
                    })
                    .from(vault)
                    .where(eq(vault.user_id, userId))
                    .limit(1);


    if (!result) {
    throw new ApiError(
        404,
        "Salt not found. Please create a salt first.",
        ERROR_CODES.NOT_FOUND
    );
    }

    logger.info({ user_id: userId }, "Salt retrieved");

    return result;
}}