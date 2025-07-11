"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"

interface Question {
  id: number
  title: string
  content: string
  author: string
  authorRole: "student" | "teacher"
  tags: string[]
  likes: number
  answers: number
  isResolved: boolean
  createdAt: string
  lastActivity: string
}

interface NewQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (question: Question) => void
  availableTags: string[]
}

export function NewQuestionModal({ isOpen, onClose, onSubmit, availableTags }: NewQuestionModalProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    newTag: "",
  })

  // Suggested tags based on content
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      tags: [],
      newTag: "",
    })
    setErrors({})
    setSuggestedTags([])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório"
    } else if (formData.title.length < 10) {
      newErrors.title = "Título deve ter pelo menos 10 caracteres"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Descrição é obrigatória"
    } else if (formData.content.length < 20) {
      newErrors.content = "Descrição deve ter pelo menos 20 caracteres"
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "Adicione pelo menos uma tag"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newQuestion: Question = {
      id: Date.now(), // In real app, this would come from the server
      title: formData.title.trim(),
      content: formData.content.trim(),
      author: user.name,
      authorRole: user.role,
      tags: formData.tags,
      likes: 0,
      answers: 0,
      isResolved: false,
      createdAt: new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString().split("T")[0],
    }

    onSubmit(newQuestion)
    setIsSubmitting(false)
    resetForm()
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
        newTag: "",
      }))
      // Clear tag error when tag is added
      if (errors.tags) {
        setErrors((prev) => ({ ...prev, tags: "" }))
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleNewTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag(formData.newTag)
    }
  }

  // Update suggested tags based on content
  const updateSuggestedTags = (content: string) => {
    const words = content.toLowerCase().split(/\s+/)
    const suggestions = availableTags.filter((tag) => {
      return words.some((word) => word.includes(tag) || tag.includes(word)) && !formData.tags.includes(tag)
    })
    setSuggestedTags(suggestions.slice(0, 5)) // Limit to 5 suggestions
  }

  const handleContentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }))
    updateSuggestedTags(value)
    // Clear content error when user starts typing
    if (errors.content && value.length >= 20) {
      setErrors((prev) => ({ ...prev, content: "" }))
    }
  }

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, title: value }))
    // Clear title error when user starts typing
    if (errors.title && value.length >= 10) {
      setErrors((prev) => ({ ...prev, title: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nova Pergunta</DialogTitle>
          <DialogDescription>
            Descreva sua dúvida de forma clara e detalhada para obter as melhores respostas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Título da pergunta *
            </Label>
            <Input
              id="title"
              placeholder="Ex: Como implementar autenticação em React?"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            <p className="text-xs text-gray-500">
              Seja específico e imagine que está fazendo a pergunta para um colega.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Descrição detalhada *
            </Label>
            <Textarea
              id="content"
              placeholder="Descreva sua dúvida em detalhes. Inclua o que você já tentou, códigos relevantes, mensagens de erro, etc."
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              rows={6}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
            <p className="text-xs text-gray-500">
              Quanto mais detalhes você fornecer, melhor será a qualidade das respostas.
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tags *</Label>

            {/* Current tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add new tag */}
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar tag (ex: javascript, react, css)"
                value={formData.newTag}
                onChange={(e) => setFormData((prev) => ({ ...prev, newTag: e.target.value }))}
                onKeyPress={handleNewTagKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addTag(formData.newTag)}
                disabled={!formData.newTag.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {errors.tags && <p className="text-sm text-red-600">{errors.tags}</p>}

            {/* Suggested tags */}
            {suggestedTags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Tags sugeridas baseadas no conteúdo:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(tag)}
                      className="text-xs h-7"
                    >
                      + {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular tags */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Tags populares:</p>
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter((tag) => !formData.tags.includes(tag))
                  .slice(0, 8)
                  .map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addTag(tag)}
                      className="text-xs h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      + {tag}
                    </Button>
                  ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Publicando..." : "Publicar Pergunta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
