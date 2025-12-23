"use client";

import React from "react";
import { Calendar, MapPin, Star, Globe, ExternalLink } from "lucide-react";
import Image from "next/image";

type DateItemProps = { date: string; label: string };
const DateItem = ({ date, label }: DateItemProps) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <Calendar className="h-6 w-6 text-[color:var(--primary)] mt-1" />
    </div>
    <div>
      <p className="text-lg font-semibold text-[color:var(--primary)]">{date}</p>
      <p className="text-[color:var(--nav)]/80">{label}</p>
    </div>
  </div>
);

type Attraction = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accent?: string;
  image: string;
  googleMapsLink: string;
};

export default function KeyAttraction() {
  const attractions: Attraction[] = [
    {
      id: "rajwada",
      title: "Rajwada Palace",
      description:
        "Historic seven-storey palace blending Maratha and French architecture, located in the heart of old Indore.",
      icon: <Star className="h-6 w-6" />,
      accent: "bg-blue-50",
      image: "/indore.jpg",
      googleMapsLink: "https://www.madhya-pradesh-tourism.com/destination/Rajwada-Palace-60",
    },
    {
      id: "lalbagh",
      title: "Lal Bagh Palace",
      description:
        "A grand palace showcasing the lifestyle and legacy of the Holkar dynasty, surrounded by landscaped gardens.",
      icon: <MapPin className="h-6 w-6" />,
      accent: "bg-green-50",
      image: "/LALBAGH-PALACE-INDORE.png",
      googleMapsLink: "https://www.madhya-pradesh-tourism.com/destination/Lalbagh-Palace-Museum-84",
    },
  
    // New entries
    {
      id: "ralamandal",
      title: "Ralamandal Wildlife Sanctuary",
      description:
        "A peaceful sanctuary and hilltop trekking spot just outside Indore — good for short hikes, birdwatching and views (close to IIT Indore direction).",
      icon: <MapPin className="h-6 w-6" />,
      accent: "bg-blue-50",
      image: "/ralamandal.jpg",
      googleMapsLink: "https://ramadaencoreindore.com/ralamandal-wildlife-sanctuary-a-nature-lovers-haven-in-indore/",
    },
    {
      id: "omkareshwar",
      title: "Omkareshwar",
      description:
        "One of the 12 Jyotirlinga shrines on an island in the Narmada river — a major pilgrimage town with temples and ghats.",
      icon: <Globe className="h-6 w-6" />,
      accent: "bg-green-50",
      image: "/omkareshwar.jpg",
      googleMapsLink: "https://www.mptourism.com/destination-omkareshwar.php",
    },
    {
      id: "mandu",
      title: "Mandu (Jahaz Mahal & Forts)",
      description:
        "Historic hill-fort complex with Jahaz Mahal, Hindola Mahal, Rani Roopmati Pavilion and many medieval fortifications — a major heritage site near Indore.",
      icon: <Star className="h-6 w-6" />,
      accent: "bg-blue-50",
      image: "/mandu.jpg",
      googleMapsLink: "https://www.mptourism.com/destination-mandu.php",
    },
    {
      id: "maheshwar",
      title: "Maheshwar (Ahilya Fort)",
      description:
        "Riverside town on the Narmada known for the Ahilya Fort, ghats, handloom weaving and Holkar-era heritage.",
      icon: <Star className="h-6 w-6" />,
      accent: "bg-green-50",
      image: "/maheshwar.jpg",
      googleMapsLink: "https://www.mptourism.com/destination-maheshwar.php",
    },
    {
      id: "patalpani",
      title: "Patalpani Waterfall",
      description:
        "Popular waterfall and picnic/trekking spot near Mhow (Indore district); best visited during/after monsoon when the flow is strong.",
      icon: <MapPin className="h-6 w-6" />,
      accent: "bg-blue-50",
      image: "/patalpani.jpg",
      googleMapsLink: "https://www.mptourism.com/patalpani-waterfall-place-to-visit-near-indore-in-madhya-pradesh.html",
    },
  ];
  

  return (
    <>

      {/* Indore Key Attractions Section */}
      <section className="py-8 bg-[color:var(--nav)]/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-[color:var(--nav)]">
              Tourist <span className="text-[color:var(--primary)]">Attractions</span> of Indore
            </h3>
            <p className="mt-2 text-[color:var(--nav)]/80 max-w-2xl mx-auto">
              Prominent landmarks and experiences that represent Indore’s heritage,
              culture, and cuisine.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {attractions.map((a) => (
              <article
                key={a.id}
                className="bg-[color:var(--primary-foreground)] border border-[color:var(--nav)]/10 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-[color:var(--primary)]">
                        {a.title}
                      </h4>
                      <p className="mt-2 text-sm text-[color:var(--nav)]/80">
                        {a.description}
                      </p>
                    </div>
                    <a
                      href={a.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 flex-shrink-0 p-2 text-[color:var(--primary)] hover:bg-[color:var(--nav)]/10 rounded-lg transition-colors duration-200"
                      aria-label={`View ${a.title} on Google Maps`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
