import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { extend } from "@react-three/fiber";

function seek(particle, target) {
  let { position, velocity, maxVelocity, maxForce } = particle;
  let desired = target.clone();
  desired.sub(position);
  let length = desired.length();
  desired.normalize();
  desired.multiplyScalar(maxVelocity);
  desired.sub(velocity);
  if (length > 0) {
    desired.divideScalar(1 / length);
  }
  desired.clampLength(-maxForce, maxForce);
  return desired;
}

function runFlocking(particle, particles, mousePosition) {
  let { maxVelocity, maxForce, velocity, t } = particle;

  const desiredSeparation = 8 + 5 * Math.sin(t * 0.1);
  const desiredAlignment = 30;
  const desiredCohesion = 12;

  const separationMix = 2.6;
  const alignmentMix = 0.6;
  const cohesionMix = 0.2;
  const mouseMix = 0.8 + Math.sin(t * 0.3) * 0.3;

  let separation = new THREE.Vector3();
  let alignment = new THREE.Vector3();
  let cohesion = new THREE.Vector3();
  let separationCount = 0;
  let alignmentCount = 0;
  let cohesionCount = 0;

  particle.loopStep++;
  let loopStart = particle.loopStep % 2 === 0 ? 0 : particles.length / 2;
  let loopEnd =
    particle.loopStep % 2 === 0 ? particles.length / 2 : particles.length;

  for (let i = loopStart; i < loopEnd; ++i) {
    let { position, velocity } = particles[i];
    let d = particle.position.distanceTo(position);

    //Calculate separation steering forces
    if (d > 0 && d < desiredSeparation) {
      let diff = particle.position.clone();
      diff.sub(position);
      diff.divideScalar(d);
      separation.add(diff);
      separationCount++;
    }

    //Calculate cohesion steering forces
    if (d > 0 && d < desiredCohesion) {
      cohesion.add(position);
      cohesionCount++;
    }

    //Calculate alignment steering forces
    if (d > 0 && d < desiredAlignment) {
      alignment.add(velocity);
      alignmentCount++;
    }
  }

  //Post-process separation
  if (separationCount > 0) {
    separation.divideScalar(separationCount);
  }
  if (separation.length() > 0) {
    separation.normalize();
    separation.multiplyScalar(maxVelocity);
    separation.sub(velocity);
    separation.clampLength(-maxForce, maxForce);
  }

  //Post process cohesion
  if (cohesionCount > 0) {
    cohesion.divideScalar(cohesionCount);
  }

  //Post-process alignment
  if (alignmentCount > 0) {
    alignment.divideScalar(alignmentCount);
  }
  if (alignment.length() > 0) {
    alignment.normalize();
    alignment.multiplyScalar(maxVelocity);
    alignment.sub(velocity);
    alignment.clampLength(-maxForce, maxForce);
  }

  particle.accelleration.add(separation.multiplyScalar(separationMix));
  particle.accelleration.add(
    seek(particle, cohesion).multiplyScalar(cohesionMix)
  );

  particle.accelleration.add(alignment.multiplyScalar(alignmentMix));

  let temp = particle.position.clone();
  temp.sub(mousePosition);
  temp.normalize();
  let perp = new THREE.Vector3(temp.y, temp.x, temp.z);

  perp.multiplyScalar(5);
  temp.addVectors(mousePosition, perp);

  particle.accelleration.add(seek(particle, temp).multiplyScalar(mouseMix));
}

extend({ PointsMaterial: THREE.PointsMaterial });

function Flock({ count, mouse }) {
  const mesh = useRef();
  const light = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const timeSpeed = (0.01 + Math.random() / 200) / 2;
      const velocity = new THREE.Vector3(
        0.5 - Math.random(),
        0.5 - Math.random(),
        0.5 - Math.random()
      );
      const position = new THREE.Vector3(
        (0.5 - Math.random()) * 100,
        (0.5 - Math.random()) * 100,
        (0.5 - Math.random()) * 100
      );
      const maxVelocity = 1.0 + Math.random() * 0.5;
      const maxForce = 0.1;
      const accelleration = new THREE.Vector3(0, 0, 0);
      const loopStep = 0;
      temp.push({
        t,
        timeSpeed,
        position,
        velocity,
        maxVelocity,
        maxForce,
        accelleration,
        loopStep,
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    let mousePosition = new THREE.Vector3(
      mouse.current[0] / aspect,
      -mouse.current[1] / aspect,
      0
    );

    light.current.position.set(
      mousePosition.x,
      mousePosition.y,
      mousePosition.z
    );

    particles.forEach((particle, i) => {
      let { timeSpeed, maxVelocity } = particle;

      particle.t += timeSpeed;

      particle.accelleration.x = 0;
      particle.accelleration.y = 0;
      particle.accelleration.z = 0;

      runFlocking(particle, particles, mousePosition);

      particle.accelleration.multiplyScalar(0.15);

      particle.velocity.multiplyScalar(0.999);
      particle.velocity.add(particle.accelleration);
      particle.velocity.clampScalar(-maxVelocity, maxVelocity);

      particle.position.add(particle.velocity);

      dummy.position.set(
        particle.position.x,
        particle.position.y,
        particle.position.z
      );

      let velocityScale = particle.velocity.length() / maxVelocity;

      dummy.scale.set(velocityScale, velocityScale, 5 * velocityScale);

      let lookTarget = dummy.position.clone();
      lookTarget.add(particle.velocity);

      dummy.lookAt(lookTarget);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <pointLight
        ref={light}
        distance={30}
        intensity={1}
        color="#f7943e"
      ></pointLight>
      <instancedMesh
        ref={mesh}
        args={[null, null, count]}
        position={[0, 0, 10]}
      >
        <boxBufferGeometry attach="geometry" args={[0.5, 0]} />
        <meshStandardMaterial attach="material" color="white" />
      </instancedMesh>
    </>
  );
}

export default Flock;
