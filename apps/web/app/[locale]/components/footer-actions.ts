'use server';

import { db, inboxMessages } from '@repo/database';
import { z } from 'zod';

const subscribeSchema = z.object({
  contact: z.string().min(1, { message: 'Required' }),
});

export async function submitFooterSubscribe(data: { contact: string }) {
  const validated = subscribeSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, message: 'Invalid data.' };
  }

  const { contact } = validated.data;

  // Basic validation to check if it's an email or a phone number
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isPhone = /^[0-9+\s-]{8,15}$/.test(contact);

  if (!isEmail && !isPhone) {
    return { success: false, message: 'Please enter a valid email or phone number.' };
  }

  const email = isEmail ? contact : null;
  const phoneNumber = isPhone ? contact : 'N/A';

  try {
    await db.insert(inboxMessages).values({
      name: 'Khách hàng (Footer)',
      email,
      phoneNumber,
      content: 'Đăng ký tư vấn từ form ở Footer.',
    });
    return { success: true, message: 'Gửi yêu cầu thành công!' };
  } catch (error) {
    console.error('Submit footer subscribe error:', error);
    return { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
}
