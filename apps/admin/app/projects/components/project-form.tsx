'use client';

import { slugify } from '@/lib/slugify';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { upsertProject } from '@/lib/actions/project';
import { projectSchema, type ProjectInput } from '@/lib/validations/project';

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
import { Checkbox } from '@repo/ui/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/ui/tabs';

import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { MultiImageUpload } from '@/components/ui/multi-image-upload';

interface ProjectFormProps {
  initialData?:
    | (ProjectInput & {
        id: string;
        imageUrl?: string | null;
      })
    | null;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          titleVi: initialData.titleVi || '',
          slug: initialData.slug,
          contentHtml: initialData.contentHtml,
          contentHtmlVi: initialData.contentHtmlVi || '',
          isActive: initialData.isActive,
          seoTitle: initialData.seoTitle || '',
          seoTitleVi: initialData.seoTitleVi || '',
          seoDescription: initialData.seoDescription || '',
          seoDescriptionVi: initialData.seoDescriptionVi || '',
          seoKeywords: initialData.seoKeywords || '',
          seoKeywordsVi: initialData.seoKeywordsVi || '',
          images: initialData.images || [],
        }
      : {
          title: '',
          titleVi: '',
          slug: '',
          contentHtml: '',
          contentHtmlVi: '',
          isActive: true,
          seoTitle: '',
          seoTitleVi: '',
          seoDescription: '',
          seoDescriptionVi: '',
          seoKeywords: '',
          seoKeywordsVi: '',
          images: [],
        },
  });

  function onSubmit(data: ProjectInput) {
    startTransition(async () => {
      const result = await upsertProject({ ...data, id: initialData?.id });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(initialData ? 'Project updated' : 'Project created');
        router.push('/projects');
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Main details about the project.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (English) *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Project title'
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              const slug = slugify(e.target.value);
                              form.setValue('slug', slug);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='titleVi'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Vietnamese)</FormLabel>
                        <FormControl>
                          <Input placeholder='Tiêu đề dự án' {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder='project-slug' {...field} />
                      </FormControl>
                      <FormDescription>Used in the URL: /projects/{'{slug}'}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='space-y-4 rounded-lg border p-4'>
                  <h4 className='text-sm font-medium'>Content</h4>
                  <Tabs defaultValue='en' className='w-full'>
                    <TabsList className='grid w-full max-w-[200px] grid-cols-2'>
                      <TabsTrigger value='en'>English</TabsTrigger>
                      <TabsTrigger value='vi'>Tiếng Việt</TabsTrigger>
                    </TabsList>
                    <TabsContent value='en'>
                      <FormField
                        control={form.control}
                        name='contentHtml'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RichTextEditor
                                placeholder='Tell the project story...'
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value='vi'>
                      <FormField
                        control={form.control}
                        name='contentHtmlVi'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RichTextEditor
                                placeholder='Kể câu chuyện dự án...'
                                value={field.value || ''}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Metadata</CardTitle>
                <CardDescription>Search engine optimization settings.</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='seoTitle'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Search engine title'
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
                  name='seoDescription'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Search engine description'
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
                  name='seoKeywords'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='keyword1, keyword2'
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
                <CardDescription>Control visibility on the website.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='isActive'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className='space-y-1 leading-none'>
                        <FormLabel>Active Status</FormLabel>
                        <FormDescription className='text-xs'>
                          When active, this project will be visible to users.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
            <CardDescription>Upload and manage images for this project.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      folder='projects'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className='flex justify-end pt-4 border-t'>
          <Button type='submit' disabled={isPending} className='w-full md:w-auto'>
            {isPending ? 'Saving...' : initialData ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
