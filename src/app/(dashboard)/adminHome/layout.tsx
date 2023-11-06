import NavBar from "@/components/nav-bar";

export default function MainPageLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar />

      <div className="flex-grow p-6">{children}</div>
    </div>
  );
}
