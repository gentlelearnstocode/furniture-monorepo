export interface ActionResponse<T = unknown> {
  success?: boolean;
  error?: string;
  data?: T;
}

export interface PageProps<T = { [key: string]: string }> {
  params: Promise<T>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
