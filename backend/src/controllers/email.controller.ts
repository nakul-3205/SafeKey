// src/controllers/email.controller.ts
import { Request, Response, NextFunction } from "express";
import { vaultEmailService } from "../services/vaultEmail.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateEmailInput } from "../validators/email.validator";

const emailService = new vaultEmailService();

export class EmailController {
// POST /api/emails
createEmail = asyncHandler<{}, {}, CreateEmailInput>(
async (req, res, _next) => {
    const userId = req.user!.user_id;
    const { email, name } = req.body;

    const result = await emailService.createEmail(
    email,
    userId,
    name
    );

    res.status(201).json(
    new ApiResponse(201, result, "Email saved successfully")
    );
}
);

// GET /api/emails
getAllEmails = asyncHandler(async (req, res, _next) => {
const userId = req.user!.user_id;

const emails = await emailService.getAllEmails(userId);

res.status(200).json(
    new ApiResponse(
    200,
    { emails, count: emails.length },
    "Emails retrieved successfully"
    )
);
});
}