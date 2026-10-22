import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createGarden3D(container, { onGroundClick, onPlantClick, onError } = {}) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); }
  catch (error) { onError?.(error); return { setPlants() {}, resetView() {}, dispose() {} }; }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e7eee5');
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  const home = new THREE.Vector3(12, 13, 15);
  camera.position.copy(home);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D garden. Drag to rotate, scroll to zoom, click soil to plant.');
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
  container.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, .3, 0);
  controls.enableDamping = true;
  controls.minDistance = 10; controls.maxDistance = 27;
  controls.maxPolarAngle = Math.PI * .46;
  controls.minPolarAngle = .25;
  controls.enablePan = false;
  const ambient = new THREE.HemisphereLight(0xf5ffff, 0x788057, 2.8);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffedcc, 4.2);
  sun.position.set(-7, 15, 7); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: .5, far: 40 });
  sun.shadow.normalBias = .035;
  scene.add(sun);
  const materials = new Map();
  function mat(color, extra = {}) {
    const key = color + JSON.stringify(extra);
    if (!materials.has(key)) materials.set(key, new THREE.MeshStandardMaterial({ color, roughness: .85, ...extra }));
    return materials.get(key);
  }
  function mesh(parent, geometry, color, x = 0, y = 0, z = 0, extra) {
    const m = new THREE.Mesh(geometry, mat(color, extra));
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  function ball(parent, color, x, y, z, radius, scale) {
    const m = mesh(parent, new THREE.IcosahedronGeometry(radius, 1), color, x, y, z);
    if (scale) m.scale.set(...scale); return m;
  }
  function cylinder(parent, color, x, y, z, top, bottom, height, sides = 8) {
    return mesh(parent, new THREE.CylinderGeometry(top, bottom, height, sides), color, x, y, z);
  }
  const island = new THREE.Group(); scene.add(island);
  const shape = new THREE.Shape();
  const r = .65, a = 5.3;
  shape.moveTo(-a+r,-a); shape.lineTo(a-r,-a); shape.quadraticCurveTo(a,-a,a,-a+r);
  shape.lineTo(a,a-r); shape.quadraticCurveTo(a,a,a-r,a); shape.lineTo(-a+r,a); shape.quadraticCurveTo(-a,a,-a,a-r);
  shape.lineTo(-a,-a+r); shape.quadraticCurveTo(-a,-a,-a+r,-a);
  const slab = mesh(island, new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .15, bevelThickness: .12 }), '#ae7954');
  slab.rotation.x = -Math.PI/2; slab.position.y = -1.12;
  const grass = mesh(island, new THREE.ExtrudeGeometry(shape, { depth: .15, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .12, bevelThickness: .08 }), '#91b969');
  grass.rotation.x = -Math.PI/2; grass.position.y = -.05;
  const ground = mesh(island, new THREE.PlaneGeometry(9.25, 8.1), '#a5be78', 0, .145, .35);
  ground.rotation.x = -Math.PI/2; ground.userData.ground = true;
  // The pale central clearing keeps small shoots readable against the scenery.
  for (let i=0; i<9; i++) {
    const z=-4.5+i*1.12;
    for (const x of [-5.02,5.02]) {
      cylinder(island,'#e6d4ad',x,.48,z,.07,.08,.7);
      if(i<8) mesh(island,new THREE.BoxGeometry(.065,.08,1.14),'#e6d4ad',x,.58,z+.56);
    }
  }
  for(let i=0;i<8;i++) {
    const x=-4.5+i*1.28;
    cylinder(island,'#e6d4ad',x,.48,-5,.07,.08,.7);
    if(i<7) mesh(island,new THREE.BoxGeometry(1.3,.08,.065),'#e6d4ad',x+.64,.58,-5);
  }
  function tree(x,z,size=1) {
    cylinder(island,'#986b4a',x,.8*size,z,.13*size,.2*size,1.4*size);
    ball(island,'#527c50',x,1.75*size,z,.85*size,[1,1.18,1]);
    ball(island,'#749755',x-.3*size,2.1*size,z+.12,.62*size);
  }
  tree(-4.25,-3.7,1); tree(4.3,-3.8,.8); tree(-4.5,2,.65);
  for(let i=0;i<12;i++) {
    const x=-4.5+i*.8;
    ball(island,i%2?'#7ca365':'#6b9358',x,.34,-4.55,.35,[1,.8,1]);
  }
  const pond = cylinder(island,'#79bfc2',3.65,.19,3.6,1.03,1.03,.07,32);
  pond.scale.z=.72; pond.material = mat('#79bfc2',{metalness:.12,roughness:.25});
  for(let i=0;i<11;i++) {
    const angle=i/11*Math.PI*2;
    ball(island,'#c4c5af',3.65+Math.cos(angle)*1.04,.24,3.6+Math.sin(angle)*.76,.2,[1.2,.55,.85]);
  }
  for(let i=0;i<5;i++) {
    const stone=cylinder(island,'#d9d6bb',-2.3+i*.95,.2,4.35,.33,.38,.09,7);
    stone.scale.z=.7; stone.rotation.y=i;
  }
  for(let i=0;i<30;i++) {
    const x=Math.sin(i*9.7)*4.7,z=(i%2?-1:1)*4.75;
    if(z>0&&x>2.4)continue;
    cylinder(island,'#78994e',x,.28,z,.015,.025,.2,5);
    ball(island,['#f4d080','#eeb4ae','#ede9cc'][i%3],x,.4,z,.075);
  }
  const shadowFloor = mesh(scene,new THREE.PlaneGeometry(200,200),'#e7eee5',0,-1.8,0);
  shadowFloor.rotation.x=-Math.PI/2; shadowFloor.material= new THREE.ShadowMaterial({opacity:.1});
  const plantGroup = new THREE.Group(); scene.add(plantGroup);
  function clearPlants() {
    plantGroup.traverse(o=>{if(o.geometry)o.geometry.dispose();});
    plantGroup.clear();
  }
  function plant(p) {
    const g = new THREE.Group();
    g.position.set((Number(p.x)/100-.5)*10,.19,(Number(p.y)/100-.5)*10);
    g.userData.plantId=p.id;
    plantGroup.add(g);
    const stage=Math.max(1,Math.min(5,Number(p.stage)||1));
    const v=((Number(p.variant)||0)%5+5)%5;
    const rare=p.tier==='rare', ancient=p.tier==='extinct';
    const green=ancient?'#48a9a0':rare?'#77a9a4':'#5f9c58';
    cylinder(g,'#8d7354',0,.015,0,.29,.32,.04,12);
    if(!p.done&&stage===1) {
      ball(g,'#88af59',0,.15,0,.13,[.6,1.2,.6]);
      const leaf=ball(g,'#7aa65c',.1,.22,0,.12,[1.4,.35,.7]); leaf.rotation.z=.4; return;
    }
    const height=p.done?(ancient?1.2:rare?.95:.75):.14+stage*.12;
    cylinder(g,green,0,height/2,0,.035,.045,height,7);
    const leaves=p.done?6:stage;
    for(let i=0;i<leaves;i++) {
      const angle=i*2.4, y=.16+(i/leaves)*height*.64;
      const leaf=ball(g,green,Math.cos(angle)*.15,y,Math.sin(angle)*.15,.17,[1.6,.3,.7]);
      leaf.rotation.y=-angle; leaf.rotation.z=Math.cos(angle)*.4;
    }
    if(!p.done) {
      if(stage>=4)ball(g,'#b3ca78',0,height+.08,0,stage===5?.17:.11);
      return;
    }
    const palette=ancient?['#ffbd68','#d5a9ef','#85bbed','#79d6bc','#b9c6ff']:rare?['#c3a0e2','#abd4e8','#e2a6c7','#b5d8aa','#c6c0f0']:['#f5d16e','#a6ce8d','#edf0cc','#eea396','#b8b0de'];
    const color=palette[v];
    if(v===4||ancient&&v===2) {
      cylinder(g,'#88725b',0,height*.56,0,.07,.11,height,7);
      for(let i=0;i<6;i++) {
        const a=i*2.4;
        ball(g,color,Math.cos(a)*.24,height+.12+(i%2)*.26,Math.sin(a)*.24,.31,[1,1.15,1]);
      }
    } else if(v===1) {
      for(let i=0;i<6;i++) {
        const a=i*Math.PI/3;
        const leaf=ball(g,color,Math.cos(a)*.21,height,Math.sin(a)*.21,.22,[.8,.4,1.6]); leaf.rotation.y=-a;
      }
      ball(g,'#fff0b4',0,height+.07,0,.12);
    } else {
      for(let i=0;i<(v===3?4:7);i++) {
        const a=i*Math.PI*2/(v===3?4:7);
        const petal=ball(g,color,Math.cos(a)*.19,height+.06,Math.sin(a)*.19,.17,[1.1,v===3?1.6:.65,1]);
        petal.rotation.z=Math.cos(a)*.3;
      }
      ball(g,'#ffe5a0',0,height+.13,0,.13);
    }
    if(rare||ancient) {
      for(let i=0;i<(ancient?5:3);i++) {
        const a=i*2.4;
        const crystal=mesh(g,new THREE.OctahedronGeometry(ancient?.12:.075),color,Math.cos(a)*.4,.2+(i%3)*.17,Math.sin(a)*.4,{emissive:color,emissiveIntensity:.25,metalness:.2,roughness:.3});
        crystal.scale.y=1.8;
      }
    }
    if(ancient) {
      const halo=mesh(g,new THREE.TorusGeometry(.42,.018,6,40),'#f2d28c',0,height+.28,0,{emissive:'#d8ab53',emissiveIntensity:.25});
      halo.rotation.x=Math.PI/2;
    }
  }
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  let down=null, disposed=false, frame;
  const pointerDown=e=>{
    // Additional touch pointers cancel a tap so pinching never plants a task.
    if(!e.isPrimary||e.button!==0){down=null;return;}
    down={id:e.pointerId,x:e.clientX,y:e.clientY,time:performance.now()};
  };
  const pointerUp=e=>{
    if(!down||e.pointerId!==down.id||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6||performance.now()-down.time>650){down=null;return;}
    down=null;
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);
    const hits=raycaster.intersectObjects([plantGroup,ground],true);
    if(!hits.length)return;
    let target=hits[0].object;
    while(target&&target!==scene){if(target.userData.plantId!==undefined){onPlantClick?.(target.userData.plantId);return;}target=target.parent;}
    if(hits[0].object===ground){const p=hits[0].point;onGroundClick?.(THREE.MathUtils.clamp((p.x/10+.5)*100,4,96),THREE.MathUtils.clamp((p.z/10+.5)*100,4,96));}
  };
  renderer.domElement.addEventListener('pointerdown',pointerDown);
  renderer.domElement.addEventListener('pointerup',pointerUp);
  const pointerCancel=()=>{down=null;};
  renderer.domElement.addEventListener('pointercancel',pointerCancel);
  const contextLost=e=>{e.preventDefault();onError?.(new Error('The 3D graphics context was interrupted. Reload to restore the garden.'));};
  renderer.domElement.addEventListener('webglcontextlost',contextLost);
  const resize=()=>{const w=container.clientWidth||600,h=container.clientHeight||500;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};
  const observer=new ResizeObserver(resize);observer.observe(container);resize();
  function animate(){if(disposed)return;frame=requestAnimationFrame(animate);if(document.hidden||!container.offsetParent)return;controls.update();renderer.render(scene,camera);} animate();
  let plantSignature = null;
  return {
    setPlants(plants){
      if(disposed)return;
      // Seed selection and UI refreshes do not change the rendered meshes.
      const signature=JSON.stringify(plants.map(({id,x,y,done,stage,tier,variant})=>[id,x,y,done,stage,tier,variant]));
      if(signature===plantSignature)return;
      plantSignature=signature;
      clearPlants();for(const p of plants)plant(p);
      renderer.shadowMap.needsUpdate=true;
    },
    resetView(){camera.position.copy(home);controls.target.set(0,.3,0);controls.update();},
    dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();controls.dispose();renderer.domElement.removeEventListener('pointerdown',pointerDown);renderer.domElement.removeEventListener('pointerup',pointerUp);renderer.domElement.removeEventListener('pointercancel',pointerCancel);renderer.domElement.removeEventListener('webglcontextlost',contextLost);scene.traverse(o=>{o.geometry?.dispose();});for(const m of materials.values())m.dispose();shadowFloor.material.dispose();renderer.dispose();renderer.domElement.remove();}
  };
}
