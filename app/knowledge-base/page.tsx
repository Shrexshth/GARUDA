"use client"

import { useMemo, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  FileText,
  RefreshCw,
  Database,
  ChevronRight,
  Clock3,
  CheckCircle2,
} from "lucide-react"

type SearchResult = {
  id: number
  title: string
  source: string
  page: number
  category: string
  text: string
  relevance: number
}

type IndexedDocument = {
  name: string
  type: string
  pages: number
  chunks: number
  status: "Indexed" | "Indexing"
}

const MOCK_RESULTS: SearchResult[] = [
  {
    id: 1,
    title: "Pressure Vessel Inspection Procedure",
    source: "SOP-PRV-104.pdf",
    page: 12,
    category: "SOP",
    text:
      "Pressure vessels showing visible corrosion must undergo detailed inspection. The inspection record shall include equipment identification, observed condition, inspector details, and recommended action.",
    relevance: 96,
  },
  {
    id: 2,
    title: "Corrosion Monitoring Manual",
    source: "Corrosion-Monitoring-Manual.pdf",
    page: 47,
    category: "Manual",
    text:
      "Where corrosion is identified during visual inspection, the affected equipment shall be evaluated for severity and appropriate maintenance action.",
    relevance: 91,
  },
  {
    id: 3,
    title: "Inspection Correspondence — Unit 3",
    source: "Correspondence-Unit-3.pdf",
    page: 3,
    category: "Correspondence",
    text:
      "Inspection observations for equipment V-104 were forwarded for review and further maintenance planning.",
    relevance: 84,
  },
]

const INITIAL_DOCUMENTS: IndexedDocument[] = [
  {
    name: "Pressure Vessel Inspection Procedure.pdf",
    type: "SOP",
    pages: 84,
    chunks: 426,
    status: "Indexed",
  },
  {
    name: "Corrosion Monitoring Manual.pdf",
    type: "Manual",
    pages: 126,
    chunks: 682,
    status: "Indexed",
  },
  {
    name: "Correspondence — Unit 3.pdf",
    type: "Correspondence",
    pages: 18,
    chunks: 94,
    status: "Indexed",
  },
  {
    name: "Plant Safety Manual.pdf",
    type: "Manual",
    pages: 215,
    chunks: 1087,
    status: "Indexed",
  },
]

export default function KnowledgeBaseAgent() {
  const [query, setQuery] = useState("")
  const [searched, setSearched] = useState(false)
  const [indexing, setIndexing] = useState(false)
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS)

  const results = useMemo(() => {
    if (!searched) return []

    const searchText = query.toLowerCase().trim()

    if (!searchText) return MOCK_RESULTS

    return MOCK_RESULTS.filter(
      (result) =>
        result.title.toLowerCase().includes(searchText) ||
        result.text.toLowerCase().includes(searchText) ||
        result.source.toLowerCase().includes(searchText) ||
        result.category.toLowerCase().includes(searchText)
    )
  }, [query, searched])

  function handleSearch() {
    setSearched(true)
  }

  function handleReindex() {
    setIndexing(true)

    setDocuments((prev) =>
      prev.map((doc) => ({
        ...doc,
        status: "Indexing",
      }))
    )

    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) => ({
          ...doc,
          status: "Indexed",
        }))
      )

      setIndexing(false)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col px-14 py-10">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />

                    <h1 className="text-2xl font-semibold text-foreground">
              Knowledge Base / Search Agent
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Search local SOPs, correspondence, manuals, and other
            indexed knowledge.
          </p>
        </div>

        {/* Centered Search */}
        <div className="mx-auto mt-12 w-full max-w-3xl">
          <div className="text-center">
            <h2 className="text-base font-semibold">
              Search the Knowledge Base
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Retrieve relevant information from the local enterprise
              knowledge base.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
                placeholder="Search SOPs, manuals, equipment procedures..."
                className="h-11 pl-10"
              />
            </div>

            <Button
              onClick={handleSearch}
              className="h-11 px-5"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Search Results */}
        <div className="mt-10 flex-1">
          {searched && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">
                    Retrieved Results
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    Local RAG retrieval results with source citations.
                  </p>
                </div>

                <Badge variant="secondary">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </Badge>
              </div>

              {results.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <Search className="mx-auto h-6 w-6 text-muted-foreground" />

                  <p className="mt-3 text-sm font-medium">
                    No matching documents found
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Try a different equipment ID, procedure, or keyword.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5 rounded-md border border-border p-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold">
                              {result.title}
                            </h3>

                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{result.category}</span>

                              <span>•</span>

                              <span>
                                {result.source}
                              </span>

                              <span>•</span>

                              <span>
                                Page {result.page}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Badge variant="secondary">
                          {result.relevance}% relevant
                        </Badge>
                      </div>

                      <div className="mt-4 rounded-md bg-muted/40 p-3">
                        <p className="text-sm leading-6">
                          {result.text}
                        </p>
                      </div>

                      {/* Citation */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />

                          <span>
                            Source: {result.source}, Page {result.page}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                        >
                          View source
                          <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!searched && (
            <div className="mt-6 rounded-lg border border-dashed border-border p-10 text-center">
              <Search className="mx-auto h-7 w-7 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                Enter a query to search the local knowledge base
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Results will include the retrieved text and its source
                document and page.
              </p>
            </div>
          )}
        </div>

        {/* Index Management */}
        <section className="mt-8 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />

                <h2 className="text-sm font-semibold">
                  Index Management
                </h2>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Manage documents available to the local retrieval system.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReindex}
              disabled={indexing}
            >
              <RefreshCw
                className={`mr-2 h-3.5 w-3.5 ${
                  indexing ? "animate-spin" : ""
                }`}
              />

              {indexing ? "Re-indexing..." : "Re-index"}
            </Button>
          </div>

          <div className="divide-y divide-border">
            {documents.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />

                  <div>
                    <p className="text-sm font-medium">
                      {doc.name}
                    </p>

                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.pages} pages</span>
                      <span>•</span>
                      <span>{doc.chunks} chunks</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {doc.status === "Indexed" ? (
                    <Badge className="bg-[--success] text-white">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Indexed
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Clock3 className="mr-1 h-3 w-3" />
                      Indexing
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}