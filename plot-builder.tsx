"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MapPin, User, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface CaseCard {
  id: string
  time: string
  actor: string
  place: string
  claims: string
  is_lie: boolean
  x: number
  y: number
}

export default function PlotBuilder() {
  const [cards, setCards] = useState<CaseCard[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [xAxisMode, setXAxisMode] = useState<"place" | "actor" | "time">("place")
  const [yAxisMode, setYAxisMode] = useState<"place" | "actor" | "time">("time")
  const [newCard, setNewCard] = useState({
    time: "",
    actor: "",
    place: "",
    claims: "",
    is_lie: false,
  })

  // Load cards from localStorage on component mount
  useEffect(() => {
    try {
      const savedCards = localStorage.getItem("case-plot-cards")
      if (savedCards) {
        setCards(JSON.parse(savedCards))
      } else {
        // Set default cards if none exist
        const defaultCards: CaseCard[] = [
          {
            id: "1",
            time: "2024-01-15T09:00",
            actor: "John Smith",
            place: "Office Building",
            claims: "Was in a meeting with the client",
            is_lie: false,
            x: 100,
            y: 100,
          },
          {
            id: "2",
            time: "2024-01-15T14:30",
            actor: "Jane Doe",
            place: "Coffee Shop",
            claims: "Saw the suspect leaving the area",
            is_lie: true,
            x: 300,
            y: 200,
          },
        ]
        setCards(defaultCards)
      }
    } catch (error) {
      console.error("Error loading cards from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cards to localStorage whenever cards state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("case-plot-cards", JSON.stringify(cards))
      } catch (error) {
        console.error("Error saving cards to localStorage:", error)
      }
    }
  }, [cards, isLoaded])

  const handleCreateCard = () => {
    if (!newCard.time || !newCard.actor || !newCard.place || !newCard.claims) return

    const card: CaseCard = {
      id: Date.now().toString(),
      ...newCard,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    }

    setCards([...cards, card])
    setNewCard({ time: "", actor: "", place: "", claims: "", is_lie: false })
    setShowForm(false)
  }

  const updateCardPosition = (id: string, x: number, y: number) => {
    setCards(cards.map((card) => (card.id === id ? { ...card, x, y } : card)))
  }

  const getUniqueValues = (key: "place" | "actor" | "time") => {
    if (key === "time") {
      return cards.map((card) => card.time).sort()
    }
    return [...new Set(cards.map((card) => card[key]))]
  }


  const getGridPosition = (card: CaseCard) => {
    const xUniqueValues = getUniqueValues(xAxisMode)
    const yUniqueValues = getUniqueValues(yAxisMode)
    
    let xPos = 100
    let yPos = 100

    if (xAxisMode === "time") {
      const timeValue = new Date(card.time).getTime()
      const minTime = Math.min(...cards.map((c) => new Date(c.time).getTime()))
      const maxTime = Math.max(...cards.map((c) => new Date(c.time).getTime()))
      xPos = ((timeValue - minTime) / (maxTime - minTime || 1)) * 600 + 100
    } else {
      const valueIndex = xUniqueValues.indexOf(card[xAxisMode])
      xPos = valueIndex * 200 + 100
    }

    if (yAxisMode === "time") {
      const timeValue = new Date(card.time).getTime()
      const minTime = Math.min(...cards.map((c) => new Date(c.time).getTime()))
      const maxTime = Math.max(...cards.map((c) => new Date(c.time).getTime()))
      yPos = ((timeValue - minTime) / (maxTime - minTime || 1)) * 400 + 100
    } else {
      const valueIndex = yUniqueValues.indexOf(card[yAxisMode])
      yPos = valueIndex * 200 + 100
    }

    return { x: xPos, y: yPos }
  }

  const organizeCards = () => {
    const updatedCards = cards.map((card) => ({
      ...card,
      ...getGridPosition(card),
    }))
    setCards(updatedCards)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-xl font-bold text-gray-800">InstaPlot</div>
            
            <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Card
            </Button>

            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">X-axis:</Label>
              <Select value={xAxisMode} onValueChange={(value: "place" | "actor" | "time") => setXAxisMode(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="place">Place</SelectItem>
                  <SelectItem value="actor">Actor</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Y-axis:</Label>
              <Select value={yAxisMode} onValueChange={(value: "place" | "actor" | "time") => setYAxisMode(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="place">Place</SelectItem>
                  <SelectItem value="actor">Actor</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={organizeCards} className="ml-auto bg-transparent">
              Auto Organize
            </Button>
          </div>

          {/* Create Card Form */}
          {showForm && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="datetime-local"
                    value={newCard.time}
                    onChange={(e) => setNewCard({ ...newCard, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="actor">Actor</Label>
                  <Input
                    id="actor"
                    placeholder="Person involved"
                    value={newCard.actor}
                    onChange={(e) => setNewCard({ ...newCard, actor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="place">Place</Label>
                  <Input
                    id="place"
                    placeholder="Location"
                    value={newCard.place}
                    onChange={(e) => setNewCard({ ...newCard, place: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is-lie"
                    checked={newCard.is_lie}
                    onCheckedChange={(checked) => setNewCard({ ...newCard, is_lie: checked })}
                  />
                  <Label htmlFor="is-lie">Mark as lie</Label>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="claims">Claims</Label>
                <Textarea
                  id="claims"
                  placeholder="What was claimed or observed..."
                  value={newCard.claims}
                  onChange={(e) => setNewCard({ ...newCard, claims: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreateCard}>Create Card</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Plot Area */}
        <div
          className="bg-white rounded-lg shadow-sm border p-6 relative overflow-auto"
          style={{ minHeight: "600px", maxHeight: "800px" }}
        >
          {/* Cards */}
          {cards.map((card) => (
            <motion.div
              key={card.id}
              drag
              dragMomentum={false}
              onDragEnd={(_, info) => {
                updateCardPosition(card.id, card.x + info.offset.x, card.y + info.offset.y)
              }}
              initial={{ x: card.x, y: card.y }}
              animate={{ x: card.x, y: card.y }}
              className="absolute cursor-move"
              whileDrag={{ scale: 1.05, zIndex: 10 }}
            >
              <Card className="w-64 shadow-md hover:shadow-lg transition-shadow bg-white/90">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={card.is_lie ? "destructive" : "default"} className="text-xs">
                      {card.is_lie ? (
                        <>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Lie
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Truth
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-medium">{card.claims}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    {new Date(card.time).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <User className="w-3 h-3" />
                    {card.actor}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    {card.place}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {cards.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cards yet. Click "Add Card" to get started.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
