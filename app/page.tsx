'use client'

import { useState } from "react"
import PropertySearch from "@/components/PropertySearch"
import ResultsDisplay from "@/components/ResultsDisplay"

export default function Home() {
  const [results, setResults] = useState<any>(null)

  return (
    <div>
      <h1>Real Estate Forecast AI</h1>
      <PropertySearch onResults={setResults} />
      {results && <ResultsDisplay data={results} />}
    </div>
  )
}
