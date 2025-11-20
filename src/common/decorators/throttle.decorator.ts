// 📁 src/common/decorators/throttle.decorator.ts
import { Throttle } from '@nestjs/throttler';

export const THROTTLE_PRESETS = {
  auth: { limit: 5, ttl: 60000 },
  api: { limit: 60, ttl: 60000 },
  upload: { limit: 10, ttl: 300000 },
  public: { limit: 100, ttl: 60000 },
} as const;

type PresetName = keyof typeof THROTTLE_PRESETS;

export const ApplyThrottle = (
  preset: PresetName,
  override?: Partial<{ limit: number; ttl: number }>
) => {
  const config = { ...THROTTLE_PRESETS[preset], ...override };
  return Throttle({ [preset]: config });
};