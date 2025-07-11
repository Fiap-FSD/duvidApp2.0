"use client"

import { useState, useMemo } from "react"
import { Search, Heart, MessageCircle, CheckCircle, Clock, TrendingUp, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { QuestionDetail } from "@/components/question-detail"
import { NewQuestionModal } from "@/components/new-question-modal"

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

const mockQuestions: Question[] = [
  {
    id: 1,
    title: "Como implementar recursão em JavaScript?",
    content:
      "Estou com dificuldade para entender como funciona a recursão em JavaScript. Alguém pode me explicar com exemplos práticos?",
    author: "Maria Silva",
    authorRole: "student",
    tags: ["javascript", "recursão", "programação"],
    likes: 15,
    answers: 3,
    isResolved: true,
    createdAt: "2024-01-10",
    lastActivity: "2024-01-12",
  },
  {
    id: 2,
    title: "Diferença entre let, const e var em JavaScript",
    content: "Qual é a diferença prática entre essas três formas de declarar variáveis? Quando usar cada uma?",
    author: "João Santos",
    authorRole: "student",
    tags: ["javascript", "variáveis", "es6"],
    likes: 23,
    answers: 5,
    isResolved: true,
    createdAt: "2024-01-09",
    lastActivity: "2024-01-11",
  },
  {
    id: 3,
    title: "Como otimizar consultas SQL complexas?",
    content: "Tenho uma query que está muito lenta. Como posso otimizá-la usando índices e outras técnicas?",
    author: "Prof. Carlos",
    authorRole: "teacher",
    tags: ["sql", "performance", "banco-de-dados"],
    likes: 31,
    answers: 7,
    isResolved: false,
    createdAt: "2024-01-08",
    lastActivity: "2024-01-13",
  },
  {
    id: 4,
    title: "React Hooks: useEffect vs useLayoutEffect",
    content: "Quando devo usar useLayoutEffect ao invés de useEffect? Qual a diferença prática entre eles?",
    author: "Ana Costa",
    authorRole: "student",
    tags: ["react", "hooks", "frontend"],
    likes: 18,
    answers: 2,
    isResolved: false,
    createdAt: "2024-01-07",
    lastActivity: "2024-01-10",
  },
  {
    id: 5,
    title: "Estruturas de dados: Quando usar Array vs LinkedList?",
    content: "Estou estudando estruturas de dados e não consigo entender quando é melhor usar cada uma.",
    author: "Pedro Lima",
    authorRole: "student",
    tags: ["estruturas-de-dados", "algoritmos", "performance"],
    likes: 12,
    answers: 4,
    isResolved: true,
    createdAt: "2024-01-06",
    lastActivity: "2024-01-09",
  },
  {
    id: 6,
    title: "Como implementar autenticação JWT em Node.js?",
    content: "Preciso implementar um sistema de autenticação seguro usando JWT. Quais são as melhores práticas?",
    author: "Lucia Ferreira",
    authorRole: "student",
    tags: ["nodejs", "jwt", "autenticação", "segurança"],
    likes: 27,
    answers: 6,
    isResolved: false,
    createdAt: "2024-01-05",
    lastActivity: "2024-01-12",
  },
]

function MainApp() {
  const { user, logout } = useAuth()
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [filterStatus, setFilterStatus] = useState("all")
  const [likedQuestions, setLikedQuestions] = useState<Set<number>>(new Set())
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState(false)

  // Extrair todas as tags únicas
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    questions.forEach((q) => q.tags.forEach((tag) => tags.add(tag)))
    return Array.from(tags).sort()
  }, [questions])

  // Filtrar e ordenar perguntas
  const filteredQuestions = useMemo(() => {
    const filtered = questions.filter((question) => {
      const matchesSearch =
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesTag = selectedTag === "all" || question.tags.includes(selectedTag)

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "resolved" && question.isResolved) ||
        (filterStatus === "unresolved" && !question.isResolved)

      return matchesSearch && matchesTag && matchesStatus
    })

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "likes":
          return b.likes - a.likes
        case "answers":
          return b.answers - a.answers
        case "recent":
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [questions, searchTerm, selectedTag, sortBy, filterStatus])

  const handleLike = (questionId: number) => {
    const newLikedQuestions = new Set(likedQuestions)
    const isLiked = likedQuestions.has(questionId)

    if (isLiked) {
      newLikedQuestions.delete(questionId)
    } else {
      newLikedQuestions.add(questionId)
    }

    setLikedQuestions(newLikedQuestions)

    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, likes: isLiked ? q.likes - 1 : q.likes + 1 } : q)),
    )
  }

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question)
  }

  const handleQuestionUpdate = (updatedQuestion: Question) => {
    setQuestions((prev) => prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "hoje"
    if (diffDays === 2) return "ontem"
    if (diffDays <= 7) return `${diffDays} dias atrás`
    return date.toLocaleDateString("pt-BR")
  }

  if (!user) {
    return <LoginForm onSuccess={() => {}} />
  }

  if (selectedQuestion) {
    return (
      <QuestionDetail
        question={selectedQuestion}
        onBack={() => setSelectedQuestion(null)}
        onQuestionUpdate={handleQuestionUpdate}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">AcadêmicoQ&A</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Olá, {user.name}</span>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsNewQuestionModalOpen(true)}>
                Nova Pergunta
              </Button>
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar com filtros */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Filtros</h2>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="resolved">Resolvidas</SelectItem>
                    <SelectItem value="unresolved">Não Resolvidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais recentes</SelectItem>
                    <SelectItem value="likes">Mais curtidas</SelectItem>
                    <SelectItem value="answers">Mais respostas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Search bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Buscar perguntas, tags ou conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredQuestions.length} pergunta{filteredQuestions.length !== 1 ? "s" : ""}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                Ordenado por:{" "}
                {sortBy === "recent" ? "Mais recentes" : sortBy === "likes" ? "Mais curtidas" : "Mais respostas"}
              </div>
            </div>

            {/* Questions list */}
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {question.isResolved && <CheckCircle className="w-5 h-5 text-green-600" />}
                          <h3
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() => handleQuestionClick(question)}
                          >
                            {question.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{question.content}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{question.author}</span>
                          <Badge
                            variant={question.authorRole === "teacher" ? "default" : "outline"}
                            className="text-xs ml-1"
                          >
                            {question.authorRole === "teacher" ? "Professor" : "Aluno"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(question.lastActivity)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(question.id)}
                          className={`flex items-center gap-1 ${
                            likedQuestions.has(question.id) ? "text-red-600" : "text-gray-600"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedQuestions.has(question.id) ? "fill-current" : ""}`} />
                          <span>{question.likes}</span>
                        </Button>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MessageCircle className="w-4 h-4" />
                          <span>{question.answers}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pergunta encontrada</h3>
                <p className="text-gray-600">Tente ajustar seus filtros ou fazer uma nova pergunta.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <NewQuestionModal
        isOpen={isNewQuestionModalOpen}
        onClose={() => setIsNewQuestionModalOpen(false)}
        onSubmit={(newQuestion) => {
          setQuestions((prev) => [newQuestion, ...prev])
          setIsNewQuestionModalOpen(false)
        }}
        availableTags={allTags}
      />
    </div>
  )
}

export default function Component() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
