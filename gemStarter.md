# Project Setup & Commands

This file tracks the commands executed during the setup of the landing page with Three.js, GSAP, and Video assets.

## Rails Controller Generation
Generated the landing controller to serve the root page:
```bash
bin/rails generate controller Landing index --no-helper --no-test-framework
```

## Stimulus Controller Registration
After creating `app/javascript/controllers/threejs_controller.js`, the manifest was updated:
```bash
bin/rails stimulus:manifest:update
```

## JavaScript Bundling
Built the JavaScript assets using esbuild to verify Three.js and GSAP integration:
```bash
npm run build
```

## Asset Pipeline Verification (Internal)
Checked if the GLB model was correctly detected by Propshaft (logical path check):
```bash
bin/rails runner 'puts Rails.application.assets.find_asset("model3D/godot_plush/godot_plush_model.glb")&.logical_path'
```

---

### Implementation Notes:
- **Three.js Imports**: Ensure `.js` extension is used for JSM modules in `esbuild`:
  - `import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"`
  - `import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"`
- **Tailwind 4**: Custom animations and keyframes were added directly to `app/assets/stylesheets/application.tailwind.css`.
- **Stimulus Values**: Used `data-threejs-model-path-value` to pass the `asset_path` from Rails to the Three.js loader.
