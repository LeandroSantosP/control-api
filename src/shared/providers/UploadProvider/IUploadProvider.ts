export type saveInput = {
   user_id: string;
   image: Express.Multer.File | undefined;
   isUpdate: boolean;
   alreadyImageExits?: boolean;
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
   abstract deleteAll(): Promise<void | Error>;
   abstract getUrl(props: getUrlProps): Promise<string>;
}
