'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, GripVertical, MapPin, Phone, Mail, Share2 } from 'lucide-react';

import { upsertFooterSettings } from '@/lib/actions/footer';
import { footerSettingsSchema, type FooterSettingsInput } from '@/lib/validations/footer';

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
import { Textarea } from '@repo/ui/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/ui/select';
import { Switch } from '@repo/ui/ui/switch';

type FooterFormData = FooterSettingsInput;

interface FooterFormProps {
  initialData: FooterFormData;
}

export function FooterForm({ initialData }: FooterFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<FooterFormData>({
    resolver: zodResolver(footerSettingsSchema),
    defaultValues: initialData,
  });

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control: form.control,
    name: 'addresses',
  });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({
    control: form.control,
    name: 'contacts',
  });

  const {
    fields: socialLinkFields,
    append: appendSocialLink,
    remove: removeSocialLink,
  } = useFieldArray({
    control: form.control,
    name: 'socialLinks',
  });

  function onSubmit(data: FooterFormData) {
    startTransition(async () => {
      const result = await upsertFooterSettings(data);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Footer settings updated successfully');
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Main Content */}
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Main text displayed in the footer section.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='intro'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intro Title (English) *</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. THIEN AN FURNITURE' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='introVi'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intro Title (Vietnamese)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. NỘI THẤT THIÊN ẤN'
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Enter company description...'
                            className='min-h-[100px]'
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
                    name='descriptionVi'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Vietnamese)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Nhập mô tả công ty...'
                            className='min-h-[100px]'
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Google Maps</CardTitle>
                <CardDescription>Embed URL for the map displayed in the footer.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='mapEmbedUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Map Embed URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='https://www.google.com/maps/embed?...'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription className='text-xs'>
                        Go to Google Maps → Share → Embed → Copy the src URL from the iframe.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Addresses and Contacts */}
          <div className='space-y-6'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5' />
                    Addresses
                  </CardTitle>
                  <CardDescription>Add multiple office or showroom locations.</CardDescription>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    appendAddress({ label: '', address: '', position: addressFields.length })
                  }
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Add
                </Button>
              </CardHeader>
              <CardContent className='space-y-4'>
                {addressFields.length === 0 ? (
                  <p className='text-sm text-gray-500 text-center py-4'>
                    No addresses added yet. Click &quot;Add&quot; to add one.
                  </p>
                ) : (
                  addressFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='flex gap-3 items-start p-4 bg-gray-50 rounded-lg'
                    >
                      <GripVertical className='h-5 w-5 text-gray-400 mt-2 flex-shrink-0' />
                      <div className='flex-1 space-y-3'>
                        <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.label`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input placeholder='Label (English)' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.labelVi`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder='Label (Vietnamese)'
                                    {...field}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.address`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder='Address (English)'
                                    className='min-h-[60px]'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.addressVi`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder='Địa chỉ (Vietnamese)'
                                    className='min-h-[60px]'
                                    {...field}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='text-red-500 hover:text-red-700 hover:bg-red-50'
                        onClick={() => removeAddress(index)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Phone className='h-5 w-5' />
                    Contact Information
                  </CardTitle>
                  <CardDescription>Add phone numbers and email addresses.</CardDescription>
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
                      position: contactFields.length,
                    })
                  }
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Add
                </Button>
              </CardHeader>
              <CardContent className='space-y-4'>
                {contactFields.length === 0 ? (
                  <p className='text-sm text-gray-500 text-center py-4'>
                    No contacts added yet. Click &quot;Add&quot; to add one.
                  </p>
                ) : (
                  contactFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='flex gap-3 items-start p-4 bg-gray-50 rounded-lg'
                    >
                      <div className='mt-2 flex-shrink-0'>
                        {form.watch(`contacts.${index}.type`) === 'phone' ? (
                          <Phone className='h-5 w-5 text-gray-400' />
                        ) : (
                          <Mail className='h-5 w-5 text-gray-400' />
                        )}
                      </div>
                      <div className='flex-1 space-y-3'>
                        <div className='grid grid-cols-2 gap-3'>
                          <FormField
                            control={form.control}
                            name={`contacts.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select type' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='phone'>Phone</SelectItem>
                                    <SelectItem value='email'>Email</SelectItem>
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
                                <FormControl>
                                  <Input
                                    placeholder='Label (optional)'
                                    {...field}
                                    value={field.value || ''}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`contacts.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={
                                    form.watch(`contacts.${index}.type`) === 'phone'
                                      ? '(+84)-28-391-05650'
                                      : 'email@example.com'
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
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
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Share2 className='h-5 w-5' />
                    Social Media Links
                  </CardTitle>
                  <CardDescription>Add social media links for the footer.</CardDescription>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    appendSocialLink({
                      platform: 'facebook',
                      url: '',
                      isActive: true,
                      position: socialLinkFields.length,
                    })
                  }
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Add
                </Button>
              </CardHeader>
              <CardContent className='space-y-4'>
                {socialLinkFields.length === 0 ? (
                  <p className='text-sm text-gray-500 text-center py-4'>
                    No social links added yet. Click &quot;Add&quot; to add one.
                  </p>
                ) : (
                  socialLinkFields.map((field, index) => (
                    <div
                      key={field.id}
                      className='flex gap-3 items-start p-4 bg-gray-50 rounded-lg'
                    >
                      <GripVertical className='h-5 w-5 text-gray-400 mt-2 flex-shrink-0' />
                      <div className='flex-1 space-y-3'>
                        <div className='grid grid-cols-2 gap-3'>
                          <FormField
                            control={form.control}
                            name={`socialLinks.${index}.platform`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Platform</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='Select platform' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='facebook'>Facebook</SelectItem>
                                    <SelectItem value='instagram'>Instagram</SelectItem>
                                    <SelectItem value='youtube'>YouTube</SelectItem>
                                    <SelectItem value='zalo'>Zalo</SelectItem>
                                    <SelectItem value='tiktok'>TikTok</SelectItem>
                                    <SelectItem value='linkedin'>LinkedIn</SelectItem>
                                    <SelectItem value='twitter'>Twitter</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`socialLinks.${index}.isActive`}
                            render={({ field }) => (
                              <FormItem className='flex flex-row items-center justify-between space-y-0 rounded-lg border p-3'>
                                <div className='space-y-0.5'>
                                  <FormLabel>Active</FormLabel>
                                  <FormDescription className='text-xs'>
                                    Show on website
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`socialLinks.${index}.url`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL</FormLabel>
                              <FormControl>
                                <Input placeholder='https://facebook.com/yourpage' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='text-red-500 hover:text-red-700 hover:bg-red-50'
                        onClick={() => removeSocialLink(index)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='flex justify-end pt-4 border-t'>
          <Button type='submit' disabled={isPending} className='w-full md:w-auto'>
            {isPending ? 'Saving...' : 'Save Footer Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
