import React, { useEffect, useState } from "react";

const slides = [
  {
    title: "Formations en ligne Formeo",
    subtitle: "Développez vos compétences où que vous soyez.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Sessions limitées à 12 participants",
    subtitle: "Un suivi personnalisé pour chaque apprenant.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Intervenants qualifiés",
    subtitle: "Des professionnels au service de votre progression.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
];

const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true); // Fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
        setFadeOut(false); // Fade in
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[index];

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <p className={`text-xs uppercase tracking-[0.25em] mb-2 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            Plateforme de formations
          </p>
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            {current.title}
          </h1>
          <p className={`text-sm md:text-base mb-6 text-indigo-100 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            {current.subtitle}
          </p>
          <a
            href="#categories"
            className="inline-flex items-center px-4 py-2 rounded-full bg-white text-indigo-600 text-sm font-medium shadow hover:bg-slate-100"
          >
            Découvrir les catégories
          </a>
        </div>
        
        {/* Zone slider images */}
        <div className="relative h-40 md:h-56 rounded-2xl bg-white/10 border border-white/20 overflow-hidden">
          <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
               style={{ transform: `translateX(-${index * 100}%)` }}>
            {slides.map((slide, i) => (
              <div key={i} className="w-full h-full flex-shrink-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Dots indicateurs */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setFadeOut(true);
                  setTimeout(() => {
                    setIndex(i);
                    setFadeOut(false);
                  }, 400);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
