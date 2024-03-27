import { Controller } from '@nestjs/common';
import { BlockProcessorService } from './block-processor.service';
import { BlockRequestDto } from './dto/block-request.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class BlockProcessorController {
  constructor(private readonly blockProcessorService: BlockProcessorService) {}

  @MessagePattern({ cmd: 'process_blocks' })
  processBlocks(data: BlockRequestDto) {
    const filePath =  '/usr/src/app/libs/files/';
    return this.blockProcessorService.processFile(
      filePath, data.fileName, data.session, data.blockId
    );
  }

  @MessagePattern({ cmd: 'get-file-state' })
  getFileState(data: { session: string }) {
    return this.blockProcessorService.getStateBySession(data.session);
  }

}
