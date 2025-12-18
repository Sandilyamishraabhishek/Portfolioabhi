/*
Complete React single-file app (App.jsx) for a multi-page interactive landing site.

Dependencies (install before running):
- react, react-dom
- react-router-dom
- gsap
- react-tsparticles
- tsparticles
- react-player

Example setup (with Vite):
npx create-vite@latest my-landing --template react
cd my-landing
npm install gsap react-router-dom react-tsparticles tsparticles react-player
# then replace src/App.jsx with this file, add src/main.jsx (already included), and run:
npm run dev

Deployment notes are included at the end of the file.
*/

import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Particles from 'react-tsparticles';
import ReactPlayer from 'react-player';

import { loadFull } from 'tsparticles';

// Simple CSS (if you use Tailwind, remove/replace these). This is minimal for standalone usage.
const styles = `
:root{--bg:#0f1724;--card:#0b1220;--accent:#ffd369;--muted:#9aa4b2;}
*{box-sizing:border-box}
html,body,#root{height:100%}
body{margin:0;font-family:Inter,system-ui,Arial;background:linear-gradient(180deg,#071122 0%, #0f1724 100%);color:#fff}
header{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:14px 28px;z-index:60;backdrop-filter:blur(6px)}
.logo{font-weight:700;letter-spacing:0.6px}
.nav{display:flex;gap:16px;align-items:center}
.nav a{color:var(--muted);text-decoration:none}
.btn{background:var(--accent);color:#000;padding:10px 14px;border-radius:10px;border:none;cursor:pointer}
.hero{height:100vh;display:flex;align-items:center;justify-content:center;padding:0 20px;position:relative;overflow:hidden}
.heroContent{max-width:1100px;z-index:30;text-align:left}
.tag{display:inline-block;background:rgba(255,211,105,0.12);padding:6px 10px;border-radius:999px;color:var(--accent);font-weight:600;margin-bottom:16px}
.h1{font-size:48px;line-height:1.02;margin-bottom:12px}
.lead{color:var(--muted);max-width:700px;margin-bottom:18px}
.section{padding:100px 20px;}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;margin-top:28px}
.card{background:rgba(255,255,255,0.03);padding:24px;border-radius:14px;transition:transform 0.35s,box-shadow 0.35s}
.card:hover{transform:translateY(-8px);box-shadow:0 12px 30px rgba(0,0,0,0.5)}
.footer{padding:40px 20px;text-align:center;color:var(--muted)}
.container{max-width:1100px;margin:0 auto}
.videoBg{position:absolute;inset:0;object-fit:cover;z-index:10;opacity:0.5}
.overlay{position:absolute;inset:0;background:linear-gradient(180deg, rgba(6,10,17,0.3), rgba(6,10,17,0.6));z-index:20}
.preloader{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:var(--bg);z-index:999}
.testimonials{display:flex;gap:12px;align-items:center}
.testCard{min-width:280px;background:rgba(255,255,255,0.03);padding:18px;border-radius:12px}
.pricingGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}
.pricing{background:rgba(255,255,255,0.03);padding:20px;border-radius:12px}
@media(max-width:800px){.h1{font-size:34px}.nav{display:none}}
`;

// Particles options (tsParticles)
const particlesOptions = {
  fullScreen: { enable: false },
  fpsLimit: 60,
  interactivity: { events: { onHover: { enable: true, mode: 'repulse' } } },
  particles: {
    number: { value: 60, density: { enable: true, area: 800 } },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: 0.6 },
    size: { value: { min: 1, max: 4 } },
    move: { enable: true, speed: 0.6 }
  }
};

function Preloader({ onFinish }) {
  useEffect(() => {
    const tl = gsap.timeline({ onComplete: onFinish });
    tl.to('.preloader .dot', { y: -12, stagger: 0.12, repeat: 3, yoyo: true, duration: 0.35 });
    // simulate load
    setTimeout(() => {}, 1400);
  }, [onFinish]);

  return (
    <div className="preloader">
      <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
        <div className="dot" style={{width:12,height:12,background:'var(--accent)',borderRadius:6}}></div>
        <div className="dot" style={{width:12,height:12,background:'var(--accent)',borderRadius:6}}></div>
        <div className="dot" style={{width:12,height:12,background:'var(--accent)',borderRadius:6}}></div>
      </div>
    </div>
  );
}

function Navbar() {
  const navigate = useNavigate();
  return (
    <header>
      <div className="logo">MyLanding</div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/testimonials">Testimonials</Link>
        <Link to="/contact">Contact</Link>
        <button className="btn" onClick={() => navigate('/contact')}>Get in touch</button>
      </nav>
    </header>
  );
}

function Home() {
  const particlesInit = async (engine) => { await loadFull(engine); };
  const heroRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.h1', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.lead', { y: 18, opacity: 0, duration: 0.8, delay: 0.15 });
      gsap.from('.tag', { scale: 0.9, opacity: 0, duration: 0.6, delay: 0.25 });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef} id="home">
      <Particles id="tsparticles" init={particlesInit} options={{...particlesOptions, fullScreen:{enable:false}}} style={{position:'absolute',inset:0,zIndex:15}}/>

      {/* Video background (muted, looped) */}
      <ReactPlayer url="https://cdn.coverr.co/videos/coverr-abstract-data-1600x900?token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImFic3RyYWN0LWRhdGEiLCJleHAiOjE4NzA0NDg0OTl9.B3i0X58F3R7o63e_kUsVTNff7kwh28ykVfoCEN0z7iE" playing loop muted width="100%" height="100%" className="videoBg"/>
      <div className="overlay"/>

      <div className="heroContent container">
        <div className="tag">New · 2025</div>
        <h1 className="h1">Build beautiful experiences at scale</h1>
        <p className="lead">A responsive, animated landing page template with particles, GSAP-powered motion, video backgrounds, and a complete multi-page React structure ready to extend.</p>
        <div style={{display:'flex',gap:10,marginTop:14}}>
          <Link to="/services"><button className="btn">Our Services</button></Link>
          <a href="#pricing" style={{alignSelf:'center',color:'var(--muted)'}}>See Pricing →</a>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="section" id="features">
      <div className="container">
        <h2>Features</h2>
        <div className="cards">
          <div className="card">GSAP animations for smooth motion</div>
          <div className="card">Advanced particle system with interactivity</div>
          <div className="card">Autoplay video backgrounds</div>
          <div className="card">Responsive & accessible UI</div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  useEffect(()=>{
    gsap.from('.card', { scrollTrigger: { trigger: '.cards', start: 'top 80%' }, y: 30, opacity: 0, stagger: 0.12 });
  }, []);
  return (
    <section className="section" id="services">
      <div className="container">
        <h2>Our Services</h2>
        <div className="cards">
          <div className="card">UI/UX Design</div>
          <div className="card">Frontend Development</div>
          <div className="card">Performance Optimization</div>
          <div className="card">Accessibility Audits</div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="section" id="pricing">
      <div className="container">
        <h2>Pricing</h2>
        <div className="pricingGrid">
          <div className="pricing">
            <h3>Starter</h3>
            <p>$19 / month</p>
            <ul>
              <li>Basic components</li>
              <li>Email support</li>
            </ul>
            <button className="btn">Choose</button>
          </div>
          <div className="pricing">
            <h3>Pro</h3>
            <p>$49 / month</p>
            <ul>
              <li>Everything in Starter</li>
              <li>Priority support</li>
            </ul>
            <button className="btn">Choose</button>
          </div>
          <div className="pricing">
            <h3>Enterprise</h3>
            <p>Contact us</p>
            <ul>
              <li>Custom integrations</li>
              <li>Dedicated support</li>
            </ul>
            <button className="btn">Contact</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [index, setIndex] = useState(0);
  const data = [
    { name: 'Priya', text: 'Amazing product — boosted our conversion.' },
    { name: 'Rahul', text: 'Excellent performance and docs.' },
    { name: 'Sara', text: 'Beautiful design, easy to customize.' }
  ];
  useEffect(()=>{
    const id = setInterval(()=> setIndex(i => (i+1)%data.length), 4000);
    return ()=> clearInterval(id);
  },[]);
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <h2>What people say</h2>
        <div className="testimonials" style={{marginTop:18}}>
          {data.map((t,i)=> (
            <div key={i} className="testCard" style={{opacity: i===index?1:0.2,transform: i===index? 'scale(1.02)':'scale(0.98)',transition:'0.5s'}}>
              <strong>{t.name}</strong>
              <p style={{color:'var(--muted)'}}>{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  function handleSubmit(e){
    e.preventDefault();
    setSent(true);
    gsap.to('.contactForm', { opacity: 0.9, y: -6, duration: 0.5 });
  }
  return (
    <section className="section" id="contact">
      <div className="container">
        <h2>Contact</h2>
        {!sent ? (
          <form className="contactForm" onSubmit={handleSubmit} style={{maxWidth:520,margin:'24px auto',display:'grid',gap:10}}>
            <input name="name" placeholder="Your name" required />
            <input name="email" type="email" placeholder="Your email" required />
            <textarea name="message" rows={5} placeholder="Message..." required />
            <button className="btn" type="submit">Send message</button>
          </form>
        ) : (
          <div style={{padding:20,background:'rgba(255,255,255,0.03)',borderRadius:12}}>Thanks — we received your message.</div>
        )}
      </div>
    </section>
  );
}

function Footer(){
  return (
    <footer className="footer">
      <div className="container">© {new Date().getFullYear()} MyLanding • Built with React + GSAP + tsParticles</div>
    </footer>
  );
}

export default function App(){
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    const t = setTimeout(()=> setLoading(false), 1400);
    return ()=> clearTimeout(t);
  },[]);

  return (
    <>
      <style>{styles}</style>
      {loading && <Preloader onFinish={()=>setLoading(false)} />}
      <Router>
        <Navbar />
        <main style={{paddingTop:72}}>
          <Routes>
            <Route path="/" element={<>
              <Home />
              <Features />
              <Services />
              <Pricing />
              <Testimonials />
              <Contact />
            </>} />
            <Route path="/services" element={<>
              <Services />
              <Testimonials />
            </>} />
            <Route path="/pricing" element={<Pricing/>} />
            <Route path="/testimonials" element={<Testimonials/>} />
            <Route path="/contact" element={<Contact/>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
}

/*
--- Deployment Instructions ---

GitHub Pages (simple):
1. Build your app: `npm run build` (Vite)
2. Push to GitHub and use GitHub Pages to serve the `dist` (Vite) or `build` folder.
3. For SPA routing, add a `_redirects` file if using Netlify or configure the server to serve index.html.

Netlify (recommended):
1. Push your repo to GitHub.
2. Netlify > New site from Git > pick repo > set build command `npm run build` and publish dir `dist` (Vite).
3. Deploy; Netlify will handle SPA rewrites if you add `_redirects` with `/* /index.html 200`.

Vercel: `vercel` in your project folder also works smoothly.
*/
