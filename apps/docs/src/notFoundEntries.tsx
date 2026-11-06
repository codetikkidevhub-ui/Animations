import * as Gallery from '@codetikki/animations';
import type { ComponentType } from 'react';
import type { RegistryEntry } from './registry';

const pages: [string, string][] = [
  ['not-found-swarm', 'NotFoundSwarm'],
  ['not-found-physics', 'NotFoundPhysics'],
  ['not-found-spaghettify', 'NotFoundSpaghettify'],
  ['not-found-entropy', 'NotFoundEntropy'],
  ['not-found-matrix', 'NotFoundMatrix'],
  ['not-found-shatter', 'NotFoundShatter'],
  ['not-found-fluid', 'NotFoundFluid'],
  ['not-found-fractal', 'NotFoundFractal'],
  ['not-found-hyper-echo', 'NotFoundHyperEcho'],
  ['not-found-pixel-sort', 'NotFoundPixelSort'],
  ['not-found-cloth', 'NotFoundCloth'],
  ['not-found-neon', 'NotFoundNeon'],
  ['not-found-black-hole', 'NotFoundBlackHole'],
  ['not-found-story', 'NotFoundStory'],
];

export const notFoundEntries: RegistryEntry[] = pages.map(([id, name]) => {
  const Demo = (Gallery as unknown as Record<string, ComponentType>)[name];
  return {
    id,
    name,
    category: 'Status pages',
    tall: true,
    usage: `<${name} />`,
    code: `import { ${name} } from '@codetikki/animations';

<${name} />`,
    Demo: () => <Demo />,
  };
});
