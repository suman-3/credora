import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { IUser } from '@/types/objects';

interface UserAvatarProfileProps {
  className?: string;
  showInfo?: boolean;
  user: IUser;
  isLoading?: boolean;
}

export function UserAvatarProfile({
  className,
  showInfo = false,
  user,
  isLoading,
}: UserAvatarProfileProps) {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className={className}>
        <AvatarImage src={`https://avatar.vercel.sh/${user?.name}.svg?text=${user?.name?.slice(0, 2).toUpperCase()}`} alt={user?.name || ''} />
        <AvatarFallback className='rounded-lg'>
          {user?.name?.slice(0, 2)?.toUpperCase() || 'SR'}
        </AvatarFallback>
      </Avatar>

      {showInfo && (
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold capitalize'>{user?.name || ''}</span>
          <span className='truncate text-xs'>
            {user?.email || ''}
          </span>
        </div>
      )}
    </div>
  );
}
