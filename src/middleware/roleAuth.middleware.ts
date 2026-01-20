import { Request, Response, NextFunction } from "express";

export const allowedRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = req.user?.role;
        console.log("role", role);
        if (!role || !allowedRoles.includes(role)) {
            return res.status(403).json({ message: "Forbidden you are not allowed to access this resource." });
        }

        next();
    };
};
