import { NavItem } from "@/types";

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
    title: "Applications",
    url: "/dashboard/applcaitions",
    icon: "IconFileSmile",
    isActive: false,
    roles: ["verifier"],
  },
];
