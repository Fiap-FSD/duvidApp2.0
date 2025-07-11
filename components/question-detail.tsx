"use client"

import { useState } from "react"
import { ArrowLeft, Heart, MessageCircle, CheckCircle, User, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"

interface Comment {
  id: number
  content: string
  author: string
  authorRole: "student" | "teacher"
  likes: number
  createdAt: string
  isAccepted?: boolean
}

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

interface QuestionDetailProps {
  question: Question
  onBack: () => void
  onQuestionUpdate: (updatedQuestion: Question) => void
}

const mockComments: Comment[] = [
  {
    id: 1,
    content:
      "A recursão é uma técnica onde uma função chama a si mesma. É importante ter uma condição de parada para evitar loops infinitos. Aqui está um exemplo simples:\n\nfunction factorial(n) {\n  if (n <= 1) return 1; // condição de parada\n  return n * factorial(n - 1); // chamada recursiva\n}",
    author: "Prof. Carlos",
    authorRole: "teacher",
    likes: 12,
    createdAt: "2024-01-11",
    isAccepted: true,
  },
  {
    id: 2,
    content:
      "Complementando a resposta do professor, outro exemplo útil é a sequência de Fibonacci:\n\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",
    author: "Ana Costa",
    authorRole: "student",
    likes: 8,
    createdAt: "2024-01-12",
  },
  {
    id: 3,
    content: "Muito obrigada pelas explicações! Agora entendi melhor. A condição de parada é realmente fundamental.",
    author: "Maria Silva",
    authorRole: "student",
    likes: 3,
    createdAt: "2024-01-12",
  },
]

export function QuestionDetail({ question, onBack, onQuestionUpdate }: QuestionDetailProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())
  const [questionLiked, setQuestionLiked] = useState(false)

  const handleLikeQuestion = () => {
    const updatedQuestion = {
      ...question,
      likes: questionLiked ? question.likes - 1 : question.likes + 1,
    }
    setQuestionLiked(!questionLiked)
    onQuestionUpdate(updatedQuestion)
  }

  const handleLikeComment = (commentId: number) => {
    const newLikedComments = new Set(likedComments)
    const isLiked = likedComments.has(commentId)

    if (isLiked) {
      newLikedComments.delete(commentId)
    } else {
      newLikedComments.add(commentId)
    }

    setLikedComments(newLikedComments)

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, likes: isLiked ? comment.likes - 1 : comment.likes + 1 } : comment,
      ),
    )
  }

  const handleSubmitComment = () => {
    if (!newComment.trim() || !user) return

    const comment: Comment = {
      id: comments.length + 1,
      content: newComment,
      author: user.name,
      authorRole: user.role,
      likes: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setComments([...comments, comment])
    setNewComment("")

    // Update question answers count
    const updatedQuestion = {
      ...question,
      answers: question.answers + 1,
      lastActivity: new Date().toISOString().split("T")[0],
    }
    onQuestionUpdate(updatedQuestion)
  }

  const handleAcceptAnswer = (commentId: number) => {
    if (user?.name !== question.author) return

    setComments((prev) =>
      prev.map((comment) => ({
        ...comment,
        isAccepted: comment.id === commentId ? !comment.isAccepted : false,
      })),
    )

    // Mark question as resolved if an answer is accepted
    const hasAcceptedAnswer = comments.some((c) => c.id === commentId)
    if (!hasAcceptedAnswer) {
      const updatedQuestion = { ...question, isResolved: true }
      onQuestionUpdate(updatedQuestion)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Logado como {user?.name}</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user?.name.charAt(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {question.isResolved && <CheckCircle className="w-6 h-6 text-green-600" />}
                  <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{question.author}</span>
                    <Badge variant={question.authorRole === "teacher" ? "default" : "outline"} className="text-xs ml-1">
                      {question.authorRole === "teacher" ? "Professor" : "Aluno"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(question.createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{question.content}</p>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeQuestion}
                className={`flex items-center gap-2 ${questionLiked ? "text-red-600" : "text-gray-600"}`}
              >
                <Heart className={`w-5 h-5 ${questionLiked ? "fill-current" : ""}`} />
                <span>{question.likes}</span>
              </Button>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span>
                  {comments.length} resposta{comments.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">
            {comments.length} Resposta{comments.length !== 1 ? "s" : ""}
          </h2>
          {comments.map((comment) => (
            <Card key={comment.id} className={comment.isAccepted ? "border-green-200 bg-green-50" : ""}>
              <CardContent className="pt-6">
                {comment.isAccepted && (
                  <div className="flex items-center gap-2 mb-3 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Resposta aceita</span>
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-700 text-sm font-medium">{comment.author.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <Badge variant={comment.authorRole === "teacher" ? "default" : "outline"} className="text-xs">
                          {comment.authorRole === "teacher" ? "Professor" : "Aluno"}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600">{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{comment.content}</p>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-2 ${
                      likedComments.has(comment.id) ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                    <span>{comment.likes}</span>
                  </Button>
                  {user?.name === question.author && !question.isResolved && (
                    <Button
                      variant={comment.isAccepted ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAcceptAnswer(comment.id)}
                    >
                      {comment.isAccepted ? "Resposta aceita" : "Aceitar resposta"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Comment */}
        {user && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Sua resposta</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Escreva sua resposta aqui..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleSubmitComment} disabled={!newComment.trim()} className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Enviar resposta
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
