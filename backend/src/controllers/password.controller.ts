// src/controllers/vault.controller.ts
import { Request, Response, NextFunction } from "express";
import { VaultService } from "../services/password.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
CreatePasswordInput,
UpdatePasswordInput,
} from "../validators/password.validator";

const vaultService = new VaultService();

export class VaultController {
// POST /api/vault/passwords
createPassword = asyncHandler(
async (
    req: Request<{}, {}, CreatePasswordInput>,
    res: Response,
    _next: NextFunction
) => {
    const userId = req.user!.user_id;
    const { name, ciphertext, iv, auth_tag, hibp_sha1_prefix } = req.body;

    const password = await vaultService.createPassword(userId, {
    name,
    ciphertext,
    iv,
    auth_tag,
    hibp_sha1_prefix,
    });

    res.status(201).json(
    new ApiResponse(201, password, "Password saved to vault successfully")
    );
}
);

// GET /api/vault/passwords
getAllPasswords = asyncHandler(
async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.user_id;

    const passwords = await vaultService.getPasswords(userId);

    res.status(200).json(
    new ApiResponse(
        200,
        { passwords, count: passwords.length },
        "Passwords retrieved successfully"
    )
    );
}
);




// PUT /api/vault/passwords/:id
updatePassword = asyncHandler(
async (
    req: Request<{ id: string }, {}, UpdatePasswordInput>,
    res: Response,
    _next: NextFunction
) => {
    const userId = req.user!.user_id;
    const { id } = req.params;
    const { name, ciphertext, iv, auth_tag, hibp_sha1_prefix } = req.body;

    const updated = await vaultService.updatePassword(userId, id, {
    name,
    ciphertext,
    iv,
    auth_tag,
    hibp_sha1_prefix,
    });

    res.status(200).json(
    new ApiResponse(200, updated, "Password updated successfully")
    );
}
);

// DELETE /api/vault/passwords/:id
deletePassword = asyncHandler(
async (
    req: Request<{ id: string }>,
    res: Response,
    _next: NextFunction
) => {
    const userId = req.user!.user_id;
    const { id } = req.params;

    await vaultService.deletePassword(userId, id);

    res.status(200).json(
    new ApiResponse(200, null, "Password deleted successfully")
    );
}
);

// GET /api/vault/stats
getStats = asyncHandler(
async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.user_id;

    const count = await vaultService.getPasswordCount(userId);

    res.status(200).json(
    new ApiResponse(
        200,
        { total_passwords: count, max_passwords: 100 },
        "Vault stats retrieved successfully"
    )
    );
}
);

// DELETE /api/vault/passwords (delete all)
deleteAllPasswords = asyncHandler(
async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.user_id;

    const deletedCount = await vaultService.deleteAllPasswords(userId);

    res.status(200).json(
    new ApiResponse(
        200,
        { deleted_count: deletedCount },
        "All passwords deleted successfully"
    )
    );
}
);
}