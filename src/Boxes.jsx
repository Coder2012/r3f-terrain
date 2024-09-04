import { useMemo } from 'react';
import PoissonDiskSampling from 'poisson-disk-sampling';

const getImageData = (texture) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { width, height } = texture.image;

  // Set canvas size to match texture size
  canvas.width = width;
  canvas.height = height;

  // Draw the image onto the canvas
  ctx.drawImage(texture.image, 0, 0, width, height);

  // Extract pixel data
  return ctx.getImageData(0, 0, width, height).data;
}

export const Boxes = ({ maskTexture }) => {
  const positions = useMemo(() => {
    const data = getImageData(maskTexture);
    const width = maskTexture.image.width;
    const height = maskTexture.image.height;

    const sampler = new PoissonDiskSampling({
      shape: [width, height], // Define the area size
      minDistance: 60,        // Minimum distance between points
      tries: 30               // Attempts per point
    });

    const points = sampler.fill();
    const positions = [];

    points.forEach(([x, z]) => {
      const texX = Math.floor(x);
      const texY = Math.floor(z);
      const index = (texY * width + texX) * 4 + 3; // Access alpha channel
      const maskValue = data[index];

      if (maskValue === 255) {
        positions.push([(x / width) * 10 - 5, -.5, (z / height) * 10 - 5]); // Scale to scene
      }
    });

    return positions;
  }, [maskTexture]);

  return (
    <>
      {positions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}
    </>
  );
}
