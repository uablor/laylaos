import { BadRequestException } from '@nestjs/common';

/**
 * ตรวจสอบความ unique ของ field
 * @param findFn ฟังก์ชันที่คืนค่า entity ที่มี field นั้น
 * @param errorMessage ข้อความ error ถ้ามี duplicate
 */
export async function validateUniqueField<T>(
  findFn: () => Promise<T | undefined | null>,
  errorMessage: string,
): Promise<void> {
  const existing = await findFn();
  if (existing) {
    throw new BadRequestException(errorMessage);
  }
}
