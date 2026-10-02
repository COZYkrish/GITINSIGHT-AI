# Three.js Canvas Memory Cleanup & Stability

## WebGL Resource Disposals
When `<SolarSystem />` unmounts:
- Geometries call `.dispose()`
- Materials and textures call `.dispose()`
- Animation frame loop halts via `cancelAnimationFrame`.
- Prevents WebGL context leaks on single page route transitions.
