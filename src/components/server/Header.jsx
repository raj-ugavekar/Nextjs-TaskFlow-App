import DesktopNav from "../clients/DesktopNavBar";
import MobileNav from "../clients/MobileNavBar";

export const Header = () => {
  return (
    <header className="sticky top-0 bg-[#172842] border-b border-[#172842] text-white shadow-sm z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <img src="logo_icon.svg" className="size-6" alt="" />
          <span className="text-lg font-semibold">TASKFLOW</span>
        </div>
        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
};

export default Header;
