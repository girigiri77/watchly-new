import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#0B0B0F] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 sm:gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-lg font-black text-white">
                🎬
              </div>
              <span className="font-playfair text-xl font-black text-white sm:text-2xl">
                Absolute
                <span className="gradient-text-purple"> Cinema</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              Premium cinematic discovery platform for every mood, every story, every emotion.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 sm:gap-16">
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
                Discover
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link href="/" className="text-sm text-neutral-400 transition hover:text-white">
                  Home
                </Link>
                <Link href="/releases" className="text-sm text-neutral-400 transition hover:text-white">
                  Releases
                </Link>
                <Link href="/mood" className="text-sm text-neutral-400 transition hover:text-white">
                  Mood Cinema
                </Link>
                <Link href="/search" className="text-sm text-neutral-400 transition hover:text-white">
                  Search
                </Link>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-purple-400">
                Explore
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link href="/trending" className="text-sm text-neutral-400 transition hover:text-white">
                  Trending
                </Link>
                <span className="text-sm text-neutral-500">Telugu</span>
                <span className="text-sm text-neutral-500">Tamil</span>
                <span className="text-sm text-neutral-500">Hindi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-center text-xs text-neutral-500 sm:mt-10 sm:flex-row sm:text-left">
          <span>© 2026 Absolute Cinema. Premium cinematic discovery.</span>
          <span className="text-purple-400">Cinema for Every Emotion</span>
        </div>
      </div>
    </footer>
  )
}
