'use client'
import Lenis from '@studio-freight/lenis'
import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

import { gsap } from '~/gsap'

import { Card } from './components/card'
import s from './page.module.scss'

export default function Parallax() {
  const containerRef = useRef<HTMLDivElement>(null)

  const tlRef = useRef<gsap.core.Timeline>()

  useEffect(() => {
    const lenis = new Lenis()
    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const anim = requestAnimationFrame(raf)
    tlRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })
    const container = containerRef.current as HTMLDivElement
    const tl = tlRef.current
    const layers = gsap.utils.toArray(
      container.querySelectorAll('article') || []
    ) as HTMLElement[]

    layers.forEach((layer) => {
      const depth = layer.dataset.depth || 0
      const movement = -(layer.offsetHeight * +depth * 0.5)
      const h2 = layer.querySelector('h2')
      const img = layer.querySelector('img')
      const scrollTrigger = {
        trigger: layer,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }

      tl.to(layer, { y: movement, ease: 'none', scrollTrigger }, 0)
      tl.to(h2, { y: +movement * 1.4, ease: 'none', scrollTrigger }, 0)
      tl.to(img, { y: -movement * 1.2, ease: 'none', scrollTrigger }, 0)
    })

    return () => {
      tl.kill()
      cancelAnimationFrame(anim)
    }
  }, [])
  return (
    <div ref={containerRef} className={clsx(s.all)}>
      <div className={clsx(s.container)}>
        <Card
          depth={0.5}
          image="https://images.unsplash.com/photo-1600786288595-3dbb17cbbe66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1769&q=80"
          title="Good"
        />
      </div>
      <div className={clsx(s.container, s['container-2'])}>
        <Card
          depth={0.6}
          image="https://images.unsplash.com/photo-1563303672-ab195c9c1610?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          title="Effect"
        />
      </div>
      <div className={clsx(s.container, s['container-3'])}>
        <Card
          depth={0.8}
          image="https://images.unsplash.com/photo-1614103812210-e468413c3dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          title="Parallax"
        />
      </div>
      <div className={clsx(s.container, s['container'])}>
        <Card
          depth={0.6}
          image="https://images.unsplash.com/photo-1614103812210-e468413c3dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          title={
            <Link href="https://github.com/fabroos" target="_blank">
              @Fabroos
            </Link>
          }
        />
      </div>
    </div>
  )
}
