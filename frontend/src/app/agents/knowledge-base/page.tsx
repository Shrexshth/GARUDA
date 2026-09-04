"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Card from "@/components/ui/Card";
import InputBar from "@/components/ui/InputBar";
import EmptyState from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";

interface SearchResult {
  id: string;
  title: string;
  source: string;
  snippet: string;
  relevance: number;
  tags: string[];
}

interface IndexedCorpus {
  name: string;
  documentCount: number;
  lastUpdated: string;
}

export default function KnowledgeBasePage() {
  const [searchResults] = useState<SearchResult[]>([]);
  const [citedSources] = useState<SearchResult[]>([]);
  const [indexedCorpora] = useState<IndexedCorpus[]>([]);

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant shadow-sm">
              <span className="material-symbols-outlined text-[20px]">auto_stories</span>
            </div>
            <div>
              <h1 className="text-headline-md font-semibold text-on-surface tracking-tight">Knowledge Base Agent</h1>
              <span className="text-body-sm text-secondary">Semantic search across indexed OISD standards, SOPs, and refinery manuals</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-label-sm font-semibold text-on-surface">ChromaDB RAG Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          {/* Search & Results */}
          <div className="xl:col-span-8 flex flex-col gap-space-lg">
            {/* Search */}
            <InputBar placeholder="Search standards, SOPs, or ask a question about refinery operations..." />

            {/* Results */}
            {searchResults.length === 0 ? (
              <Card>
                <EmptyState
                  icon="search"
                  title="No results yet"
                  description="Enter a query above to search across indexed refinery documentation."
                />
              </Card>
            ) : (
              <div className="flex flex-col gap-space-md">
                {searchResults.map((result) => (
                  <Card key={result.id} className="flex flex-col gap-space-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <h3 className="text-headline-sm font-semibold text-on-surface">{result.title}</h3>
                      <StatusBadge label={`${Math.round(result.relevance * 100)}% match`} variant="success" />
                    </div>
                    <p className="text-body-md text-secondary">{result.snippet}</p>
                    <div className="flex items-center gap-space-xs">
                      <span className="text-label-sm font-semibold text-secondary">{result.source}</span>
                      {result.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-surface-container text-secondary text-label-sm font-semibold">{tag}</span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right: Indexed Corpora */}
          <aside className="xl:col-span-4 bg-surface-container-low/40 rounded-2xl p-space-md flex flex-col gap-space-md self-stretch">
            <h2 className="text-headline-sm font-semibold text-on-surface">Indexed Corpora</h2>
            {indexedCorpora.length === 0 ? (
              <EmptyState icon="library_books" title="No corpora indexed" description="Ingest documents into ChromaDB to populate the knowledge base." />
            ) : (
              <div className="flex flex-col gap-space-xs">
                {indexedCorpora.map((corpus, i) => (
                  <div key={i} className="p-space-sm bg-surface-container-lowest rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-label-md font-medium text-on-surface">{corpus.name}</span>
                      <br />
                      <span className="text-label-sm font-semibold text-secondary">{corpus.documentCount} documents</span>
                    </div>
                    <span className="text-label-sm font-semibold text-secondary">{corpus.lastUpdated}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-space-md">
              <h3 className="text-headline-sm font-semibold text-on-surface mb-space-sm">Cited Sources</h3>
              {citedSources.length === 0 ? (
                <p className="text-body-sm text-secondary">Sources cited in responses will appear here.</p>
              ) : (
                <div className="flex flex-col gap-space-xs">
                  {/* cited sources would render here */}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
