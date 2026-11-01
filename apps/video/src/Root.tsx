import { Composition } from 'remotion';
import { NotFoundClip } from './compositions/NotFoundClip';
import { TitleCard } from './compositions/TitleCard';

export function Root() {
  return (
    <>
      <Composition
        id="TitleCard"
        component={TitleCard}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NotFound404"
        component={NotFoundClip}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
}
