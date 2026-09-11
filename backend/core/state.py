from typing import TypedDict, List, Dict, Any, Optional

class GraphState(TypedDict):
    """
    Represents the state of our LangGraph execution.
    """
    messages: List[Dict[str, str]]
    active_agent: str
    extracted_data: Optional[Dict[str, Any]]
    generated_file_path: Optional[str]
    error_count: int
    task_type: str
    model_metadata: Dict[str, Any]
    tool_results: List[Dict[str, Any]]
    retrieved_context: Optional[List[Any]]
