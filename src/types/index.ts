export interface Character {
  id: string
  name: string
  species: string
  traits: string[]
  imageUrl: string
}

export interface AnalysisResult {
  character: Character
  story: string
  confidence: number
  reasoning?: string
}

export interface AnalysisState {
  isLoading: boolean
  error: string | null
  result: AnalysisResult | null
}