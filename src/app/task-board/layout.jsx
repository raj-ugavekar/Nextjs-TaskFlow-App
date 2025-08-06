import SidebarContainer from "@/components/clients/SidebarContainer";

export default function TaskboardLayout({ children }) {
  return (
    <div className="flex min-h-screen relative">
      <SidebarContainer />
      <div className="flex-1 bg-[#172842] text-white">
        <header className="h-14 bg-[#172842] flex items-center justify-center px-4 border-b border-white/10 relative">
          <h1 className=" text-xl md:text-3xl font-bold tracking-wide">TaskBoard</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
