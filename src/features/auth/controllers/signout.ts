import { Request, Response, request } from "express";
import { StatusCodes } from "http-status-codes";

export class SignOut {
    public async update(req:Request, res: Response ): Promise<void> {
        req.session = null;
        res.status(StatusCodes.OK).json({message: 'Logout successfully', user: {}, token: ''})
    }
}