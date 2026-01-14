import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CameraView from './CameraView'

describe('CameraView', () => {
  it('renders video element when streaming', () => {
    const { container } = render(<CameraView isStreaming={true} />)
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveStyle({ display: 'block' })
  })

  it('hides video element when not streaming', () => {
    const { container } = render(<CameraView isStreaming={false} />)
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveStyle({ display: 'none' })
  })

  it('shows camera preview placeholder when not streaming', () => {
    render(<CameraView isStreaming={false} />)
    expect(screen.getByText('Camera preview will appear here')).toBeInTheDocument()
    expect(screen.getByText('Please allow camera access')).toBeInTheDocument()
  })

  it('does not show placeholder when streaming', () => {
    render(<CameraView isStreaming={true} />)
    expect(screen.queryByText('Camera preview will appear here')).not.toBeInTheDocument()
  })

  it('forwards ref to video element', () => {
    const ref = { current: null }
    const { container } = render(<CameraView ref={ref} isStreaming={true} />)
    const video = container.querySelector('video')
    expect(ref.current).toBe(video)
  })

  it('has correct video attributes', () => {
    const { container } = render(<CameraView isStreaming={true} />)
    const video = container.querySelector('video')
    expect(video).toHaveAttribute('autoPlay')
    expect(video).toHaveAttribute('playsInline')
    // muted is a boolean property, not an attribute in jsdom
    expect(video?.muted).toBe(true)
  })
})