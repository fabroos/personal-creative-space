'use client'
import * as dat from 'dat.gui'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

import { useIsomorphicLayoutEffect } from '~/hooks/use-isomorphic-layout-effect'
export default function Text3d() {
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
    // Axes Helper
    const axesHelper = new THREE.AxesHelper(2)
    scene.add(axesHelper)
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

    // Objects
    // const material = new THREE.MeshStandardMaterial()
    // const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
    // cube.rotateY(Math.PI / 4)
    // scene.add(cube)

    // Animate
    renderer.render(scene, camera)

    // first get a typeface font
    // https://gero3.github.io/facetype.js/

    // then we need to load it
    const fontLoader = new FontLoader()

    fontLoader.load(
      '/fonts/typeface/Basement Grotesque Roman_Bold.json',
      (font) => {
        console.log(font)
        const textGeometry = new TextGeometry('Fabroos Across The 3d', {
          font,
          size: 0.4,
          height: 0.2,
          curveSegments: 2,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5
        })

        const textMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          wireframe: true
        })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
      }
    )

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
