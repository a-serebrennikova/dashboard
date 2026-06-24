import * as Separator from "@radix-ui/react-separator";
import { Header } from "./dashboard/ui/Header";
import { Content } from "./dashboard/ui/Content";

export function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-8 font-sans">
      <Header />
      <Separator.Root
        decorative
        orientation="horizontal"
        className="mb-6 h-px bg-slate-800"
      />
      <Content />
    </div>
  );
}
