import DashboardMobile from "@/components/dashboard/dashboardMobile";
import { UserButton, currentUser } from "@clerk/nextjs";

import { redirect } from "next/navigation";
import Image from "next/image";

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
import { cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/members";
import Link from "next/link";

const navigation = [
  {
    name: "Member Home",
    href: "/memberHome",
    icon: HomeIcon,
    current: true,
    isAdmin: false,
    isMember: true,
  },
  {
    name: "Admin Home",
    href: "/adminHome",
    icon: UsersIcon,
    current: false,
    isAdmin: true,
    isMember: false,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: FolderIcon,
    current: false,
    isAdmin: true,
    isMember: false,
  },
  //   { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
  //   { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
  //   { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
];

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const loggedInUser = await currentUser();
  if (!loggedInUser?.emailAddresses[0]?.emailAddress) {
    redirect("/sign-in");
  }

  const user = await db.query.members.findFirst({
    where: eq(users.emailAddress, loggedInUser.emailAddresses[0].emailAddress),
    columns: {
      isAdmin: true,
    },
  });

  return (
    <>
      <div>
        <DashboardMobile />
        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 border-r-2">
            <div className="flex h-16 shrink-0 items-center">
              <Image
                className="h-8 w-auto"
                src="/croppedMisfitsLogo.png"
                alt="Corrupted Strength"
                width={128}
                height={128}
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) =>
                      item.isAdmin === user?.isAdmin || item.isMember ? (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              item.current
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-800",
                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                          >
                            <item.icon
                              className="h-6 w-6 shrink-0"
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ) : null
                    )}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <div
                    // href="#"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white "
                  >
                    <UserButton afterSignOutUrl="/" />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">
                      {loggedInUser.firstName}
                      {loggedInUser.lastName}
                    </span>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
