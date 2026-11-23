import { PhysicsZone } from '../types';
import { MOTION_ZONES } from './zonesMotion';
import { SURFACE_WATER_ZONES } from './zonesSurfaceWater';
import { MAGNET_MACHINE_ZONES } from './zonesMagnetsMachines';

export const PHYSICS_ZONES: PhysicsZone[] = [
  ...MOTION_ZONES,
  ...SURFACE_WATER_ZONES,
  ...MAGNET_MACHINE_ZONES,
];

export const TOTAL_WONDERS = PHYSICS_ZONES.reduce(
  (sum, zone) => sum + zone.wonders.length,
  0
);
