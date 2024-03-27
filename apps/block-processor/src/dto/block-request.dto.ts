import { Block, Operator, Validator } from '@app/common/interfaces'; // Ensure this import points to where your Block interface is defined
import { Type, Transform, plainToClass, classToPlain } from 'class-transformer';

export class BlockRequestDto {
  fileName: string;
  session: string;
  blockId: number;
}