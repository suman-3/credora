'use client';

import { Command } from 'lucide-react';

import { SidebarMenu, SidebarMenuButton } from '@workspace/ui/components/sidebar';
import { Skeleton } from '@workspace/ui/components/skeleton';
import Image from 'next/image';

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
        <div className='bg-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg'>
          <Image
            src='/logo/short.svg'
            alt='Credora Logo'
            width={80}
            height={80}
            className='w-10 object-cover rounded-md'
          />
        </div>
        <div className='flex flex-col gap-0.5 leading-none'>
          <span className='font-semibold'>
            Credora
          </span>
          {isLoading ? (
            <Skeleton className='h-4 w-24' />
          ) : (
            <span className='text-sm uppercase'>{role}</span>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenu>
  );
}
