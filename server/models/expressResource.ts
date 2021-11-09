import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export type TypedRequest<T> = Request<
  ParamsDictionary,
  any,
  T,
  qs.ParsedQs,
  Record<string, any>
>;
