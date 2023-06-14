'use client'
import 'keen-slider/keen-slider.min.css'

import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import LocalFont from 'next/font/local'
import Image from 'next/image'

import { useDeviceDetect } from '~/hooks/use-device-detect'

// ASSETS 🌟
import IMAGE_3D from './assets/3d.png'
import COLLECTION_IMAGE from './assets/Collection_image.svg'
import { ItsNotArtIcon } from './assets/icons/ItsNotArt'
import IMAGE_LOGO from './assets/not_art.png'
import s from './styles/page.module.scss'

// FONT 🖊️
const BasementGrotesque = LocalFont({
  src: [
    {
      path: './fonts/BasementGrotesque-Black.woff2'
    }
  ]
})

// DATA 📊
const collections = [
  { id: 1, title: 'Bumper 1' },
  { id: 2, title: 'Candix 2' },
  { id: 3, title: 'Lessing 1' }
]

const products = [
  {
    id: 1,
    title: 'Product 1',
    price: 299,
    image: '/products/1.png'
  },
  {
    id: 2,
    title: 'Product 2',
    price: 1200,
    image: '/products/2.png'
  },
  {
    id: 3,
    title: 'Product 3',
    price: 299,
    image: '/products/1.png'
  },
  {
    id: 4,
    title: 'Product 4',
    price: 299,
    image: '/products/2.png'
  }
]

export default function ItsNotArt() {
  const { isMobile } = useDeviceDetect()

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: isMobile ? 1 : 2,
      spacing: 20
    }
  })
  return (
    <div className={clsx(s.page, BasementGrotesque.className)}>
      <section className={clsx(s.page__section)}>
        <div className={clsx(s.page__aligners, s.page__section__header)}>
          <div className={clsx(s.page__section__header__logo)}>
            <Image src={IMAGE_LOGO} alt="It's not art" />
            <ItsNotArtIcon />
          </div>
          <div className={clsx(s.page__section__header__collections)}>
            <div
              className={clsx(s.page__section__header__collections__container)}
            >
              <div className={clsx(s.page__section__header__collections_image)}>
                <Image src={COLLECTION_IMAGE} alt="Collection" />
              </div>
              <div className={clsx(s.page__section__header__collections_list)}>
                <div
                  className={clsx(
                    s.page__section__header__collections_list_title
                  )}
                >
                  Last Collections
                </div>
                {collections.map((collection) => (
                  <div
                    className={clsx(
                      s.page__section__header__collections_list_item
                    )}
                    key={collection.id}
                  >
                    <div
                      className={clsx(
                        s.page__section__header__collections_list_item_title
                      )}
                    >
                      "{collection.title}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={clsx(s.page__section__content)}>
          <h1 className={clsx(s.page__section__title)}>It's not a trend</h1>
          <div className={clsx(s.page__section__decoration)}>
            <Image src={IMAGE_3D} alt="3D" />
          </div>
          <div className={clsx(s.page__section__branding)}>
            <div className={clsx(s.page__section__branding_item)}>
              It's not a trend
            </div>
            <div className={clsx(s.page__section__branding_item)}>
              It's a lifestyle
            </div>
          </div>
        </div>
        <div className={clsx(s.page__aligners, s.page__section__footer)}>
          <div className={clsx(s.page__section__footer__item)}>
            <h3 className={clsx(s.page__section__footer__item_title)}>
              welcome to a place where you cant’t find
            </h3>
            <p className={clsx(s.page__section__footer__item_text)}>
              ART - BEUTY - GOOD DRESS - FASHION - TRENDINGS - HEGEMONIC THINGS
              - TYPICALLY STUFF - GOOD DESIGN IDEAS - MARKETING - GOOD STUFF -
              AESTETHIC DRESSES - UNIQUE JEWELRY
            </p>
          </div>
          <div className={clsx(s.page__section__footer__item)}>
            <h3 className={clsx(s.page__section__footer__item_title)}>
              Y-2023
            </h3>
            <p className={clsx(s.page__section__footer__item_text)}>BE.</p>
          </div>
        </div>
      </section>
      <section className={clsx(s.page__section_2)}>
        <div className={clsx(s.page__section_2__head)}>
          <div />
          <div className={clsx(s.page__section_2__head__title_container)}>
            <h2 className={clsx(s.page__section_2__head__title)}>
              COLLECTION 2023
            </h2>
            <p className={clsx(s.page__section_2__head__text)}>
              Manufactured and created with love, the Collection 2023 is a
              sustainable fashion line that is sure to turn heads. Made from
              recycled materials, the collection is both stylish and
              environmentally friendly.
            </p>
          </div>
          <div />
        </div>
        <div className={clsx(s.page__section_2__content)}>
          <div
            ref={sliderRef}
            className={clsx(s.page__section_2__content__slider, 'keen-slider')}
          >
            {products.map((product) => (
              <article
                key={product.id}
                className={clsx(
                  s.page__section_2__content__slider__card,
                  'keen-slider__slide'
                )}
              >
                <h3
                  className={clsx(
                    s.page__section_2__content__slider__card__title
                  )}
                >
                  {product.title}
                </h3>
                <Image
                  width={450}
                  height={550}
                  src={product.image}
                  alt={product.title}
                />
                <div
                  className={clsx(
                    s.page__section_2__content__slider__card__info
                  )}
                >
                  <div
                    className={clsx(
                      s.page__section_2__content__slider__card__info__price
                    )}
                  >
                    {product.price}$
                  </div>
                  <div
                    className={clsx(
                      s.page__section_2__content__slider__card__info__button
                    )}
                  >
                    <button>Buy</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
