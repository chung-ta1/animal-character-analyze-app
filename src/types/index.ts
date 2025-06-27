export interface Character {
  id: string
  name: string
  emoji?: string
  species?: string
  traits: string[]
  description?: string
  baseStory?: string
}

export interface AnalysisResult {
  character: Character
  confidence: number
  reasoning?: string
  personalizedStory?: string
}

export interface AnalysisState {
  isLoading: boolean
  error: string | null
  result: AnalysisResult | null
}