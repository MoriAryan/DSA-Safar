import Sidebar from "@/components/Sidebar";
import { TopRightHeader } from "@/components/TopRightHeader";
import { SyncEngine } from "@/components/SyncEngine";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SyncEngine />
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <TopRightHeader />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-[#0c0c0e]">
          {children}
        </main>
      </div>
    </div>
  );
}
