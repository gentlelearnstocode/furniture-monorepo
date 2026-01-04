'use client';

import { useState } from 'react';
import { Switch } from '@repo/ui/ui/switch';
import { toggleCollectionHomeVisibility } from '@/lib/actions/collections';
import { toast } from 'sonner';

interface HomeVisibilityToggleProps {
  id: string;
  initialValue: boolean;
}

export function HomeVisibilityToggle({ id, initialValue }: HomeVisibilityToggleProps) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(initialValue);

  async function handleToggle(value: boolean) {
    setLoading(true);
    setChecked(value);

    try {
      const result = await toggleCollectionHomeVisibility(id, value);
      if (result.error) {
        toast.error(result.error);
        setChecked(!value); // Revert
      } else {
        toast.success(value ? 'Collection shown on home page' : 'Collection hidden from home page');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred');
      setChecked(!value); // Revert
    } finally {
      setLoading(false);
    }
  }

  return <Switch checked={checked} onCheckedChange={handleToggle} disabled={loading} />;
}
