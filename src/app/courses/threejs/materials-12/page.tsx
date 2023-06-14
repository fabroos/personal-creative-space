'use client'
import * as dat from 'dat.gui'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
export default function Materials12() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const guiRef = useRef<dat.GUI>(null)
  useIsomorphicLayoutEffect(() => {
    if (!canvasRef.current) return
    guiRef.current = new dat.GUI()
  }, [])
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!canvasRef.current || !guiRef.current) return

    const canvas = canvasRef.current
    const gui = guiRef.current

    // Scene
    const scene = new THREE.Scene()
    // Camera
    const sizes = {
      width: canvas.parentElement?.clientWidth ?? window.innerWidth,
      height: canvas.parentElement?.clientHeight ?? window.innerHeight
    }
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      100
    )
    camera.position.z = 3
    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas })
    renderer.setClearColor(0xff0000, 0)
    const updateSize = () => {
      if (!canvas.parentElement) return
      // update sizes
      sizes.width = canvas.parentElement.clientWidth
      sizes.height = canvas.parentElement.clientHeight
      // update renderer
      renderer.setSize(
        // adapt to the parent element size
        canvas.parentElement.clientWidth,
        canvas.parentElement.clientHeight
      )
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      // update camera
      camera.aspect =
        canvas.parentElement.clientWidth / canvas.parentElement.clientHeight
      camera.updateProjectionMatrix()
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Lights
    const light = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light)

    const pointLight = new THREE.PointLight(0xffffff, 0.5)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)
    // Textures
    const manager = new THREE.LoadingManager()
    const textureLoader = new THREE.TextureLoader(manager)
    const cubeTextureLoader = new THREE.CubeTextureLoader(manager)

    manager.onLoad = () => {
      console.log('loaded all resources')
    }
    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log('loading resource: ', url)
      console.log('items loaded: ', itemsLoaded)
      console.log('items total: ', itemsTotal)
    }
    manager.onError = () => {
      console.log('there has been an error')
    }

    const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
    const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
    const doorAmbientOcclusionTexture = textureLoader.load(
      '/textures/door/ambientOcclusion.jpg'
    )
    const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
    const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
    const doorMetalnessTexture = textureLoader.load(
      '/textures/door/metalness.jpg'
    )
    const doorRoughnessTexture = textureLoader.load(
      '/textures/door/roughness.jpg'
    )
    const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
    const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
    gradientTexture.minFilter = THREE.NearestFilter
    gradientTexture.magFilter = THREE.NearestFilter
    gradientTexture.generateMipmaps = false

    const folder = {
      folder: 3
    }
    const environmentMapTexture = cubeTextureLoader.load([
      `/textures/environmentMaps/${folder.folder}/px.jpg`, // positive x
      `/textures/environmentMaps/${folder.folder}/nx.jpg`, // negative x
      `/textures/environmentMaps/${folder.folder}/py.jpg`, // positive y
      `/textures/environmentMaps/${folder.folder}/ny.jpg`, // negative y
      `/textures/environmentMaps/${folder.folder}/pz.jpg`, // positive z
      `/textures/environmentMaps/${folder.folder}/nz.jpg` // negative z
    ])
    gui
      .add(folder, 'folder')
      .min(0)
      .max(3)
      .step(1)
      .onChange(() => {
        environmentMapTexture.dispose()
        environmentMapTexture.image = [
          `/textures/environmentMaps/${folder.folder}/px.jpg`, // positive x
          `/textures/environmentMaps/${folder.folder}/nx.jpg`, // negative x
          `/textures/environmentMaps/${folder.folder}/py.jpg`, // positive y
          `/textures/environmentMaps/${folder.folder}/ny.jpg`, // negative y
          `/textures/environmentMaps/${folder.folder}/pz.jpg`, // positive z
          `/textures/environmentMaps/${folder.folder}/nz.jpg` // negative z
        ].map((image) => {
          return (new Image().src = image)
        })
        environmentMapTexture.needsUpdate = true
      })

    // CubeTextureLoader
    // Materials
    // const material = new THREE.MeshBasicMaterial({
    //   map: doorColorTexture,
    //   alphaMap: doorAlphaTexture,
    //   aoMap: doorAmbientOcclusionTexture,
    //   specularMap: doorMetalnessTexture,
    //   envMap: doorHeightTexture
    // })
    // // load t
    // // first way of loading it
    // const doorMaterial = new THREE.MeshBasicMaterial({
    //   // it's the most basic material
    //   map: doorColorTexture
    // })
    // // second way of loading it
    // const doorMaterial2 = new THREE.MeshBasicMaterial()
    // doorMaterial2.map = doorColorTexture

    // const colorMaterial = new THREE.MeshBasicMaterial({})
    // // colorMaterial.color = 'red' // it will crash you need to use 👇
    // colorMaterial.color = new THREE.Color('red')
    // /* or */
    // colorMaterial.color.set('red')
    // // colorMaterial.wireframe = true
    // // opacity
    // colorMaterial.transparent = true
    // // colorMaterial.opacity = 0.5
    // material.alphaMap = doorAlphaTexture
    // // Objects
    // material.side = THREE.BackSide

    // const material = new THREE.MeshNormalMaterial()
    // // material.flatShading = true

    // const material = new THREE.MeshMatcapMaterial()
    // material.matcap = matcapTexture

    // const material = new THREE.MeshDepthMaterial()

    // we need to add lights to see the effect of the next materials

    // const material = new THREE.MeshLambertMaterial()

    // const material = new THREE.MeshPhongMaterial()
    // material.shininess = 1000
    // material.specular.set('blue')

    // const material = new THREE.MeshToonMaterial()
    // material.gradientMap = gradientTexture

    // THE BEST MATERIAL - THE MOST USED
    // const material = new THREE.MeshStandardMaterial()
    // material.aoMapIntensity = 1
    // material.metalness = 0.45
    // material.roughness = 0.65
    // material.map = doorColorTexture
    // material.aoMap = doorAmbientOcclusionTexture
    // material.displacementMap = doorHeightTexture
    // material.displacementScale = 0.05
    // material.metalnessMap = doorMetalnessTexture
    // material.roughnessMap = doorRoughnessTexture
    // material.normalMap = doorNormalTexture
    // material.normalScale.set(0.5, 0.5)
    // material.alphaMap = doorAlphaTexture

    const material = new THREE.MeshStandardMaterial()
    material.metalness = 0.7
    material.roughness = 0.2
    material.envMap = environmentMapTexture

    gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
    // add a debug panel
    // we need to install dat.gui
    //
    gui.add(material, 'metalness').min(0).max(1).step(0.0001)
    gui.add(material, 'roughness').min(0).max(1).step(0.0001)
    gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)
    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 64, 64),
      material
    )
    sphere.position.x = -1.5

    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1, 100, 100),
      material
    )
    plane.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2)
    )
    console.log(plane.geometry.attributes.uv)
    const torus = new THREE.Mesh(
      new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
      material
    )
    torus.position.x = 1.5
    torus.geometry.setAttribute(
      'uv2',
      new THREE.Float32BufferAttribute(torus.geometry.attributes.uv.array, 2)
    )
    scene.add(sphere)
    scene.add(plane)
    scene.add(torus)

    // Animate
    renderer.render(scene, camera)

    const clock = new THREE.Clock()
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      // update objects
      // torus.rotation.y = 0.1 * elapsedTime
      // plane.rotation.y = 0.1 * elapsedTime
      // sphere.rotation.y = 0.1 * elapsedTime

      // torus.rotation.x = 0.1 * elapsedTime
      // plane.rotation.x = 0.1 * elapsedTime
      // sphere.rotation.x = 0.1 * elapsedTime

      // update controls
      controls.update()

      // render
      renderer.render(scene, camera)

      // call animate again on the next frame
      requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])
  return <canvas id="canvas" ref={canvasRef}></canvas>
  return <h1 style={{ color: 'white' }}>Hello</h1>
}
