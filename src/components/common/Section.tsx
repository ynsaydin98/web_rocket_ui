import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  className?: string
}

/** Ana sayfadaki bir "bölme": başlık şeridi + çerçeveli gövde. */
export default function Section({ title, children, className }: Props) {
  return (
    <section className={`home-section${className ? ' ' + className : ''}`}>
      <header className="home-section-head">{title}</header>
      <div className="home-section-body">{children}</div>
    </section>
  )
}
