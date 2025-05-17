import { Context } from "koa";

interface ResponseData {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export const sendSuccess = (
  ctx: Context,
  data: any,
  statusCode: number = 200
) => {
  const response: ResponseData = {
    success: true,
    data,
  };

  ctx.status = statusCode;
  ctx.body = response;
};

export const sendError = (
  ctx: Context,
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
) => {
  const response: ResponseData = {
    success: false,
    error: {
      message,
      ...(code && { code }),
      ...(details && { details }),
    },
  };

  ctx.status = statusCode;
  ctx.body = response;
};
