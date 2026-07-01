import { Controller } from "@hotwired/stimulus"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import gsap from "gsap"

export default class extends Controller {
  static targets = ["canvas"]
  static values = { modelPath: String }

  connect() {
    console.log("Threejs controller connected")
    this.onResize = this.onResize.bind(this)
    window.addEventListener("resize", this.onResize)

    // Attendre que le DOM soit prêt
    requestAnimationFrame(() => {
      this.initThree()
      this.loadModel()
      this.animate()
    })
  }

  initThree() {
    // Récupérer le conteneur canvas
    const container = this.canvasTarget
    const rect = container.getBoundingClientRect()
    const width = rect.width || window.innerWidth * 0.7
    const height = rect.height || window.innerHeight

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0a0a0a) // Fond sombre

    // Caméra avec angle pour voir le modèle de 3/4
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000)
    this.camera.position.set(1.5, 1.2, 4.5)
    this.camera.lookAt(0, 0.4, 0)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2

    container.appendChild(this.renderer.domElement)

    // Éclairage premium
    // Light ambiante douce
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    // Light principale (key light)
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.5)
    keyLight.position.set(3, 4, 5)
    keyLight.castShadow = true
    this.scene.add(keyLight)

    // Light de remplissage (fill light)
    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.8)
    fillLight.position.set(-3, 1, 2)
    this.scene.add(fillLight)

    // Light de contre-jour (rim light)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.5)
    rimLight.position.set(-1, 2, -4)
    this.scene.add(rimLight)

    // Light d'accentuation (accent light)
    const accentLight = new THREE.DirectionalLight(0x22ff88, 0.5)
    accentLight.position.set(0, -2, 3)
    this.scene.add(accentLight)

    // Ajout d'un plan au sol réfléchissant (optionnel)
    this.addGroundPlane()
  }

  addGroundPlane() {
    const geometry = new THREE.PlaneGeometry(6, 6)
    const material = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.5
    })
    const plane = new THREE.Mesh(geometry, material)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -0.5
    this.scene.add(plane)
  }

  loadModel() {
    if (!this.modelPathValue) {
      console.error("Model path value is missing")
      return
    }

    const loader = new GLTFLoader()
    loader.load(
      this.modelPathValue,
      (gltf) => {
        this.model = gltf.scene
        this.scene.add(this.model)

        // Ajuster le modèle
        const box = new THREE.Box3().setFromObject(this.model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        // Positionner le modèle
        this.model.position.x = 0
        this.model.position.y = -(center.y - size.y / 2) + 0.3
        this.model.position.z = 0

        // Appliquer une légère rotation initiale
        this.model.rotation.y = -0.3

        // Animation d'entrée
        gsap.from(this.model.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.2,
          ease: "back.out(1.7)"
        })

        gsap.from(this.model.position.y, {
          y: -1,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.3
        })
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error)
      }
    )
  }

  animate() {
    this.animationFrame = requestAnimationFrame(this.animate.bind(this))

    if (this.model) {
      // Rotation continue
      this.model.rotation.y += 0.006

      // Flottaison subtile
      const time = Date.now() * 0.001
      this.model.position.y += Math.sin(time * 1.2) * 0.0006
    }

    this.renderer.render(this.scene, this.camera)
  }

  onResize() {
    if (!this.canvasTarget) return

    const container = this.canvasTarget
    const rect = container.getBoundingClientRect()
    const width = rect.width || window.innerWidth * 0.7
    const height = rect.height || window.innerHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  disconnect() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
    }
    window.removeEventListener("resize", this.onResize)

    if (this.renderer) {
      this.renderer.dispose()
      this.renderer.forceContextLoss()
    }
    this.scene.clear()
  }
}