import Header from "../components/Header";
import { localGeorama, localGeorgia, localGotham } from "../fonts";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#004E70] via-[#003651] to-[#002A3C] text-white">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-24 h-80 w-80 rounded-full bg-[#A75F00]/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
          <h1 className={`${localGeorgia.className} text-4xl sm:text-5xl leading-tight`}>About CourseFinder</h1>
          <p className={`${localGeorama.className} mt-4 text-base sm:text-lg text-white/90 max-w-3xl`}>
            We are a small, focused team building tools that help students make confident, future‑ready decisions.
            CourseFinder blends personality insights with evidence‑informed guidance to surface fields and programs that
            genuinely fit.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-white/10 border border-white/20 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            <span className={`${localGeorama.className} text-sm`}>Capstone 2 Project • STI College Cubao</span>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-[#FFF4E6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl bg-white/90 border border-[#E7DFD6] p-6 sm:p-8 shadow-sm">
              <h2 className={`${localGotham.className} text-[#002A3C] text-2xl font-semibold`}>Our Mission</h2>
              <p className={`${localGeorgia.className} mt-3 text-[#294556]`}>
                Empower students with clear, human‑centered insights. We design delightful, reliable experiences that turn
                self‑knowledge into real academic momentum. Your time matters, so CourseFinder keeps guidance direct,
                encouraging, and practical.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white/90 to-white/60 border border-[#E7DFD6] p-6 sm:p-8 shadow-sm">
              <h3 className={`${localGotham.className} text-[#002A3C] text-xl font-semibold`}>What We Believe</h3>
              <ul className={`${localGeorama.className} mt-3 space-y-2 text-[#294556]`}>
                <li>• Clarity beats complexity.</li>
                <li>• Guidance should be actionable and kind.</li>
                <li>• Great design makes tough decisions easier.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
          <h2 className={`${localGotham.className} text-[#002A3C] text-3xl font-semibold text-center`}>Meet the Team</h2>
          <p className={`${localGeorgia.className} text-[#294556] text-center mt-3 max-w-3xl mx-auto`}>
            A multidisciplinary group of builders, designers, and researchers dedicated to making academic choices feel
            inspiring and informed.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Francis Oliver */}
            <div className="group rounded-2xl border border-[#E7DFD6] bg-white shadow-sm overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#FFF4E6]">
                <img src="/oliver.webp" alt="Francis Oliver" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className={`${localGeorama.className} text-xs tracking-wide text-[#A75F00] font-semibold`}>Developer / Programmer</p>
                <h3 className={`${localGotham.className} text-[#002A3C] text-lg font-semibold mt-1`}>Francis Oliver</h3>
                <p className={`${localGeorama.className} text-sm text-[#294556] mt-2`}>
                  4th Year student at STI College Cubao. Crafts robust, readable code and turns ideas into fast, reliable
                  features. Passionate about clean architecture and shipping experiences that feel effortless.
                </p>
              </div>
            </div>

            {/* Joshua Emblawa */}
            <div className="group rounded-2xl border border-[#E7DFD6] bg-white shadow-sm overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#FFF4E6]">
                <img src="/joshua.webp" alt="Joshua Emblawa" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className={`${localGeorama.className} text-xs tracking-wide text-[#A75F00] font-semibold`}>Product Designer</p>
                <h3 className={`${localGotham.className} text-[#002A3C] text-lg font-semibold mt-1`}>Joshua Emblawa</h3>
                <p className={`${localGeorama.className} text-sm text-[#294556] mt-2`}>
                  4th Year student at STI College Cubao. Shapes delightful interfaces with purposeful typography, motion,
                  and hierarchy. Obsessed with accessibility, micro‑interactions, and design systems that scale.
                </p>
              </div>
            </div>

            {/* Kaisser Christopher Diaz */}
            <div className="group rounded-2xl border border-[#E7DFD6] bg-white shadow-sm overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#FFF4E6]">
                <img src="/kaisser.webp" alt="Kaisser Christopher Diaz" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className={`${localGeorama.className} text-xs tracking-wide text-[#A75F00] font-semibold`}>Research & Documentation</p>
                <h3 className={`${localGotham.className} text-[#002A3C] text-lg font-semibold mt-1`}>Kaisser Christopher Diaz</h3>
                <p className={`${localGeorama.className} text-sm text-[#294556] mt-2`}>
                  4th Year student at STI College Cubao. Translates complex sources into clear, trustworthy content. Ensures
                  our methods, references, and data flow are transparent and easy to follow.
                </p>
              </div>
            </div>

            {/* Jowen Butial */}
            <div className="group rounded-2xl border border-[#E7DFD6] bg-white shadow-sm overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#FFF4E6]">
                <img src="/owee.webp" alt="Jowen Butial" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <p className={`${localGeorama.className} text-xs tracking-wide text-[#A75F00] font-semibold`}>Research & Documentation</p>
                <h3 className={`${localGotham.className} text-[#002A3C] text-lg font-semibold mt-1`}>Jowen Butial</h3>
                <p className={`${localGeorama.className} text-sm text-[#294556] mt-2`}>
                  4th Year student at STI College Cubao. Brings structure to ideas—outlining processes, validating sources,
                  and weaving findings into student‑friendly explanations and guides.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


