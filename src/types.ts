export type ZoneId =
  | 'gravity-falling'
  | 'speed-momentum'
  | 'friction-sliding'
  | 'sink-float'
  | 'magnetism-pulls'
  | 'simple-machines';

export type ForcePower =
  | 'Pull Down'
  | 'Spring Bounce'
  | 'Fast Zoom'
  | 'Heavy Push'
  | 'Sticky Grip'
  | 'Slippery Glide'
  | 'Water Lift'
  | 'Invisible Pull'
  | 'Helper Machine';

export interface AnimalPhysicsPro {
  animal: string;
  emoji: string;
  badge: string;
  story: string;
}

export interface PhysicsWonder {
  id: string;
  name: string;
  emoji: string;
  wikiTitle: string;
  /** Optional fallback Wikipedia article titles if the first has no thumbnail */
  wikiFallbacks?: string[];
  forcePower: ForcePower;
  tagline: string;
  /** Concrete age-5 cause-and-effect explanation (zero equations) */
  causeEffect: string;
  /** Dedicated Animal Physics Pro bridge on every single card */
  animalPro: AnimalPhysicsPro;
  /** 1-sentence household experiment kids can do with a grown-up */
  tryAtHome: string;
  accentColor: string;
  /** Relative offset from parent zone center on the 2460x1260 Playground Map */
  offsetX: number;
  offsetY: number;
  facts: string[];
}

export interface PhysicsZone {
  id: ZoneId;
  name: string;
  shortName: string;
  subtitle: string;
  emoji: string;
  color: string;
  softBg: string;
  /** Center X on the 2460x1260 interactive Physics World Map */
  x: number;
  /** Center Y on the 2460x1260 interactive Physics World Map */
  y: number;
  zoom: number;
  intro: string;
  wonders: PhysicsWonder[];
}
