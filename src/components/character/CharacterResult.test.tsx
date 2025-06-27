import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CharacterResult from './CharacterResult'
import { AnalysisResult } from '../../types'

const mockResult: AnalysisResult = {
  character: {
    id: 'wise-owl',
    name: 'Wise Owl',
    emoji: '🦉',
    traits: ['Intelligent', 'Observant', 'Analytical', 'Thoughtful'],
    description: 'The Wise Owl sees everything and knows much',
    baseStory: 'You are the wise owl of the forest'
  },
  confidence: 0.85,
  reasoning: 'Your thoughtful expression matches the wise owl',
  personalizedStory: 'Like the wise owl, you observe the world with keen insight'
}

describe('CharacterResult', () => {
  const mockOnShare = vi.fn()
  const mockOnReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders character information correctly', () => {
    render(
      <CharacterResult 
        result={mockResult} 
        onShare={mockOnShare} 
        onReset={mockOnReset} 
      />
    )

    expect(screen.getByText('🦉')).toBeInTheDocument()
    expect(screen.getByText(`You're a ${mockResult.character.name}!`)).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText('Match Confidence')).toBeInTheDocument()
  })

  it('displays all traits', () => {
    render(
      <CharacterResult 
        result={mockResult} 
        onShare={mockOnShare} 
        onReset={mockOnReset} 
      />
    )

    mockResult.character.traits.forEach(trait => {
      expect(screen.getByText(trait)).toBeInTheDocument()
    })
  })

  it('shows reasoning and personalized story', () => {
    render(
      <CharacterResult 
        result={mockResult} 
        onShare={mockOnShare} 
        onReset={mockOnReset} 
      />
    )

    // Check that the story section contains the personalized story
    const storyText = screen.getByText('Like the wise owl, you observe the world with keen insight')
    expect(storyText).toBeInTheDocument()
  })

  it('calls onShare when share button is clicked', () => {
    render(
      <CharacterResult 
        result={mockResult} 
        onShare={mockOnShare} 
        onReset={mockOnReset} 
      />
    )

    const shareButton = screen.getByText('Share Result')
    fireEvent.click(shareButton)
    expect(mockOnShare).toHaveBeenCalledTimes(1)
  })

  it('calls onReset when try again button is clicked', () => {
    render(
      <CharacterResult 
        result={mockResult} 
        onShare={mockOnShare} 
        onReset={mockOnReset} 
      />
    )

    const resetButton = screen.getByText('Try Again')
    fireEvent.click(resetButton)
    expect(mockOnReset).toHaveBeenCalledTimes(1)
  })

  it('formats confidence percentage correctly', () => {
    const lowConfidenceResult = {
      ...mockResult,
      confidence: 0.333
    }
    
    const { rerender } = render(
      <CharacterResult 
        result={lowConfidenceResult} 
        onShare={mockOnShare} 
        onReset={mockOnReset} 
      />
    )

    expect(screen.getByText('33%')).toBeInTheDocument()

    const highConfidenceResult = {
      ...mockResult,
      confidence: 0.999
    }
    
    rerender(
      <CharacterResult 
        result={highConfidenceResult} 
        onShare={mockOnShare} 
        onReset={mockOnReset} 
      />
    )

    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})