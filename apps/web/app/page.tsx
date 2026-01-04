import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 uppercase">
            Excellence in <br />
            <span className="font-serif italic lowercase tracking-normal">every</span> detail
          </h1>
          <p className="text-lg md:text-xl font-light tracking-widest mb-10 text-white/80 uppercase">
            Luxury Furniture & Interior Design Since 1997
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="px-10 py-4 bg-white text-brand-neutral-900 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-primary-600 hover:text-white transition-all duration-300">
              Discover Collection
            </button>
            <button className="px-10 py-4 border border-white text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-brand-neutral-900 transition-all duration-300">
              Our Story
            </button>
          </div>
        </div>
      </main>

      {/* Featured Categories (Optional, based on second image) */}
      <section className="bg-[#fcfaf7] py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { title: "Living Room", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800" },
              { title: "Dining Room", image: "https://images.unsplash.com/photo-1617806118233-18e1db207fa6?auto=format&fit=crop&q=80&w=800" },
              { title: "Bedroom", image: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800" },
            ].map((cat) => (
              <div key={cat.title} className="group cursor-pointer">
                <div className="relative h-96 overflow-hidden mb-6">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-bold tracking-widest text-brand-neutral-900 uppercase">
                  {cat.title}
                </h3>
                <p className="text-xs text-brand-primary-600 font-bold tracking-[0.2em] mt-2 uppercase">
                  Explore More
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
