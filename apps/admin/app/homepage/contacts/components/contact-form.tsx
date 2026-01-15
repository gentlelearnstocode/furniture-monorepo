'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
  Plus,
  Trash2,
  GripVertical,
  Phone,
  Mail,
  Facebook,
  MessageSquare,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Youtube,
  Instagram,
} from 'lucide-react';

import { upsertSiteContacts, SiteContactsUpdateInput } from '@/lib/actions/contacts';

import { Button } from '@repo/ui/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/ui/form';
import { Input } from '@repo/ui/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/ui/select';
import { Switch } from '@repo/ui/ui/switch';
import { cn } from '@repo/ui/lib/utils';

const siteContactSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(['phone', 'zalo', 'facebook', 'messenger', 'email', 'whatsapp']),
  label: z.string().optional(),
  value: z.string().min(1, 'Value is required'),
  isActive: z.boolean(),
  position: z.number(),
});

const formSchema = z.object({
  contacts: z.array(siteContactSchema),
});

interface ContactFormProps {
  initialData: SiteContactsUpdateInput;
}

const CONTACT_TYPES = [
  { value: 'phone', label: 'Phone Number', icon: Phone },
  { value: 'zalo', label: 'Zalo', icon: MessageCircle },
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'messenger', label: 'Messenger', icon: MessageSquare },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
];

export function ContactForm({ initialData }: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SiteContactsUpdateInput>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control: form.control,
    name: 'contacts',
  });

  function onSubmit(data: SiteContactsUpdateInput) {
    startTransition(async () => {
      const result = await upsertSiteContacts(data);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Site contacts updated successfully');
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0'>
            <div>
              <CardTitle>Contact Points</CardTitle>
              <CardDescription>
                Configure the primary contact channels for your website.
              </CardDescription>
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() =>
                appendContact({
                  type: 'phone',
                  label: '',
                  value: '',
                  isActive: true,
                  position: contactFields.length,
                })
              }
            >
              <Plus className='h-4 w-4 mr-1' />
              Add Contact
            </Button>
          </CardHeader>
          <CardContent className='space-y-4'>
            {contactFields.length === 0 ? (
              <div className='text-center py-12 border-2 border-dashed rounded-lg bg-gray-50'>
                <p className='text-sm text-gray-500'>
                  No contact points added yet. Add your first contact point to get started.
                </p>
                <Button
                  type='button'
                  variant='link'
                  className='mt-2'
                  onClick={() =>
                    appendContact({
                      type: 'phone',
                      label: '',
                      value: '',
                      isActive: true,
                      position: 0,
                    })
                  }
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Add Zalo or Phone
                </Button>
              </div>
            ) : (
              <div className='space-y-4'>
                {contactFields.map((field, index) => {
                  const type = form.watch(`contacts.${index}.type`);
                  const Icon = CONTACT_TYPES.find((t) => t.value === type)?.icon || Phone;

                  return (
                    <div
                      key={field.id}
                      className={cn(
                        'flex flex-col md:flex-row gap-4 p-5 rounded-xl border transition-all duration-200',
                        form.watch(`contacts.${index}.isActive`)
                          ? 'bg-white border-gray-200 shadow-sm'
                          : 'bg-gray-50 border-gray-100 opacity-75'
                      )}
                    >
                      <div className='flex items-start justify-between md:justify-start gap-4'>
                        <div className='mt-2 flex-shrink-0'>
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center',
                              type === 'phone' && 'bg-red-50 text-red-600',
                              type === 'zalo' && 'bg-blue-50 text-blue-600',
                              type === 'facebook' && 'bg-indigo-50 text-indigo-600',
                              type === 'messenger' && 'bg-blue-50 text-blue-500',
                              type === 'email' && 'bg-gray-50 text-gray-600',
                              type === 'whatsapp' && 'bg-green-50 text-green-600'
                            )}
                          >
                            <Icon className='h-5 w-5' />
                          </div>
                        </div>

                        <div className='flex md:hidden gap-2'>
                          <FormField
                            control={form.control}
                            name={`contacts.${index}.isActive`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='text-red-500 hover:text-red-700 hover:bg-red-50'
                            onClick={() => removeContact(index)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>

                      <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <FormField
                          control={form.control}
                          name={`contacts.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs font-semibold uppercase text-gray-400'>
                                Type
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder='Select type' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CONTACT_TYPES.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                      <div className='flex items-center gap-2'>
                                        <t.icon className='h-4 w-4' />
                                        {t.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`contacts.${index}.label`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-xs font-semibold uppercase text-gray-400'>
                                Internal Label
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='e.g. Sales Dept, Hotline'
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`contacts.${index}.value`}
                          render={({ field }) => (
                            <FormItem className='lg:col-span-1'>
                              <FormLabel className='text-xs font-semibold uppercase text-gray-400'>
                                Value (URL or Phone)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={
                                    type === 'phone' || type === 'zalo'
                                      ? '09xxxxxxx'
                                      : 'https://...'
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className='text-[10px]'>
                                {type === 'zalo'
                                  ? 'Just the phone number'
                                  : 'Enter a full URL or handle (e.g. m.me/...)'}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='hidden md:flex items-center gap-4 border-l pl-4'>
                        <FormField
                          control={form.control}
                          name={`contacts.${index}.isActive`}
                          render={({ field }) => (
                            <FormItem className='flex flex-col items-center gap-1'>
                              <FormLabel className='text-[10px] font-semibold uppercase text-gray-400'>
                                Active
                              </FormLabel>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='mt-4 text-red-500 hover:text-red-700 hover:bg-red-50'
                          onClick={() => removeContact(index)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className='flex justify-end pt-4 border-t'>
          <Button
            type='submit'
            disabled={isPending}
            className='min-w-[150px] bg-[#7B0C0C] hover:bg-[#5a0909]'
          >
            {isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
