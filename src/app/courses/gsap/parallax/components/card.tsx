import clsx from 'clsx'
import Image from 'next/image'

import s from '../page.module.scss'
export const Card = ({
  depth,
  title,
  image
}: {
  depth: number
  title: JSX.Element | string
  image: string
}) => {
  return (
    <article className={clsx(s.card)} data-depth={depth}>
      <div className={clsx(s['img-container'])}>
        <Image alt="image decorative" src={image} width={480} height={320} />
      </div>
      <h2 className={clsx(s.title)}>{title}</h2>
    </article>
  )
}
