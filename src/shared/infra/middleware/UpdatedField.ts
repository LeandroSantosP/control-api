import { NextFunction, Request, Response } from 'express';

export function setUpdateField(updateValue: boolean) {
   return function (req: Request, res: Response, next: NextFunction) {
      const { props } = req.body;
      const data = JSON.parse(props);
      data.update = updateValue;
      req.body = data;
      return next();
   };
}
