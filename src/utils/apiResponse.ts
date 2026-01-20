import { Response } from "express";
import { ApiResponse } from "../types/response";

export const success = <T>(
  res: Response,
  data: T,
  message = "Success",
  status = 200
): Response<ApiResponse<T>> => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};



// export const error = <T>(
//   res: Response,
//   message: string,
//   status = 400
// ): Response<ApiResponse<T>> => {
//   return res.status(status).json({
//     success: false,
//     message,
//     data: null
//   });
// };
