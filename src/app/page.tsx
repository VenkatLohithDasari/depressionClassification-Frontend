'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface PredictionResult {
  label: 'severe' | 'moderate' | 'not depression'
  confidence: number
}

const exampleTexts = {
  severe: "how do I get Ambien from a doctor? I got a little bit of mild drugs from therapists but I don't want to push my luck. I'm thinking I can tell them that melatonin doesn't work for me (true), but how does one get that script? thank you",
  moderate: "I want to kill myself, but my ex (who I would like to say is also my best friend) would blame himself We were best friends. We dated. He dumped me two months ago because he lost feelings. He still wants to be friends, and he wants me in his life. He blames himself for how Iâ€™m feeling, even though Iâ€™ve told him so so many times that Iâ€™ve struggled with mental illness for years and no one can control how I feel. I just want to fucking end it. He even asked me today if I was planning on killing myself, and I lied and said no. I just want to make sure heâ€™ll be okay. I donâ€™t know what to do. Should I push him away by distancing myself? Actively tell him he needs to stay away so I donâ€™t hurt him? Pretend to get better so he stops worrying? I donâ€™t know. That sounds cruel. Iâ€™m so confused and lost right now.",
  normal: "Life has its ups and downs, but overall I'm doing well. I enjoy spending time with friends and family, and while I sometimes feel stressed, I can handle it. I'm looking forward to future plans."
}

const ExampleButton = ({
  label,
  text,
  onClick,
  color
}: {
  label: string;
  text: string;
  onClick: () => void;
  color: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick()}
    className={`px-3 py-2 rounded-lg text-sm font-medium ${color} transition-colors`}
  >
    {label}
  </motion.button>
)

const getResultColor = (label: string) => {
  switch (label) {
    case 'severe':
      return 'bg-red-100 border-red-500'
    case 'moderate':
      return 'bg-yellow-100 border-amber-500'
    case 'not depression':
      return 'bg-green-100 border-green-500'
    default:
      return 'bg-gray-100 border-gray-500'
  }
}

const getResultIcon = (label: string) => {
  switch (label) {
    case 'severe':
      return '😢'
    case 'moderate':
      return '😐'
    case 'not depression':
      return '😊'
    default:
      return '❓'
  }
}

export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeText = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Depression Text Analyzer
        </h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">Try example texts:</p>
            <div className="flex flex-wrap gap-2">
              <ExampleButton
                label="Normal Text Example"
                text={exampleTexts.normal}
                onClick={() => setText(exampleTexts.normal)}
                color="bg-green-100 text-green-700 hover:bg-green-200"
              />
              <ExampleButton
                label="Moderate Example"
                text={exampleTexts.moderate}
                onClick={() => setText(exampleTexts.moderate)}
                color="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              />
              <ExampleButton
                label="Severe Example"
                text={exampleTexts.severe}
                onClick={() => setText(exampleTexts.severe)}
                color="bg-red-100 text-red-700 hover:bg-red-200"
              />
            </div>
          </div>
          <textarea
            className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
            onClick={analyzeText}
            disabled={!text.trim() || loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : 'Analyze Text'}
          </motion.button>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-lg border-2 ${getResultColor(result.label)} transition-colors`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Analysis Result</h2>
              <span className="text-3xl">{getResultIcon(result.label)}</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Classification:</span>
                <span className="font-semibold capitalize">{result.label}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Confidence:</span>
                  <span className="font-semibold">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-2.5 rounded-full ${result.label === 'severe' ? 'bg-red-500' :
                      result.label === 'moderate' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                  ></motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}
