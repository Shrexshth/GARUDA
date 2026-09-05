from langgraph.graph import StateGraph, END
from backend.core.state import GraphState
from backend.core.nodes import router_node, vision_node, reasoning_node, tool_node

def route_task(state: GraphState):
    task_type = state.get("task_type")
    if task_type == "vision_task":
        return "vision_node"
    return "reasoning_node"

def route_after_model(state: GraphState):
    agent = state.get("active_agent")
    if agent in ["code", "document"]:
        return "tool_node"
    return END

def route_after_tool(state: GraphState):
    if state.get("error_count", 0) > 0 and state.get("error_count", 0) <= 2:
        # Append error message to prompt reasoning node to fix it
        last_tool_res = state.get("tool_results", [])[-1]
        error_msg = last_tool_res.get("stderr", "Unknown tool error")
        state["messages"].append({
            "role": "user", 
            "content": f"The tool execution failed with error:\n{error_msg}\nPlease fix the code and try again."
        })
        return "reasoning_node"
    return END

# Initialize Graph
workflow = StateGraph(GraphState)

# Add Nodes
workflow.add_node("router", router_node)
workflow.add_node("vision_node", vision_node)
workflow.add_node("reasoning_node", reasoning_node)
workflow.add_node("tool_node", tool_node)

# Add Edges
workflow.set_entry_point("router")
workflow.add_conditional_edges("router", route_task)

workflow.add_conditional_edges("vision_node", route_after_model)
workflow.add_conditional_edges("reasoning_node", route_after_model)

workflow.add_conditional_edges("tool_node", route_after_tool)

# Compile
app = workflow.compile()
