import { useState } from 'react';
import { MapPin, Landmark } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

interface CityInfo {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
}

const DUMMY_CITIES: CityInfo[] = [
  {
    id: 1,
    name: '도쿄',
    description: '일본 최대 도시, 세계적 물가 수준',
    imgUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
  },
  {
    id: 2,
    name: '오사카',
    description: '일본 제2도시, 도쿄보다 저렴',
    imgUrl: 'https://images.unsplash.com/photo-1590253230532-a67f6bc61b9e?w=400',
  },
  {
    id: 3,
    name: '교토',
    description: '역사 도시, 관광지 프리미엄 물가',
    imgUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
  },
  {
    id: 4,
    name: '삿포로',
    description: '북해도 중심 도시, 상대적 저렴',
    imgUrl: 'https://images.unsplash.com/photo-1601643157091-ce5c665179ab?w=400',
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function CityCardGrid() {
  return (
    <section aria-label="주요 도시 물가">
      <h2 className="text-xl font-bold text-foreground mb-5">주요 도시 물가</h2>
      <motion.ul
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="list"
      >
        {DUMMY_CITIES.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </motion.ul>
    </section>
  );
}

function CityCard({ city }: { city: CityInfo }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.li
      variants={cardVariants}
      className="rounded-xl overflow-hidden border border-border/60 bg-card shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      role="listitem"
      aria-label={`${city.name} 도시 물가`}
    >
      <div className="relative h-32 bg-slate-100">
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <Landmark className="size-8 text-slate-400" aria-hidden="true" />
          </div>
        ) : (
          <img
            src={city.imgUrl}
            alt={city.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 mb-0.5">
          <MapPin className="size-3 text-muted-foreground" aria-hidden="true" />
          <h3 className="font-semibold text-sm text-foreground">{city.name}</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-snug">{city.description}</p>
      </div>
    </motion.li>
  );
}
