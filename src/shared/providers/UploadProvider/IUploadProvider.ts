export type saveInput = {
   user_id: string;
   image: Express.Multer.File | undefined;
   isUpdate: boolean;
};

export type getUrlProps = {
   options: {
      content_type: string;
      action: 'read' | 'write' | 'delete' | 'resumable';
      expires: string | number | Date;
   };
   imageRef: string;
};

export abstract class IUploadProvider {
   abstract save(props: saveInput): Promise<void | string>;
   abstract delete<I, O>(props: I): Promise<O>;
   abstract getUrl(props: getUrlProps): Promise<string>;
}
