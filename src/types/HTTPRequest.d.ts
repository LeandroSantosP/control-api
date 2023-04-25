export interface HTTPRequest<T> {
   statusCode: number;
   body: T;
   type: 'json' | 'send';
}
