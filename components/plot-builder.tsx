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
import { Plus, MapPin, User, Clock, AlertTriangle, CheckCircle, Upload, Trash2, Edit, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react"
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
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [editingCard, setEditingCard] = useState<CaseCard | null>(null)

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

  const handleImportCards = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Show warning if there are existing cards
    if (cards.length > 0) {
      const confirmImport = confirm(
        `⚠️ Warning: Importing will replace all ${cards.length} existing cards.\n\nThis action cannot be undone. Do you want to continue?`
      )
      if (!confirmImport) {
        // Reset input value to allow selecting the same file again
        event.target.value = ""
        return
      }
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedData = JSON.parse(content)
        
        // Validate imported data
        if (!Array.isArray(importedData)) {
          alert("Invalid JSON format. Expected an array of cards.")
          return
        }

        const validCards: CaseCard[] = []
        const errors: string[] = []

        importedData.forEach((item, index) => {
          // Validate required fields
          if (!item.time || !item.actor || !item.place || !item.claims) {
            errors.push(`Card ${index + 1}: Missing required fields (time, actor, place, claims)`)
            return
          }

          // Create valid card with defaults for missing optional fields
          const card: CaseCard = {
            id: item.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
            time: item.time,
            actor: item.actor,
            place: item.place,
            claims: item.claims,
            is_lie: item.is_lie || false,
            x: item.x || Math.random() * 400 + 100,
            y: item.y || Math.random() * 300 + 100,
          }

          validCards.push(card)
        })

        if (errors.length > 0) {
          alert(`Import completed with errors:\n${errors.join('\n')}\n\nValid cards: ${validCards.length}`)
        } else {
          alert(`Successfully imported ${validCards.length} cards`)
        }

        if (validCards.length > 0) {
          setCards(validCards)
        }
      } catch (error) {
        console.error("Error importing cards:", error)
        alert("Error reading JSON file. Please check the file format.")
      }
    }

    reader.readAsText(file)
    // Reset input value to allow importing the same file again
    event.target.value = ""
  }

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(card => card.id !== cardId))
    setSelectedCardId(null)
  }

  const handleEditCard = (cardId: string) => {
    const cardToEdit = cards.find(card => card.id === cardId)
    if (cardToEdit) {
      setEditingCard(cardToEdit)
      setSelectedCardId(null)
    }
  }

  const handleUpdateCard = () => {
    if (!editingCard) return
    
    setCards(cards.map(card => 
      card.id === editingCard.id ? editingCard : card
    ))
    setEditingCard(null)
  }

  const handleCardClick = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCardId(selectedCardId === cardId ? null : cardId)
  }

  // Close overlay when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => setSelectedCardId(null)
    if (selectedCardId) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [selectedCardId])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-xl font-bold text-gray-800">InstaPlot</div>
            

            <div className="relative">
              <Input
                type="file"
                accept=".json"
                onChange={handleImportCards}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import JSON
              </Button>
            </div>


            <Button variant="outline" onClick={organizeCards} className="ml-auto bg-transparent">
              Auto Organize
            </Button>
          </div>

        </div>

        {/* Plot Area */}
        <div
          className="bg-white rounded-lg shadow-sm border p-6 relative overflow-auto"
          style={{ minHeight: "600px", maxHeight: "800px" }}
        >
          {/* X-axis selector at top */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
            <ArrowLeft className="w-4 h-4 text-gray-400" />
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
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Y-axis selector on left */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2 z-10">
            <ArrowUp className="w-4 h-4 text-gray-400" />
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
            <ArrowDown className="w-4 h-4 text-gray-400" />
          </div>
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
              onClick={(e) => handleCardClick(card.id, e)}
            >
              <div className="relative">
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
              
              {/* Overlay with action buttons */}
              {selectedCardId === card.id && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditCard(card.id)
                    }}
                    className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCard(card.id)
                    }}
                    className="bg-white hover:bg-red-50 p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>
            </motion.div>
          ))}

          {cards.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cards yet. Click the + button to get started.</p>
              </div>
            </div>
          )}

          {/* Floating Add Card Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="absolute bottom-4 right-4 w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-10"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Create Card Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Create New Card</h3>
              <div className="space-y-4">
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
                <div>
                  <Label htmlFor="claims">Claims</Label>
                  <Textarea
                    id="claims"
                    placeholder="What was claimed or observed..."
                    value={newCard.claims}
                    onChange={(e) => setNewCard({ ...newCard, claims: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleCreateCard}>Create Card</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Card Modal */}
        {editingCard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Card</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    type="datetime-local"
                    value={editingCard.time}
                    onChange={(e) => setEditingCard({ ...editingCard, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-actor">Actor</Label>
                  <Input
                    id="edit-actor"
                    value={editingCard.actor}
                    onChange={(e) => setEditingCard({ ...editingCard, actor: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-place">Place</Label>
                  <Input
                    id="edit-place"
                    value={editingCard.place}
                    onChange={(e) => setEditingCard({ ...editingCard, place: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="edit-is-lie"
                    checked={editingCard.is_lie}
                    onCheckedChange={(checked) => setEditingCard({ ...editingCard, is_lie: checked })}
                  />
                  <Label htmlFor="edit-is-lie">Mark as lie</Label>
                </div>
                <div>
                  <Label htmlFor="edit-claims">Claims</Label>
                  <Textarea
                    id="edit-claims"
                    value={editingCard.claims}
                    onChange={(e) => setEditingCard({ ...editingCard, claims: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleUpdateCard}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingCard(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
