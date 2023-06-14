'use client'

import clsx from 'clsx'
import { ScrollTrigger } from 'gsap/all'
import { useLayoutEffect, useRef } from 'react'

import { gsap } from '~/gsap'

import s from './page.module.scss'

export default function PathGsap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tl = gsap.timeline({
    defaults: { duration: 1 }
  })

  const svgRef = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    // go to top when refresh
    gsap.registerPlugin(ScrollTrigger)
    window.scrollTo(0, 0)
    if (!svgRef.current) return
    const path = svgRef.current.children[0] as SVGPathElement
    const length = path.getTotalLength()

    tl.set(path, { strokeDashoffset: `${length} ${length}` })
    tl.fromTo(
      path,
      {
        strokeDashoffset: length,
        strokeDasharray: length,
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: true,
          start: 'top top',
          end: 'bottom bottom',
          markers: true
        }
      },
      {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: true,
          start: 'top top',
          end: 'bottom bottom',
          markers: true
        }
      }
    )
    // animate when appear in viewport not when scrub

    tl.to(
      containerRef.current?.querySelector('h1'),
      {
        y: 0,
        opacity: 1
      },
      0
    )
    const section2 = containerRef.current?.querySelector(
      '.section-2'
    ) as HTMLElement
    const el = section2?.querySelector('h2') as HTMLElement
    console.log(section2)
    tl.set(el, { y: 100, opacity: 0 })
    tl.to(
      el,
      {
        duration: 1,
        scrollTrigger: '.section-2',
        y: 0,
        opacity: 1
      },
      0
    )
    return () => {
      tl.reverse()
    }
  }, [])

  return (
    <div className={clsx(s['container'])} ref={containerRef}>
      <svg
        ref={svgRef}
        className="fixed top-0 left-0 w-full h-screen pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.00049 0V511C1.00049 511 1.0011 651 1.00049 685.5C0.999872 720 70.0007 797.5 65.0005 749.5C58.0007 720 23.0008 700 19.0007 734.5C11.2163 801.641 1.00049 917.5 1.00049 1024.5"
          stroke="white"
        />
      </svg>

      <section className={clsx(s['h-screen'])}>
        <div className={clsx(s['clip-path'])}>
          <h1 className={clsx(s['h1'])}>Far Far Away</h1>
        </div>
      </section>
      <section className={clsx(s['h-screen'], 'section-2')}>
        <div className={clsx(s['clip-path'])}>
          <h2 className={clsx(s['h2'])}>Near Near Nearby</h2>
        </div>
      </section>
      <section className={clsx(s['h-screen'])}></section>
    </div>
  )
}
