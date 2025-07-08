"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, MapPin, User, Clock, AlertTriangle, CheckCircle, Trash2, Edit, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, PenTool } from "lucide-react"
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

// Memoized card component to prevent unnecessary re-renders
const MemoizedCard = memo(({ 
  card, 
  selectedCardId, 
  draggingCardId, 
  inlineEditingCardId,
  onDragStart, 
  onDragEnd, 
  onClick, 
  onEdit, 
  onDelete,
  onInlineEdit,
  onInlineUpdate,
  onInlineEditComplete
}: {
  card: CaseCard
  selectedCardId: string | null
  draggingCardId: string | null
  inlineEditingCardId: string | null
  onDragStart: (id: string) => void
  onDragEnd: (id: string, x: number, y: number) => void
  onClick: (id: string, e: React.MouseEvent) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onInlineEdit: (id: string) => void
  onInlineUpdate: (id: string, field: keyof CaseCard, value: string | boolean) => void
  onInlineEditComplete: () => void
}) => {
  const isInlineEditing = inlineEditingCardId === card.id

  return (
    <motion.div
      key={card.id}
      drag={!isInlineEditing}
      dragMomentum={false}
      onDragStart={() => onDragStart(card.id)}
      onDragEnd={(_, info) => onDragEnd(card.id, card.x + info.offset.x, card.y + info.offset.y)}
      initial={{ x: card.x, y: card.y }}
      animate={{ x: card.x, y: card.y }}
      className="absolute cursor-move"
      whileDrag={{ scale: 1.05, zIndex: 10 }}
      onClick={(e) => !isInlineEditing && onClick(card.id, e)}
    >
      <div className="relative">
        <Card className="w-64 shadow-md hover:shadow-lg transition-shadow bg-white/90">
          {/* Inline Edit Button */}
          {!isInlineEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onInlineEdit(card.id)
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center z-10 transition-colors"
            >
              <Edit className="w-3 h-3 text-gray-600" />
            </button>
          )}
          
          {/* Save Button when editing */}
          {isInlineEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onInlineEditComplete()
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center z-10 transition-colors"
            >
              <CheckCircle className="w-3 h-3 text-green-600" />
            </button>
          )}

          <CardHeader className="pb-2 pr-10">
            <div className="flex items-center justify-between">
              {isInlineEditing ? (
                <Switch
                  checked={card.is_lie}
                  onCheckedChange={(checked) => onInlineUpdate(card.id, 'is_lie', checked)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
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
              )}
            </div>
            {isInlineEditing ? (
              <Textarea
                value={card.claims}
                onChange={(e) => {
                  e.stopPropagation()
                  onInlineUpdate(card.id, 'claims', e.target.value)
                }}
                onClick={(e) => e.stopPropagation()}
                className="text-sm font-medium min-h-[60px] resize-none"
                placeholder="Claims..."
              />
            ) : (
              <CardTitle className="text-sm font-medium">{card.claims}</CardTitle>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              {isInlineEditing ? (
                <Input
                  type="datetime-local"
                  value={card.time}
                  onChange={(e) => {
                    e.stopPropagation()
                    onInlineUpdate(card.id, 'time', e.target.value)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs h-6 px-1"
                />
              ) : (
                new Date(card.time).toLocaleString()
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <User className="w-3 h-3" />
              {isInlineEditing ? (
                <Input
                  value={card.actor}
                  onChange={(e) => {
                    e.stopPropagation()
                    onInlineUpdate(card.id, 'actor', e.target.value)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs h-6 px-1"
                  placeholder="Actor..."
                />
              ) : (
                card.actor
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <MapPin className="w-3 h-3" />
              {isInlineEditing ? (
                <Input
                  value={card.place}
                  onChange={(e) => {
                    e.stopPropagation()
                    onInlineUpdate(card.id, 'place', e.target.value)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs h-6 px-1"
                  placeholder="Place..."
                />
              ) : (
                card.place
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Overlay with action buttons */}
        {selectedCardId === card.id && draggingCardId !== card.id && !isInlineEditing && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center gap-2 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(card.id)
              }}
              className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(card.id)
              }}
              className="bg-white hover:bg-red-50 p-2 rounded-full shadow-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
})

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
  const [showJsonEditor, setShowJsonEditor] = useState(false)
  const [jsonContent, setJsonContent] = useState("")
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null)
  const [inlineEditingCardId, setInlineEditingCardId] = useState<string | null>(null)

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

  const handleCreateCard = useCallback(() => {
    if (!newCard.time || !newCard.actor || !newCard.place || !newCard.claims) return

    const card: CaseCard = {
      id: Date.now().toString(),
      ...newCard,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    }

    setCards(prev => [...prev, card])
    setNewCard({ time: "", actor: "", place: "", claims: "", is_lie: false })
    setShowForm(false)
  }, [newCard])


  const getUniqueValues = useCallback((key: "place" | "actor" | "time", cardList: CaseCard[]) => {
    if (key === "time") {
      return cardList.map((card) => card.time).sort()
    }
    return [...new Set(cardList.map((card) => card[key]))]
  }, [])

  const getGridPosition = useCallback((card: CaseCard, cardList: CaseCard[], xMode: string, yMode: string) => {
    const xUniqueValues = getUniqueValues(xMode as "place" | "actor" | "time", cardList)
    const yUniqueValues = getUniqueValues(yMode as "place" | "actor" | "time", cardList)
    
    let xPos = 100
    let yPos = 100

    if (xMode === "time") {
      const timeValue = new Date(card.time).getTime()
      const minTime = Math.min(...cardList.map((c) => new Date(c.time).getTime()))
      const maxTime = Math.max(...cardList.map((c) => new Date(c.time).getTime()))
      xPos = ((timeValue - minTime) / (maxTime - minTime || 1)) * 600 + 100
    } else {
      const valueIndex = xUniqueValues.indexOf(card[xMode as keyof CaseCard] as string)
      xPos = valueIndex * 200 + 100
    }

    if (yMode === "time") {
      const timeValue = new Date(card.time).getTime()
      const minTime = Math.min(...cardList.map((c) => new Date(c.time).getTime()))
      const maxTime = Math.max(...cardList.map((c) => new Date(c.time).getTime()))
      yPos = ((timeValue - minTime) / (maxTime - minTime || 1)) * 400 + 100
    } else {
      const valueIndex = yUniqueValues.indexOf(card[yMode as keyof CaseCard] as string)
      yPos = valueIndex * 200 + 100
    }

    return { x: xPos, y: yPos }
  }, [getUniqueValues])

  const organizeCards = useCallback(() => {
    setCards(currentCards => {
      const updatedCards = currentCards.map((card) => ({
        ...card,
        ...getGridPosition(card, currentCards, xAxisMode, yAxisMode),
      }))
      return updatedCards
    })
  }, [getGridPosition, xAxisMode, yAxisMode])


  const handleToggleJsonEditor = useCallback(() => {
    setShowJsonEditor(prev => {
      if (!prev) {
        // When opening JSON editor, populate with current cards
        setJsonContent(JSON.stringify(cards, null, 2))
      }
      return !prev
    })
  }, [cards])

  // Debounced JSON parsing effect
  useEffect(() => {
    if (showJsonEditor && jsonContent.trim()) {
      const timeoutId = setTimeout(() => {
        try {
          const parsedData = JSON.parse(jsonContent)
          
          if (Array.isArray(parsedData)) {
            const validCards: CaseCard[] = []
            
            parsedData.forEach((item) => {
              if (item.time && item.actor && item.place && item.claims) {
                const card: CaseCard = {
                  id: item.id || Date.now().toString() + Math.random().toString(36).substring(2, 11),
                  time: item.time,
                  actor: item.actor,
                  place: item.place,
                  claims: item.claims,
                  is_lie: item.is_lie || false,
                  x: item.x || Math.random() * 400 + 100,
                  y: item.y || Math.random() * 300 + 100,
                }
                validCards.push(card)
              }
            })

            if (validCards.length > 0) {
              setCards(validCards)
            }
          }
        } catch (error) {
          // Silently handle parse errors during typing
        }
      }, 500) // 500ms debounce

      return () => clearTimeout(timeoutId)
    }
  }, [jsonContent, showJsonEditor])


  const handleDeleteCard = useCallback((cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId))
    setSelectedCardId(null)
  }, [])

  const handleEditCard = useCallback((cardId: string) => {
    const cardToEdit = cards.find(card => card.id === cardId)
    if (cardToEdit) {
      setEditingCard(cardToEdit)
      setSelectedCardId(null)
    }
  }, [cards])

  const handleUpdateCard = useCallback(() => {
    if (!editingCard) return
    
    setCards(prev => prev.map(card => 
      card.id === editingCard.id ? editingCard : card
    ))
    setEditingCard(null)
  }, [editingCard])

  const handleCardClick = useCallback((cardId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Only allow selection if the card wasn't just dragged
    if (draggingCardId !== cardId) {
      setSelectedCardId(prev => prev === cardId ? null : cardId)
    }
  }, [draggingCardId])

  const handleDragStart = useCallback((cardId: string) => {
    setDraggingCardId(cardId)
    setSelectedCardId(null)
  }, [])

  const handleDragEnd = useCallback((cardId: string, x: number, y: number) => {
    setCards(prev => prev.map((card) => (card.id === cardId ? { ...card, x, y } : card)))
    // Clear dragging state after a small delay to prevent immediate click selection
    setTimeout(() => setDraggingCardId(null), 100)
  }, [])

  const handleInlineEdit = useCallback((cardId: string) => {
    setInlineEditingCardId(cardId)
    setSelectedCardId(null)
  }, [])

  const handleInlineUpdate = useCallback((cardId: string, field: keyof CaseCard, value: string | boolean) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, [field]: value } : card
    ))
  }, [])

  const handleInlineEditComplete = useCallback(() => {
    setInlineEditingCardId(null)
  }, [])

  // Auto-organize cards when axis modes change
  useEffect(() => {
    organizeCards()
  }, [xAxisMode, yAxisMode, organizeCards])

  // Close overlay when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => setSelectedCardId(null)
    if (selectedCardId) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [selectedCardId])

  return (
    <div className="h-screen bg-white">
      {/* Plot Area */}
      <div
        className="w-full h-full relative overflow-auto"
        style={{ 
          minHeight: "100vh",
          backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          paddingLeft: '80px',
          paddingTop: '80px',
          paddingRight: '80px',
          paddingBottom: '80px'
        }}
      >
          {/* InstaPlot logo at top left */}
          {!showJsonEditor && (
            <div className="fixed top-4 left-4 z-30 pointer-events-none">
              <div className="text-xl font-bold text-gray-800">InstaPlot</div>
            </div>
          )}

          {/* X-axis selector at top */}
          {!showJsonEditor && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-30">
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
          )}

          {/* Y-axis selector on left */}
          {!showJsonEditor && (
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2 z-30">
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
          )}

          {/* JSON Editor Toggle Button */}
          <button 
            onClick={handleToggleJsonEditor}
            className={`fixed top-4 right-4 px-3 py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors z-30 flex items-center gap-1 ${
              showJsonEditor 
                ? 'text-gray-700' 
                : ''
            }`}
          >
            <PenTool className="w-3 h-3" />
            JSON
          </button>

          {/* JSON Editor Pane */}
          {showJsonEditor ? (
            <div className="fixed inset-0 bg-white z-10">
              <Textarea
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                placeholder="Paste your JSON data here or click 'Export to Editor' to load current cards..."
                className="w-full h-full font-mono text-sm resize-none border-0 rounded-none p-6"
              />
            </div>
          ) : (
            <>
              {/* Cards */}
              {cards.map((card) => (
                <MemoizedCard
                  key={card.id}
                  card={card}
                  selectedCardId={selectedCardId}
                  draggingCardId={draggingCardId}
                  inlineEditingCardId={inlineEditingCardId}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onClick={handleCardClick}
                  onEdit={handleEditCard}
                  onDelete={handleDeleteCard}
                  onInlineEdit={handleInlineEdit}
                  onInlineUpdate={handleInlineUpdate}
                  onInlineEditComplete={handleInlineEditComplete}
                />
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
                className="fixed bottom-4 right-4 w-12 h-12 bg-black hover:bg-gray-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-30"
              >
                <Plus className="w-6 h-6" />
              </button>
            </>
          )}
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
  )
}
