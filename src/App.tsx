import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { ReasoningWorkspace } from './pages/ReasoningWorkspace';
import { DocumentWorkspace } from './pages/DocumentWorkspace';
import { ScanWorkspace } from './pages/ScanWorkspace';
import { CodeWorkspace } from './pages/CodeWorkspace';
import { ApprovalWorkspace } from './pages/ApprovalWorkspace';
import { WorkflowsDashboard } from './pages/WorkflowsDashboard';
import { AuditTrailWorkspace } from './pages/AuditTrailWorkspace';
import { DocumentationWorkspace } from './pages/DocumentationWorkspace';
import { AccountWorkspace } from './pages/AccountWorkspace';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workflows" element={<WorkflowsDashboard />} />
        <Route path="/workspace/reasoning" element={<ReasoningWorkspace />} />
        <Route path="/workspace/document" element={<DocumentWorkspace />} />
        <Route path="/workspace/scan" element={<ScanWorkspace />} />
        <Route path="/workspace/code" element={<CodeWorkspace />} />
        <Route path="/workspace/approval" element={<ApprovalWorkspace />} />
        <Route path="/audit-trail" element={<AuditTrailWorkspace />} />
        <Route path="/documentation" element={<DocumentationWorkspace />} />
        <Route path="/account" element={<AccountWorkspace />} />
      </Routes>
    </Router>
  );
}

export default App;
