import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'IconLayoutGrid',
    isActive: false,
    shortcut: ['d', 'd'],

    items: []
  },
  {
    title: 'Users Management',
    url: '#',
    icon: 'UsersRound',
    isActive: false,
    items: [
      {
        title: 'Users',
        url: '/dashboard/users',
        icon: 'Users',
        shortcut: ['u', 'u'],
        isActive: false,
        items: []
      },
      {
        title: 'Agents',
        url: '/dashboard/agents',
        icon: 'IconUserShield',
        shortcut: ['u', 'a'],
        isActive: false,
        items: []
      },
    ]
  },
  {
    title: 'Website CMS',
    url: '#',
    icon: 'DatabaseZap',
    isActive: true,
    items: [
      {
        title: 'Areas',
        url: '/dashboard/areas',
        icon: 'IconMap2',
        shortcut: ['d', 'a'],
        isActive: false,
    
        items: []
      },
      {
        title: 'Developers',
        url: '/dashboard/developers',
        icon: 'IconBuildingSkyscraper',
        shortcut: ['d', 'd'],
        isActive: false,
    
        items: []
      },
      {
        title: 'Payment Plans',
        url: '/dashboard/paymentplans',
        icon: 'IconCreditCardPay',
        shortcut: ['d', 'p'],
        isActive: false,
    
        items: []
      },
      {
        title: 'Communities',
        url: '/dashboard/communities',
        icon: 'IconStackBack',
        shortcut: ['d', 'c'],
        isActive: false,
    
        items: []
      },
      {
        title: 'Properties',
        url: '/dashboard/properties',
        icon: 'IconBuildingEstate',
        shortcut: ['d', 'p'],
        isActive: false,
    
        items: []
      },
    ]
  },
  {
    title: 'Queries',
    url: '#',
    icon: 'IconSend',
    isActive: true,

    items: [
      {
        title: 'Agent Queries',
        url: '/dashboard/agqueries',
        icon: 'IconInfoSquareRounded',
        shortcut: ['q', 'a'],
        isActive: false,
        items: []
      },
      {
        title: 'Contact Queries',
        url: '/dashboard/conqueries',
        icon: 'IconUserQuestion',
        shortcut: ['q', 'c'],
        isActive: false,
        items: []
      },
      {
        title: 'Request Tour Queries',
        url: '/dashboard/request-tour',
        icon: 'IconWorldLongitude',
        shortcut: ['q', 'r'],
        isActive: false,
        items: []
      },
      {
        title: 'Property Contact Queries',
        url: '/dashboard/property-contact-query',
        icon: 'IconOutbound',
        shortcut: ['q', 'r'],
        isActive: false,
        items: []
      },
      {
        title: 'Selling Queries',
        url: '/dashboard/selqueries',
        icon: 'IconHomeStats',
        shortcut: ['q', 's'],
        isActive: false,
        items: []
      },
      {
        title: 'Selling Queries',
        url: '/dashboard/selling-queries',
        icon: 'IconHomeStats',
        shortcut: ['q', 's'],
        isActive: false,
        items: []
      },
    ]
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];