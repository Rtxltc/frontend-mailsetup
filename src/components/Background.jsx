import React from 'react'
import useMousePosition from '../hooks/useMousePosition'

export default function Background() {
  const pos = useMousePosition()
  const tx = (pos.x - window.innerWidth / 2) * 0.02
  const ty = (pos.y - window.innerHeight / 2) * 0.02
  return <div className="bg" style={{ transform: `translate3d(${tx}px, ${ty}px, 0)` }} />
}
