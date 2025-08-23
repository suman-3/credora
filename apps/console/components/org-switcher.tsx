'use client';

import { Command } from 'lucide-react';

import { SidebarMenu, SidebarMenuButton } from '@workspace/ui/components/sidebar';
import { Skeleton } from '@workspace/ui/components/skeleton';

export function OrgSwitcher({
  role,
  isLoading
}: {
  role: string;
  isLoading: boolean;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuButton
        size='lg'
        className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
      >
        <div className='bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
          <Command className='size-4' />
        </div>
        <div className='flex flex-col gap-0.5 leading-none'>
          <span className='font-semibold'>Septillion Real Estate</span>
          {isLoading ? (
            <Skeleton className='h-4 w-24' />
          ) : (
            <span className='text-xs'>{role}</span>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenu>
  );
}
