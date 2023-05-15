import { HTTPRequest } from '@/types/HTTPRequest';
import { Request } from 'express';
import { container } from 'tsyringe';
import { TransactionPdfUseCase } from '../useCases/TransactionPdfUseCase';

class TransactionPdfController {
   async handle(req: Request): Promise<HTTPRequest<Buffer>> {
      const { options, subject, title } = req.body;
      const { id } = req.client;

      const useCase = container.resolve(TransactionPdfUseCase);

      const PdfBuffer = await useCase.execute({
         body: {
            subject,
            title,
         },
         options,
         user_id: id,
      });

      return {
         body: PdfBuffer,
         statusCode: 200,
         type: 'json',
      };
   }
}

export { TransactionPdfController };
