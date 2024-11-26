import { useMemo } from "react";
import { ExtrudeGeometry, Shape } from "three";
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

export function LeafGeometry() {
  const geometry = useMemo(() => {
    const shape = new Shape();
    
    // Create an SVG loader
    const loader = new SVGLoader();
    
    // Your SVG path data - make sure it's one continuous string without line breaks
    const svgPath = "M174.4 27.3c.2 7.6-1.5 9.4-14 15.7-9.9 5-15.4 9.2-21.9 16.9-.5.6-5 3.8-10 7-16 10.5-27.7 23.9-30.6 35.1-.9 3.4-1.8 5-2.9 5-2.7 0-12.7 18.6-17.9 33.3-4.9 14.1-7.4 27.5-7.5 41.2-.1 20.5-2.1 18.9 68.4 53.3 20.7 10.2 35.7 19.4 39.4 24.4 1.9 2.7 1.9 2.8 0 4.9-1.5 1.7-2.6 2-5.6 1.5-6.4-1-18.8-6.9-43.4-20.6-28.2-15.6-43.4-25.4-52.7-34-3.9-3.6-7.3-6-8.1-5.7-3.8 1.5-2.8 44.2 1.4 65 3.4 16.5 8.7 31.3 12.7 35.9.9 1 1.6 3.6 1.7 5.8.3 5.5 11.5 27.6 20 39.3 19.1 26.7 47.3 52.2 70.9 64.5 17.5 9.1 36.3 12.9 53.9 11.1 30.8-3.1 49.1-15.8 56.6-39.1 1.4-4.4 1.7-8.8 1.5-25.1-.1-11 .1-19.7.3-19.4.3.2 5.8 16.4 12.3 35.8 15.6 46.4 24.7 70.7 36.9 98.1 6 13.5 6.9 14.4 11.2 11l2.3-1.9-8.5-19.9c-12.5-29.2-23.6-58.9-39.3-105.7-4.1-11.9-7-21.7-6.5-21.7 1.1 0 7.5 8.3 15.8 20.5 6.3 9.3 10.2 12.6 21 18 12.6 6.2 33.4 8.8 46.2 5.6 17.1-4.2 33.8-16.9 46.7-35.6 8-11.5 16-33.1 19.5-52.4 3.7-20.6 2.3-71.1-2.2-75.5-1.3-1.3-1.8-.7-7 8.6-2.2 3.9-7.3 10.1-13.5 16.3-8.2 8.2-12.4 11.4-23 17.7-21.6 12.9-33.3 17.1-36.5 13.3-2.2-2.6 3.3-7 17-13.7 16.7-8.2 25.8-14.4 36.1-24.7 9.3-9.4 15.5-18.9 18.9-29.1 4.2-12.5 1.2-31-8.5-51.6-5.2-11.2-11.9-21.6-17.6-27.3-4.9-4.9-7.6-5.3-8.4-1.4-1.6 7.4-7.1 22.8-11.4 31.8-5.8 12-13.7 24.2-28 43-17.9 23.6-27.2 32.1-32.1 29.5-4.2-2.3-2.2-5.5 13.6-22.2 17.8-18.7 33.5-41.2 39.8-57.1 6.5-16.4 8.4-36.6 4.1-44.7-2.1-4.1-20-22.7-30.2-31.5-11.6-9.9-22.6-14.8-25.9-11.5-.7.7-1.6-.9-2.8-5-1.3-4.8-2.7-7.1-6.4-10.8C309 38.1 278.6 27 259.3 27c-6.3 0-9.3 1.3-9.3 4 0 2.5-.3 2.5-6.9 0-10.2-3.9-18.8-5.1-39.1-5.4-15.6-.2-20.3-.6-23.4-1.9-5.9-2.6-6.4-2.4-6.2 3.6z";
    
    try {
      // Parse the path
      const paths = loader.parse(`<svg><path d="${svgPath}"/></svg>`).paths;
      
      // Get the first path and convert it to a shape
      if (paths[0]) {
        const path = paths[0];
        
        // Scale down the shape (since SVG coordinates are typically larger)
        const scale = 0.001; // Adjust this value to get the right size
        
        path.subPaths.forEach((subPath) => {
          const points = subPath.getPoints();
          points.forEach((point, index) => {
            if (index === 0) {
              shape.moveTo(point.x * scale, point.y * scale);
            } else {
              shape.lineTo(point.x * scale, point.y * scale);
            }
          });
        });
      }
    } catch (error) {
      console.error('Error parsing SVG path:', error);
      // Fallback to a simple shape if parsing fails
      shape.moveTo(0, 0);
      shape.bezierCurveTo(-0.1, 0.2, -0.2, 0.3, 0, 0.5);
      shape.bezierCurveTo(0.2, 0.3, 0.1, 0.2, 0, 0);
    }

    return new ExtrudeGeometry(shape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    });
  }, []);

  return geometry;
}
