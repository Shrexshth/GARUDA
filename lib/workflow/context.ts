export type WorkflowContext = {
  equipment_id?: string
  type?: string
  status?: string
  inspected_by?: string
  inspection_date?: string
  extracted_data?: Record<string, string>
  document_content?: string
}

const STORAGE_KEY = "garuda-workflow-context"

export function getWorkflowContext(): WorkflowContext {
  if (typeof window === "undefined") {
    return {}
  }

  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    return {}
  }

  try {
    return JSON.parse(stored)
  } catch {
    return {}
  }
}

export function setWorkflowContext(
  context: WorkflowContext
): void {
  if (typeof window === "undefined") {
    return
  }

  const existing = getWorkflowContext()

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...existing,
      ...context,
    })
  )
}

export function clearWorkflowContext(): void {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem(STORAGE_KEY)
}