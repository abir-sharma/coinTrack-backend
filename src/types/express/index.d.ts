import { JwtPayload } from "../../types/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}
