import { EditTransactionCategoryAndDescriptionUseCase } from '../useCases/EditTransactionCategoryAndDescriptionUseCase';
import { HTTPRequest } from '@/types/HTTPRequest';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export class EditTransactionsCategoryAndDescriptionController {
   async handle(req: Request, res: Response): Promise<HTTPRequest<void>> {
      const { id } = req.client;
      const { transaction_id } = req.params;
      const { category, description } = req.body;

      const useCase = container.resolve(
         EditTransactionCategoryAndDescriptionUseCase
      );

      await useCase.execute({
         user_id: id,
         transaction_id,
         category,
         description,
      });

      return {
         body: undefined,
         type: 'json',
         statusCode: 204,
      };
   }
}
