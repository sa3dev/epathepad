import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
        <div className="prose flex flex-col gap-4 [&_h1]:mb-2 [&_h2]:mt-6 [&_p]:leading-relaxed">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
