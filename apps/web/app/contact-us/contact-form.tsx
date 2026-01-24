'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

import { Button } from '@repo/ui/ui/button';
import { Input } from '@repo/ui/ui/input';
import { Textarea } from '@repo/ui/ui/textarea';
import { Label } from '@repo/ui/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/ui/select';

import { submitContactForm } from './actions';
import { contactSchema, type ContactFormValues } from './schema';

const COUNTRY_CODES = [
  { code: '+84', country: 'VN', label: 'Vietnam (+84)' },
  { code: '+1', country: 'US', label: 'USA (+1)' },
  { code: '+44', country: 'UK', label: 'UK (+44)' },
  { code: '+61', country: 'AU', label: 'Australia (+61)' },
  { code: '+81', country: 'JP', label: 'Japan (+81)' },
  { code: '+82', country: 'KR', label: 'Korea (+82)' },
  { code: '+86', country: 'CN', label: 'China (+86)' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)' },
];

export function ContactForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phoneCountry: '+84',
      phoneNumber: '',
      email: '',
      content: '',
    },
  });

  function onSubmit(data: ContactFormValues) {
    startTransition(async () => {
      const result = await submitContactForm(data);
      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className='w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100'>
      <div className='mb-8 text-center'>
        <h2 className='text-2xl font-serif font-bold text-gray-900 mb-2'>
          Gửi tin nhắn cho chúng tôi
        </h2>
        <p className='text-gray-500'>Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Họ và tên <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='Nhập họ và tên của bạn' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label>
                Số điện thoại <span className='text-red-500'>*</span>
              </Label>
              <div className='flex gap-2'>
                <FormField
                  control={form.control}
                  name='phoneCountry'
                  render={({ field }) => (
                    <FormItem className='w-[110px] space-y-0'>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='+84' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRY_CODES.map((item) => (
                            <SelectItem key={item.code} value={item.code}>
                              <span className='flex items-center gap-2'>
                                <span>{item.country}</span>
                                <span className='text-gray-500'>{item.code}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem className='flex-1 space-y-0'>
                      <FormControl>
                        <Input placeholder='Số điện thoại' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='example@email.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nội dung <span className='text-red-500'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Bạn cần tư vấn về sản phẩm nào?'
                    className='min-h-[120px] resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full bg-[#7B0C0C] hover:bg-[#900000] h-12 text-base font-medium'
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className='mr-2 h-4 w-4' />
                Gửi tin nhắn
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
