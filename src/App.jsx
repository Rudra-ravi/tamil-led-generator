import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Download, Zap } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import './App.css'

function App() {
  const [tamilText, setTamilText] = useState('புதுச்சேரி')
  const [width, setWidth] = useState(64)
  const [height, setHeight] = useState(16)
  const [isBold, setIsBold] = useState(false)
  const [selectedFont, setSelectedFont] = useState('Noto Sans Tamil UI')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef(null)

  const fonts = [
    'Noto Sans Tamil UI',
    'Tamil MN',
    'Tamil Sangam MN',
    'Latha',
    'Shruti',
    'Mukta Malar',
    'Hind Madurai'
  ]

  const generateLEDImage = () => {
    setIsGenerating(true)
    
    const canvas = canvasRef.current
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    
    ctx.fillStyle = '#FFFFFF'
    
    let fontSize = Math.floor(height * 0.8)
    let fontStyle = isBold ? 'bold ' : ''
    ctx.font = `${fontStyle}${fontSize}px ${selectedFont}, sans-serif`
    
    let textMetrics = ctx.measureText(tamilText)
    while (textMetrics.width > width - 2 && fontSize > 1) {
      fontSize--
      ctx.font = `${fontStyle}${fontSize}px ${selectedFont}, sans-serif`
      textMetrics = ctx.measureText(tamilText)
    }
    
    const x = (width - textMetrics.width) / 2
    const y = height / 2 + fontSize / 3
    
    ctx.fillText(tamilText, x, y)
    
    const imageDataUrl = canvas.toDataURL('image/png')
    setGeneratedImage(imageDataUrl)
    setIsGenerating(false)
  }

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.download = `tamil-led-${width}x${height}.png`
      link.href = generatedImage
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Zap className="text-yellow-500" />
            Tamil LED Board Generator
          </h1>
          <p className="text-gray-600">Create pixel-perfect images for your LED matrix displays</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Enter your Tamil text and LED board dimensions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tamil-text">Tamil Text</Label>
                <Input
                  id="tamil-text"
                  value={tamilText}
                  onChange={(e) => setTamilText(e.target.value)}
                  placeholder="Enter Tamil text..."
                  className="text-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width (pixels)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 64)}
                    min="1"
                    max="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (pixels)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 16)}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bold-text"
                  checked={isBold}
                  onCheckedChange={setIsBold}
                />
                <Label htmlFor="bold-text">Bold Text</Label>
              </div>

              <div>
                <Label htmlFor="font-select">Font</Label>
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="w-full" id="font-select">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateLEDImage} 
                className="w-full"
                disabled={isGenerating || !tamilText.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate LED Image'}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your LED board image will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                {generatedImage ? (
                  <div className="text-center space-y-4">
                    <img 
                      src={generatedImage} 
                      alt="Generated LED board image"
                      className="mx-auto border border-gray-300 rounded"
                      style={{ 
                        imageRendering: 'pixelated',
                        maxWidth: '100%',
                        maxHeight: '200px'
                      }}
                    />
                    <div className="text-sm text-gray-600">
                      Dimensions: {width} × {height} pixels
                    </div>
                    <Button onClick={downloadImage} className="flex items-center gap-2">
                      <Download size={16} />
                      Download PNG
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Zap size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Click "Generate LED Image" to create your display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Enter your Tamil text in the input field</li>
              <li>Set your LED board dimensions (width × height in pixels)</li>
              <li>Choose font and bold options</li>
              <li>Click "Generate LED Image" to create the display</li>
              <li>Download the PNG file and upload it to your LED controller</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Common LED panel sizes include 32×16, 64×32, 128×64. 
                The generated image will be optimized for low-resolution displays with clear, readable text.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App


