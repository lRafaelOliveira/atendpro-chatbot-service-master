import { Test, TestingModule } from '@nestjs/testing';
import { BotManagerService } from './bot-manager.service';

describe('BotManagerService', () => {
  let service: BotManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotManagerService],
    }).compile();

    service = module.get<BotManagerService>(BotManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
