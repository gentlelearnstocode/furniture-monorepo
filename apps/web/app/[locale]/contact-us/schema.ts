import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
  phoneCountry: z.string(),
  phoneNumber: z.string().min(8, { message: 'Số điện thoại không hợp lệ.' }),
  email: z.string().email({ message: 'Email không hợp lệ.' }).optional().or(z.literal('')),
  content: z.string().min(10, { message: 'Nội dung phải có ít nhất 10 ký tự.' }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
