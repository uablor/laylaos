// validated-body.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const ValidatedBody = createParamDecorator(
  async (dtoClass: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;

    const dtoInstance = plainToInstance(dtoClass, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }

    return dtoInstance;
  },
);