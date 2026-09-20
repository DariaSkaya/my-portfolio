export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col justify-between bg-black text-white px-8 py-8 md:px-16 md:py-12">
      <nav className="flex justify-between items-center text-sm tracking-wide">
        <span className="font-semibold">DARIA SOSNITSKAYA</span>
        <div className="hidden md:flex gap-8 text-zinc-400">
          <span>[ ABOUT ]</span>
          <span>[ WORKS ]</span>
          <span>[ CONTACT ]</span>
        </div>
      </nav>

      <div className="flex flex-col gap-4">
        <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.95] tracking-tight">
          DIGITAL
          <br />
          DESIGNER
        </h1>
        <p className="max-w-md text-zinc-400 text-lg">
  Product · UX/UI · Web
  <br />
  Design studio based in Berlin
</p>
      </div>

      <div className="flex justify-between items-end text-sm text-zinc-500">
        <span>BERLIN, DE</span>
        <span>2026</span>
      </div>
    </main>
  );
}