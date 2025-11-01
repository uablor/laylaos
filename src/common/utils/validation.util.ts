import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export async function validateDto<T extends object>(
  dtoClass: new () => T,
  plainObject: object,
): Promise<T> {
  const instance = plainToInstance(dtoClass, plainObject);

  try {
    await validateOrReject(instance);
  } catch (errors) {
    const messages: string[] = [];
    const flattenErrors = (errs: ValidationError[]) => {
      errs.forEach(err => {
        if (err.constraints) {
          messages.push(...Object.values(err.constraints));
        }
        if (err.children && err.children.length) {
          flattenErrors(err.children);
        }
      });
    };
    flattenErrors(errors as ValidationError[]);
    throw new BadRequestException(messages);
  }

  return instance;
}
