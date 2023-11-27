"use client";
import { cn } from "@/lib/utils";
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
const navigation = [
  { name: "Member Home", href: "#", icon: HomeIcon, current: true },
  { name: "Admin Home", href: "#", icon: UsersIcon, current: false },
  { name: "Projects", href: "#", icon: FolderIcon, current: false },
  { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

const NavBar = () => {
  const pathName = usePathname();
  console.log(pathName);

  return (
    <>
      {navigation.map((item) => (
        <li key={item.name}>
          <a
            href={item.href}
            className={cn(
              pathName
                .toLowerCase()
                .includes(item.name.split(" ").join("").toLowerCase())
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800",
              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            )}
          >
            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
            {item.name}
          </a>
        </li>
      ))}
    </>
  );
};

export default NavBar;
