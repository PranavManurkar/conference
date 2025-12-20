"use client";

import React from "react";
import { Calendar, MapPin, Star, Globe, ExternalLink } from "lucide-react";
import Image from "next/image";

type DateItemProps = { date: string; label: string };
const DateItem = ({ date, label }: DateItemProps) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <Calendar className="h-6 w-6 text-blue-600 mt-1" />
    </div>
    <div>
      <p className="text-lg font-semibold text-blue-900">{date}</p>
      <p className="text-gray-600">{label}</p>
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
      image: "/images/rajwada.jpg",
      googleMapsLink: "https://www.google.com/maps/place/Rajwada+Palace,+Indore/",
    },
    {
      id: "lalbagh",
      title: "Lal Bagh Palace",
      description:
        "A grand palace showcasing the lifestyle and legacy of the Holkar dynasty, surrounded by landscaped gardens.",
      icon: <MapPin className="h-6 w-6" />,
      accent: "bg-green-50",
      image: "/images/lalbagh.jpg",
      googleMapsLink: "https://www.google.com/maps/place/Lal+Bagh+Palace,+Indore/",
    },
    {
      id: "khajrana",
      title: "Khajrana Ganesh Temple",
      description:
        "One of Indore’s most revered temples, attracting devotees and visitors throughout the year.",
      icon: <Globe className="h-6 w-6" />,
      accent: "bg-blue-50",      image: "/images/khajrana.jpg",
      googleMapsLink: "https://www.google.com/maps/place/Khajrana+Ganesh+Temple,+Indore/",    },
    {
      id: "sarafa",
      title: "Sarafa & Chappan Dukan",
      description:
        "Famous food streets of Indore, known for vibrant night markets and authentic local cuisine.",
      icon: <Star className="h-6 w-6" />,
      accent: "bg-green-50",
      image: "/images/sarafa.jpg",
      googleMapsLink: "https://www.google.com/maps/place/Sarafa+Bazar,+Indore/",
    },
  ];

  return (
    <>

      {/* Indore Key Attractions Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-gray-900">
              Key <span className="text-blue-600">Attractions</span> of Indore
            </h3>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Prominent landmarks and experiences that represent Indore’s heritage,
              culture, and cuisine.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {attractions.map((a) => (
              <article
                key={a.id}
                className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
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
                      <h4 className="text-lg font-semibold text-blue-900">
                        {a.title}
                      </h4>
                      <p className="mt-2 text-sm text-gray-700">
                        {a.description}
                      </p>
                    </div>
                    <a
                      href={a.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 flex-shrink-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
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
