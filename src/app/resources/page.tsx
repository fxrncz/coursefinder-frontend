import { localGeorama, localGeorgia, localGotham } from "../fonts";
import Header from "../components/Header";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero */}
      <section className="bg-[#225104] text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-16 sm:py-20">
          <div className="flex items-start sm:items-center justify-between gap-8 flex-col sm:flex-row">
            <div className="max-w-3xl">
              <h1 className={`${localGeorgia.className} text-3xl sm:text-4xl lg:text-5xl leading-tight`}>Resources Behind the CourseFinder Personality Profiler</h1>
              <p className={`${localGeorama.className} mt-4 text-base sm:text-lg text-white/90`}>Transparency about what powers the test: the frameworks we use, how answers are scored, where recommendations come from, and what the results mean.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs sm:text-sm">RIASEC (Holland Code)</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs sm:text-sm">Jungian Typology</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs sm:text-sm">Evidence‑informed Matching</span>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <div className="rounded-xl bg-white/10 border border-white/20 px-6 py-5 backdrop-blur-sm">
                <p className={`${localGeorama.className} text-sm text-white/90`}>At a glance</p>
                <ul className={`${localGeorama.className} mt-3 space-y-2 text-white`}>
                  <li className="flex items-center gap-2"><span>•</span><span>100 statements, 1–7 scale</span></li>
                  <li className="flex items-center gap-2"><span>•</span><span>Dual framework: RIASEC + Jungian preferences</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[#FFF4E6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
        {/* Frameworks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="rounded-xl bg-white shadow-sm border border-[#E7DFD6] p-6 sm:p-8">
            <h2 className={`${localGotham.className} text-[#002A3C] text-2xl font-semibold`}>Psychological Frameworks</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className={`${localGeorama.className} text-[#002A3C] font-semibold`}>RIASEC (Holland Code)</h3>
                <p className={`${localGeorgia.className} text-[#294556] mt-2 text-sm sm:text-base`}>Six interest themes: Realistic (hands‑on), Investigative (analytical), Artistic (creative), Social (helping), Enterprising (leading), and Conventional (organizing). We measure your relative interests across these six areas and highlight your top two.</p>
              </div>
              <div>
                <h3 className={`${localGeorama.className} text-[#002A3C] font-semibold`}>Jungian Preference Dimensions</h3>
                <p className={`${localGeorgia.className} text-[#294556] mt-2 text-sm sm:text-base`}>Four paired preferences describe how you gain energy and make decisions: Extraversion vs Introversion, Sensing vs Intuition, Thinking vs Feeling, and Judging vs Perceiving. Your higher score in each pair forms a four‑letter preference profile.</p>
              </div>
            </div>
          </div>

          {/* Questionnaire */}
          <div className="rounded-xl bg-white shadow-sm border border-[#E7DFD6] p-6 sm:p-8">
            <h2 className={`${localGotham.className} text-[#002A3C] text-2xl font-semibold`}>Questionnaire Design</h2>
            <ul className={`${localGeorgia.className} mt-4 space-y-3 text-[#294556] text-sm sm:text-base`}>
              <li>• 100 statements answered on a 1–7 agreement scale.</li>
              <li>• Statements are grouped into 10 sets of 10 items for clear focus and pacing.</li>
              <li>• Sets 1–6 map to RIASEC interests; each set corresponds to one theme.</li>
              <li>• Sets 7–10 map to Jungian preferences: E/I, S/N, T/F, and J/P respectively.</li>
              <li>• No trick items; language is plain and student‑friendly.</li>
            </ul>
          </div>
        </div>

        {/* Scoring */}
        <div className="mt-6 sm:mt-8 rounded-xl bg-white shadow-sm border border-[#E7DFD6] p-6 sm:p-8">
          <h2 className={`${localGotham.className} text-[#002A3C] text-2xl font-semibold`}>Scoring & Interpretation</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] font-semibold`}>RIASEC</h3>
              <p className={`${localGeorgia.className} text-[#294556] mt-2 text-sm sm:text-base`}>We sum your responses within each of the six themes (10 items per theme). Your two highest themes form a two‑letter interest code and a ranked profile across all six.</p>
            </div>
            <div>
              <h3 className={`${localGeorama.className} text-[#002A3C] font-semibold`}>Jungian Preferences</h3>
              <p className={`${localGeorgia.className} text-[#294556] mt-2 text-sm sm:text-base`}>Within each pair (E/I, S/N, T/F, J/P), we compare summed subtotals and take the higher side. The result is a four‑letter preference type.</p>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-[#E7DFD6] bg-[#FFFAF4] p-4">
            <p className={`${localGeorama.className} text-[#4d2c00] text-sm sm:text-base`}><strong>What you receive:</strong> your preference type, your two‑letter RIASEC code, a full RIASEC ranking, learning style highlights, study tips, growth suggestions, and matched course ideas.</p>
          </div>
        </div>

        {/* References */}
        <div className="mt-6 sm:mt-8 rounded-xl bg-white shadow-sm border border-[#E7DFD6] p-6 sm:p-8">
          <h2 className={`${localGotham.className} text-[#002A3C] text-2xl font-semibold`}>References</h2>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-lg border border-[#E7DFD6] p-5">
              <h3 className={`${localGeorama.className} text-[#002A3C] font-semibold`}>Jungian Typology (MBTI‑based)</h3>
              <p className={`${localGeorgia.className} text-[#294556] mt-2 text-sm sm:text-base`}>The preference model draws on long‑standing work describing four paired tendencies: Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving. We summarize these dimensions to present an easy‑to‑read four‑letter profile.</p>
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className={`${localGeorama.className} inline-flex items-center justify-center rounded-md bg-[#002A3C] px-4 py-2 text-white text-sm hover:bg-[#004E70] transition-colors`}>
                      Click to see the reference
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-[#E7DFD6] p-6 sm:p-8 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className={`${localGeorgia.className} text-[#002A3C]`}>Jungian / MBTI References</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                      <div>
                        <h4 className={`${localGeorgia.className} text-[#002A3C] font-semibold`}>Academic Sources</h4>
                        <ul className={`${localGeorgia.className} text-[#294556] mt-3 space-y-3 text-sm sm:text-base`}>
                          <li>
                            Myers, I. B., & Briggs, K. C. (1998). MBTI® Manual: A Guide to the Development and Use of the Myers-Briggs Type Indicator. Consulting Psychologists Press. <span className="block italic text-[#4d2c00]">Official MBTI manual with career distribution data by personality type.</span>
                          </li>
                          <li>
                            Macdaid, G. P., McCaulley, M. H., & Kainz, R. I. (1986). Myers-Briggs Type Indicator: Atlas of Type Tables. Gainesville, FL: Center for Applications of Psychological Type. <span className="block italic text-[#4d2c00]">Statistical tables showing MBTI distributions across academic majors and careers.</span>
                          </li>
                          <li>
                            Provost, J. A., & Anchors, S. (1987). Applications of the Myers-Briggs Type Indicator in Higher Education. Consulting Psychologists Press. <span className="block italic text-[#4d2c00]">Links MBTI personality patterns with college major selection.</span>
                          </li>
                          <li>
                            McCaulley, M. H., Macdaid, G. P., & Walsh, R. (1990). Myers-Briggs Type Indicator and Retention in Engineering. Journal of Psychological Type, 19, 13–23. <span className="block italic text-[#4d2c00]">Found higher retention in STEM fields for certain MBTI types like INTJ, ISTJ, INTP.</span>
                          </li>
                          <li>
                            Tieger, P. D., Barron, B., & Tieger, K. (2014). Do What You Are. Little, Brown and Company. <span className="block italic text-[#4d2c00]">Popular but research‑informed book matching MBTI types to satisfying careers.</span>
                          </li>
                        </ul>
                      </div>
                      <div className="border-t border-[#E7DFD6]" />
                      <div>
                        <h4 className={`${localGeorgia.className} text-[#002A3C] font-semibold`}>Publicly Accessible Resources</h4>
                        <ul className={`${localGeorgia.className} text-[#294556] mt-3 space-y-3 text-sm sm:text-base`}>
                          <li>
                            The Myers-Briggs Company – Type and Careers: <a className="text-[#004E70] underline" href="https://www.mbtionline.com/en-US/MBTI-Types/All-about-the-Myers-Briggs-types" target="_blank" rel="noopener noreferrer">mbtionline.com</a> <span className="block italic text-[#4d2c00]">Official MBTI career insights.</span>
                          </li>
                          <li>
                            Truity – 16 Personality Types Career Profiles: <a className="text-[#004E70] underline" href="https://www.truity.com/personality-type" target="_blank" rel="noopener noreferrer">truity.com</a> <span className="block italic text-[#4d2c00]">Large‑scale survey data linking MBTI to career fields.</span>
                          </li>
                          <li>
                            HumanMetrics – MBTI Career Suggestions: <a className="text-[#004E70] underline" href="http://www.humanmetrics.com/personality" target="_blank" rel="noopener noreferrer">humanmetrics.com</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="rounded-lg border border-[#E7DFD6] p-5">
              <h3 className={`${localGeorama.className} text-[#002A3C] font-semibold`}>RIASEC Code</h3>
              <p className={`${localGeorgia.className} text-[#294556] mt-2 text-sm sm:text-base`}>The interests framework categorizes themes into six areas: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional. Your results rank these themes and highlight the top two as your interest code.</p>
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className={`${localGeorama.className} inline-flex items-center justify-center rounded-md bg-[#002A3C] px-4 py-2 text-white text-sm hover:bg-[#004E70] transition-colors`}>
                      Click to see the reference
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-[#E7DFD6] p-6 sm:p-8 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className={`${localGeorgia.className} text-[#002A3C]`}>RIASEC References</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                      <div>
                        <h4 className={`${localGeorgia.className} text-[#002A3C] font-semibold`}>Academic Sources</h4>
                        <ul className={`${localGeorgia.className} text-[#294556] mt-3 space-y-3 text-sm sm:text-base`}>
                          <li>
                            Holland, J. L. (1997). Making Vocational Choices: A Theory of Vocational Personalities and Work Environments (3rd ed.). Psychological Assessment Resources. <span className="block italic text-[#4d2c00]">Foundational book introducing RIASEC model linking personality to occupational environments.</span>
                          </li>
                          <li>
                            Rounds, J., & Su, R. (2014). The nature and power of interests. Current Directions in Psychological Science, 23(2), 98–103. <span className="block italic text-[#4d2c00]">Validates the RIASEC model as one of the most predictive frameworks for career matching.</span>
                          </li>
                          <li>
                            Tracey, T. J. G., & Rounds, J. (1996). The spherical representation of vocational interests. Journal of Vocational Behavior, 48(1), 3–41. <span className="block italic text-[#4d2c00]">Examines how RIASEC interest profiles predict satisfaction and performance.</span>
                          </li>
                        </ul>
                      </div>
                      <div className="border-t border-[#E7DFD6]" />
                      <div>
                        <h4 className={`${localGeorgia.className} text-[#002A3C] font-semibold`}>Publicly Accessible Resources</h4>
                        <ul className={`${localGeorgia.className} text-[#294556] mt-3 space-y-3 text-sm sm:text-base`}>
                          <li>
                            O*NET OnLine – Browse by Interests: <a className="text-[#004E70] underline" href="https://www.onetonline.org/find/descriptor/browse/Interests/" target="_blank" rel="noopener noreferrer">onetonline.org</a> <span className="block italic text-[#4d2c00]">Government‑maintained occupational database with RIASEC codes for every job.</span>
                          </li>
                          <li>
                            National Center for O*NET Development – Interest Profiler: <a className="text-[#004E70] underline" href="https://www.mynextmove.org/explore/ip" target="_blank" rel="noopener noreferrer">mynextmove.org</a> <span className="block italic text-[#4d2c00]">Free online RIASEC‑based career assessment tool with U.S. Department of Labor data.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="rounded-lg border border-[#E7DFD6] p-5">
              <h3 className={`${localGeorama.className} text-[#002A3C] font-semibold`}>Learning Style / Study Tips</h3>
              <p className={`${localGeorgia.className} text-[#294556] mt-2 text-sm sm:text-base`}>Study guidance is synthesized from established learning strategies and student‑success practices. Tips are phrased to align with your preference patterns and interest profile to help you plan effective study routines.</p>
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className={`${localGeorama.className} inline-flex items-center justify-center rounded-md bg-[#002A3C] px-4 py-2 text-white text-sm hover:bg-[#004E70] transition-colors`}>
                      Click to see the reference
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border-[#E7DFD6] p-6 sm:p-8 max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className={`${localGeorgia.className} text-[#002A3C]`}>Learning Style / Study Tips References</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                      <div>
                        <h4 className={`${localGeorgia.className} text-[#002A3C] font-semibold`}>Academic Sources</h4>
                        <ul className={`${localGeorgia.className} text-[#294556] mt-3 space-y-3 text-sm sm:text-base`}>
                          <li>
                            Lawrence, G. (1993). People Types and Tiger Stripes: A Practical Guide to Learning Styles. Center for Applications of Psychological Type. <span className="block italic text-[#4d2c00]">Classic MBTI learning style reference.</span>
                          </li>
                          <li>
                            DiTiberio, J. K., & Hammer, A. L. (1993). Introduction to Type in College. Consulting Psychologists Press. <span className="block italic text-[#4d2c00]">Matches MBTI types to learning strategies and study environments.</span>
                          </li>
                          <li>
                            Felder, R. M., & Silverman, L. K. (1988). Learning and teaching styles in engineering education. Engineering Education, 78(7), 674–681. <span className="block italic text-[#4d2c00]">Links thinking/intuitive learning preferences with teaching styles.</span>
                          </li>
                          <li>
                            Zhang, L., & Sternberg, R. J. (2000). Are learning approaches and personality types related? Educational Psychology, 20(3), 271–282. <span className="block italic text-[#4d2c00]">Shows personality significantly influences learning strategies.</span>
                          </li>
                          <li>
                            Entwistle, N., & Ramsden, P. (2015). Understanding Student Learning. Routledge. <span className="block italic text-[#4d2c00]">Connects deep/surface learning approaches with personality traits.</span>
                          </li>
                        </ul>
                      </div>
                      <div className="border-t border-[#E7DFD6]" />
                      <div>
                        <h4 className={`${localGeorgia.className} text-[#002A3C] font-semibold`}>Publicly Accessible Resources</h4>
                        <ul className={`${localGeorgia.className} text-[#294556] mt-3 space-y-3 text-sm sm:text-base`}>
                          <li>
                            The Myers-Briggs Company – Type and Learning: <a className="text-[#004E70] underline" href="https://www.themyersbriggs.com/en-US/Using-Type/Type-and-Learning" target="_blank" rel="noopener noreferrer">themyersbriggs.com</a> <span className="block italic text-[#4d2c00]">MBTI learning style summaries.</span>
                          </li>
                          <li>
                            VARK Learning Styles Model: <a className="text-[#004E70] underline" href="https://vark-learn.com/introduction-to-vark/" target="_blank" rel="noopener noreferrer">vark-learn.com</a> <span className="block italic text-[#4d2c00]">Sensory‑based learning preferences that can be cross‑referenced with MBTI/Sensing‑Intuition preferences.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Responsibility */}
        <div className="mt-6 sm:mt-8 rounded-xl bg-white shadow-sm border border-[#E7DFD6] p-6 sm:p-8">
          <h2 className={`${localGotham.className} text-[#002A3C] text-2xl font-semibold`}>Responsible Use</h2>
          <ul className={`${localGeorgia.className} mt-4 space-y-3 text-[#294556] text-sm sm:text-base`}>
            <li>• Results are guidance, not guarantees. Use them alongside your interests, values, and academic preparation.</li>
            <li>• Sources include publicly available program information and career references. Where required, content is adapted and summarized.</li>
            <li>• Your responses are used to generate results and recommendations. We store limited session information to retrieve your latest results.</li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white shadow-sm border border-[#E7DFD6] p-6 sm:p-8">
            <h3 className={`${localGotham.className} text-[#002A3C] text-xl font-semibold`}>Does a higher score mean a single “best” field?</h3>
            <p className={`${localGeorgia.className} text-[#294556] mt-3 text-sm sm:text-base`}>Not necessarily. The purpose is to reveal clusters of interests and preferences. Many programs and careers fit multiple profiles; we present a ranked set of options rather than a single verdict.</p>
          </div>
          <div className="rounded-xl bg-white shadow-sm border border-[#E7DFD6] p-6 sm:p-8">
            <h3 className={`${localGotham.className} text-[#002A3C] text-xl font-semibold`}>Can I improve my results?</h3>
            <p className={`${localGeorgia.className} text-[#294556] mt-3 text-sm sm:text-base`}>There are no right or wrong answers. If your interests change, you can retake the test. Use the learning and growth tips to refine study habits aligned with your preferences.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <a href="/personalitytest" className={`${localGeorama.className} inline-flex items-center justify-center bg-[#002A3C] text-white px-8 py-3 font-semibold rounded-md hover:bg-[#004E70] transition-colors`}>
            Take the Personality Test
          </a>
        </div>
        </div>
      </section>
    </div>
  );
}


