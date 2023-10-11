import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import profilePic from "../../public/croppedMisfitsLogo.png";

const NavBar = () => {
  return (
    <>
      <div className="sticky top-0 z-20 w-full flex flex-col md:flex-row md:items-center gap-3 p-3 lg:px-4 h-[100px] md:h-16 bg-background-100">
        <Image src={profilePic} alt="Logo" width={65} height={65} />
        Misfits Managed Admin
        <div className="ml-auto">
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </>
  );
};

export default NavBar;
