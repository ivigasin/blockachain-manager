import { Module } from '@nestjs/common';
import { BlockProcessorController } from './block-processor.controller';
import { BlockProcessorService } from './block-processor.service';

@Module({
  imports: [],
  controllers: [BlockProcessorController],
  providers: [BlockProcessorService],
})
export class BlockProcessorModule {}
