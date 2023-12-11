import { Request, Response, NextFunction } from 'express';
import {
  validate,
  IsArray,
  IsString,
  IsUrl,
  ArrayMinSize,
} from 'class-validator';

class AddValidationPrevLinkData {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  urls?: string[];
}

class AddValidationMediaData {
  @IsString()
  @IsUrl()
  imageUrl?: string;
}

export default {
  addValidationPrevLink: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    const validationData = new AddValidationPrevLinkData();
    const { urls } = req.query;
    const arrayUrls = JSON.parse(urls as string);

    validationData.urls = arrayUrls as string[]; // Assuming it's already an array
    const errors = await validate(validationData);

    if (errors.length > 0) {
      const constraints = errors[0]?.constraints || {};
      const key = Object.keys(constraints)[0];
      return res.status(400).json({
        status: 'Bad Request',
        code: 400,
        message: `Invalid input: ${constraints[key]}`,
      });
    }

    next();
  },

  addValidationMedia: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    const validationData = new AddValidationMediaData();

    validationData.imageUrl =
      typeof req.query.url === 'string' ? req.query.url : undefined;

    const errors = await validate(validationData);

    if (errors.length > 0) {
            const constraints = errors[0]?.constraints || {};
      const key = Object.keys(constraints)[0];
      return res.status(400).json({
        status: 'Bad Request',
        code: 400,
        message: `Missing required ${constraints[key]} field`,
      });
    }

    next();
  },
};
