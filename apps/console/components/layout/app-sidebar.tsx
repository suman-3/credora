"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { UserAvatarProfile } from "@/components/user-avatar-profile";
import { navItems } from "@/constants/data";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAuth } from "@/hooks/auth/use-auth";

import {
  IconBell,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconPhotoUp,
  IconUserCircle,
  IconUserShield,
} from "@tabler/icons-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { getIcon, Icons } from "../icons";
import { OrgSwitcher } from "../org-switcher";

export const company = {
  name: "Acme Inc",
  logo: IconPhotoUp,
  plan: "Enterprise",
};

// Skeleton component for menu items
const MenuItemSkeleton = () => (
  <SidebarMenuItem>
    <div className="flex items-center space-x-2 px-2 py-2">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 flex-1" />
    </div>
  </SidebarMenuItem>
);

// Skeleton component for collapsible menu items
const CollapsibleMenuItemSkeleton = () => (
  <SidebarMenuItem>
    <div className="flex items-center space-x-2 px-2 py-2">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-4 rounded" />
    </div>
  </SidebarMenuItem>
);

// Skeleton for user profile in footer
const UserProfileSkeleton = () => (
  <div className="flex items-center space-x-2 px-2 py-2">
    <Skeleton className="h-8 w-8 rounded-lg" />
    <div className="flex-1 space-y-1">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
    <Skeleton className="h-4 w-4" />
  </div>
);

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  const filteredNavItems = React.useMemo(() => {
    if (isLoading || !user) return [];

    return navItems
      .map((item) => {
        // Check if parent item is allowed for this role
        if (item.roles && !item.roles.includes(user?.userType || "")) {
          return null;
        }

        // If item has children, filter them based on roles
        if (item.items && item.items.length > 0) {
          const filteredChildren = item.items.filter(
            (subItem) => {
              if (subItem.roles) {
                return Array.isArray(subItem.roles)
                  ? subItem.roles.includes(user?.userType || "")
                  : subItem.roles === user?.userType;
              }
              return true;
            }
          );

          // Only return parent if it has accessible children
          if (filteredChildren.length > 0) {
            return { ...item, items: filteredChildren };
          }
          return null;
        }

        return item;
      })
      .filter(Boolean);
  }, [isLoading, user]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <OrgSwitcher
          role={user?.userType || "ANONYMOUS"}
          isLoading={isLoading}
        />
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          {/* <SidebarGroupLabel>Overview</SidebarGroupLabel> */}
          <SidebarMenu>
            {isLoading ? (
              <>
                {Array.from({ length: 6 }, (_, idx) =>
                  idx % 3 === 0 ? (
                    <CollapsibleMenuItemSkeleton
                      key={`skeleton-collapsible-${idx}`}
                    />
                  ) : (
                    <MenuItemSkeleton key={`skeleton-item-${idx}`} />
                  )
                )}
              </>
            ) : (
              // Render actual menu items when loaded
              filteredNavItems.map((item) => {
                if (!item) return null;
                const Icon = getIcon(item.icon || "");
                return item?.items && item?.items?.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={pathname === item.url}
                        >
                          {item.icon && <Icon />}
                          <span>{item.title}</span>
                          <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map(
                            (subItem: (typeof item.items)[0]) => {
                              const SubIcon = getIcon(subItem.icon || "");
                              return (
                                <SidebarMenuSubItem
                                  key={`${subItem.title}-${subItem.url}`}
                                >
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                  >
                                    <Link href={subItem.url}>
                                      {SubIcon && <SubIcon />}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            }
                          )}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {isLoading ? (
              // Skeleton for user profile section
              <UserProfileSkeleton />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    {user && (
                      <UserAvatarProfile
                        className="h-8 w-8 rounded-lg"
                        showInfo
                        user={user}
                      />
                    )}
                    <IconChevronsDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="px-1 py-1.5">
                      {user && (
                        <UserAvatarProfile
                          className="h-8 w-8 rounded-lg"
                          showInfo
                          user={user}
                        />
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    {user?.userType === "user" && (
                      <DropdownMenuItem
                        className="capitalize"
                        onClick={() => router.push("/dashboard/issuer")}
                      >
                        <IconUserShield className="mr-2 h-4 w-4" />
                        Become an Issuer
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="capitalize"
                      onClick={() => router.push("/dashboard/profile")}
                    >
                      <IconUserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                      <IconBell className="mr-2 h-4 w-4" />
                      Notifications
                    </DropdownMenuItem> */}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <IconLogout className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
