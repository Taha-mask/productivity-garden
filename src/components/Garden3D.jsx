import { useEffect, useMemo, useRef, useState } from 'react';
import { stageAt } from '../game/rules.js';

// Adapter around the shared three.js scene in garden3d.js (owned by Codex).
// Contract: see COORDINATION-3D.md. x/y are 0..100 ground coordinates.

function variantOf(plant) {
  if (plant.matureId) return Number(plant.matureId.slice(1)) - 1;
  return plant.id % 5; // growing plants have no final form yet, any look is fine
}

function toScenePlants(plants, now) {
  return plants.map((p) => ({
    id: p.id,
    x: p.x,
    y: p.y,
    done: Boolean(p.matureId),
    stage: p.matureId ? 5 : stageAt(p.plantedAt, now),
    tier: p.tier,
    variant: variantOf(p),
  }));
}

export default function Garden3D({ plants, now, onGroundClick, onPlantClick, t }) {
  const box = useRef(null);
  const scene = useRef(null);
  const [error, setError] = useState(null);

  // Latest values for callbacks that the scene holds on to.
  const latest = useRef({});
  const scenePlants = useMemo(() => toScenePlants(plants, now), [plants, now]);
  // The scene rebuilds models on setPlants, so only push when something visible changed.
  const key = JSON.stringify(scenePlants);
  latest.current = { onGroundClick, onPlantClick, scenePlants };

  useEffect(() => {
    let dead = false;
    import('../../garden3d.js').then((mod) => {
      if (dead) return;
      scene.current = mod.createGarden3D(box.current, {
        onGroundClick: (x, y) => latest.current.onGroundClick(x, y),
        onPlantClick: (id) => latest.current.onPlantClick(id),
        onError: setError,
      });
      scene.current.setPlants(latest.current.scenePlants);
    }).catch(setError);
    return () => {
      dead = true;
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  useEffect(() => {
    scene.current?.setPlants(latest.current.scenePlants);
  }, [key]);

  return (
    <div className="garden3d" ref={box}>
      {error && <p className="err" role="alert">{t?.sceneLost || error.message}</p>}
      <button className="reset-view" onClick={() => scene.current?.resetView()}>
        {t?.reset || 'Reset view'}
      </button>
    </div>
  );
}
