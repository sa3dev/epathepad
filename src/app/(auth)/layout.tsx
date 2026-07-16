import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-16">{children}</main>
      <Footer />
    </div>
  );
}
