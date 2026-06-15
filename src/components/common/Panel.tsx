import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  className?: string
}

export default function Panel({ title, children, className }: Props) {
  return (
    <section className={`panel${className ? ' ' + className : ''}`}>
      <h2 className="panel-title">{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  )
}
