import Hero from './components/Hero'
import AboutSection from './components/AboutSection'
import ContentSection from './components/ContentSection'
import ChatGlobalSection from './components/ChatGlobalSection'
import LinksSection from './components/LinksSection'
import Navbar from './components/Navbar'
import BackgroundAudio from './components/BackgroundAudio'

function App() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden selection:bg-accent selection:text-white">
      {/* Film Grain Overlay */}
      <div className="film-grain"></div>

      <BackgroundAudio />

      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        
        {/* Marquee Separator */}
        <div className="w-full bg-accent text-black font-black text-2xl py-3 whitespace-nowrap overflow-hidden border-y-4 border-white">
          <div className="animate-marquee inline-block tracking-tighter">
            <span>LNGSHOT , JAY PARK, LGNSHOT JAY PARK • LNGSHOT , JAY PARK, LGNSHOT JAY PARK • LNGSHOT , JAY PARK, LGNSHOT JAY PARK • LNGSHOT , JAY PARK, LGNSHOT JAY PARK • </span>
          </div>
        </div>
        
        <AboutSection />
        
        <ContentSection />

        <ChatGlobalSection />
        
        <LinksSection />
      </main>

      <footer className="relative z-10 bg-black border-t-2 border-accent py-12 text-center text-white/50 text-xs font-bold uppercase tracking-widest mt-12">
        <p className="mb-2">© {new Date().getFullYear()} KUMSHOT SYNDICATE.</p>
        <p className="text-accent">DISTRUST THE MAINSTREAM.</p>
      </footer>
    </div>
  )
}

export default App
