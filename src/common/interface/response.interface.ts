export interface ResponseInterface<T> {
  status_code: number;
  message: string;
  result: T;
}