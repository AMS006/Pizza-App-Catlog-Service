import { Request } from "express";

export interface AuthRequest extends Request {
    auth: {
        id?: "string";
        sub: string;
        role: string;
    };
}
