// src/controllers/salt.controller.ts
import { Request, Response, NextFunction } from "express";
import { SaltVaultService } from "../services/vault.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
  CreateSaltInput,
} from "../validators/vault.validator";

const saltVaultService = new SaltVaultService();

export class SaltVaultController {
createSalt = asyncHandler<{}, {}, CreateSaltInput>(
async (req, res, _next) => {
    const userId = req.user!.user_id;
    const { salt, version } = req.body;

    const result = await saltVaultService.createSalt(userId, salt, version);

    res.status(201).json(
    new ApiResponse(201, result, "Salt created successfully")
    );
}
);

getSalt = asyncHandler(
async (req, res, _next) => {
    const userId = req.user!.user_id;

    const salt = await saltVaultService.getSalt(userId);

    res.status(200).json(
    new ApiResponse(200, salt, "Salt retrieved successfully")
    );
}
);

}