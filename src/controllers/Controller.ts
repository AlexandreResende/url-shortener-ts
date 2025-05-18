import { Request, Response, RequestHandler, NextFunction } from "express";
import { HttpVerb } from "../routers/Routers";

export type ParametersField = 'query' | 'params' | 'body';

export type CustomRequest<RequestParams, RequestBody, RequestQuery> = Request<RequestParams, any, RequestBody, RequestQuery>;

export type CustomResponse<T> = Response<T>;

export type CustomRequestHandler = RequestHandler;

export type CustomNextFunction = NextFunction;

export default abstract class Controller<RequestParams, RequestBody, RequestQuery, ResponseInterface> {
  constructor(
    public readonly method: HttpVerb,
    public readonly path: string,
  ) {
    this.method = method;
    this.path = path;
  }

  public abstract readonly middlewares: CustomRequestHandler[];
  public abstract handleRequest(
    req: CustomRequest<RequestParams, RequestBody, RequestQuery>,
    res: CustomResponse<ResponseInterface>
  ): Promise<void>;
}