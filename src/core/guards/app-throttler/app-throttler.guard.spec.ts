import { AppThrottlerGuard } from './app-throttler.guard';

describe('AppThrottlerGuard', () => {
  it('should be defined', () => {
    expect(AppThrottlerGuard).toBeDefined(); //correct: new AppThrottlerGuard()
  });
});
