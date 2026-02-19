'use server';

import { db, inboxMessages } from '@repo/database';
import { contactSchema, type ContactFormValues } from './schema';

export async function submitContactForm(data: ContactFormValues) {
  const validated = contactSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, message: 'Dữ liệu không hợp lệ.' };
  }

  const { name, email, phoneCountry, phoneNumber, content } = validated.data;
  // Format phone number: remove leading 0 if present to avoid +8409...
  const cleanPhone = phoneNumber.replace(/^0+/, '');
  const fullPhone = `${phoneCountry}${cleanPhone}`;

  try {
    await db.insert(inboxMessages).values({
      name,
      email: email || null,
      phoneNumber: fullPhone,
      content,
    });
    return { success: true, message: 'Gửi tin nhắn thành công!' };
  } catch (error) {
    console.error('Submit contact error:', error);
    return { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
}
