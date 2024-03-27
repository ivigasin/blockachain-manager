import { BlockProcessorService } from './block-processor.service';
import { readFile } from 'fs/promises';
import { Logger } from '@nestjs/common';

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

describe('BlockProcessorService', () => {
  let service: BlockProcessorService;

  beforeEach(() => {
    service = new BlockProcessorService();
    (readFile as jest.Mock).mockImplementation(() => Promise.resolve(JSON.stringify({
      "blocks": [
        {
          "id": 0,
          "transactions": [
            {
              "id": 0,
              "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
              "register": [101, 102, 103, 104]
            }
          ]
        },
        {
          "id": 1,
          "transactions": [
            {
              "id": 0,
              "address": "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
              "register": [102, 105, 106, 107]
            }
          ]
        },
        {
          "id": 2,
          "transactions": [
            {
              "id": 0,
              "address": "0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6",
              "register": []
            },
            {
              "id": 1,
              "address": "0x999c49fE1c1FC19292e9895d877BB8715040A609",
              "register": [101, 102, 103, 107]
            }
          ]
        }
      ]
    })));
  });

  it('should process the file and generate the correct state', async () => {
    await service.processFile('path/to/blocks.json','seesi', 'blocks.json', 2);
    const state = service.getStateBySession('blocks.json');
    console.log(JSON.stringify(state));
    expect(state.validators.length).toBe(3);
    expect(state.operators.length).toBe(7);
  });
});
