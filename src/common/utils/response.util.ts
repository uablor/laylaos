import { MessageResponse } from '../enum/message.reponse.enum';
import { ResponseInterface } from '../interface/response.interface';

export function formatResponse<T>(
  result: T,
  message :MessageResponse = MessageResponse.SUCCESS, 
  status_code = 200,
): ResponseInterface<T> {
  return {
    status_code,
    message,
    result,
  };
}
