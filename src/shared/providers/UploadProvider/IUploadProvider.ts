export type saveInput = {
   user_id: string;
   image: Express.Multer.File | undefined;
};

export abstract class IUploadProvider {
   abstract save(props: saveInput): Promise<void | string>;
   abstract delete<I, O>(props: I): Promise<O>;
}
