'use client'
import 'keen-slider/keen-slider.min.css'

import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import LocalFont from 'next/font/local'

import s from './page.module.scss'

const y2kFont = LocalFont({
  src: [
    {
      path: './YAGIZA__.woff',
      style: 'normal'
    }
  ]
})

const images = [
  'https://i.pinimg.com/564x/3c/9a/39/3c9a390a3158ace322c804e5a96c87fa.jpg',
  'https://i.pinimg.com/564x/71/ba/ad/71baad739acbade4e22f33ac7a88882e.jpg',
  'https://i.pinimg.com/564x/f4/94/e1/f494e1e7c44cc30261142141452927fa.jpg',
  'https://i.pinimg.com/564x/56/0e/93/560e93634b4f71251a363d5c7dbd7926.jpg'
]

const animation = {
  duration: 5000,
  easing: (x: number) => x
}

export default function PageName() {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slideChanged() {
      console.log('slideChanged')
    },
    loop: true,
    renderMode: 'performance',
    drag: false,
    slides: {
      perView: 3
    },
    created(slide) {
      slide.moveToIdx(5, true, animation)
    },
    updated(slide) {
      slide.moveToIdx(slide.track.details.abs + 5, true, animation)
    },
    animationEnded(slide) {
      slide.moveToIdx(slide.track.details.abs + 5, true, animation)
    }
  })
  return (
    <div className={clsx(y2kFont.className, s.container)}>
      <h1>Fabroos ydosh</h1>
      <div ref={sliderRef} className={clsx('keen-slider', s.slider)}>
        {images.map((image) => (
          <img
            key={image}
            className={clsx('keen-slider__slide', s.slide)}
            src={image}
          />
        ))}
      </div>
    </div>
  )
}
