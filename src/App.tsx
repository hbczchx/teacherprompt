import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import LoginPage, { getCurrentUser } from './pages/LoginPage'
import HomePage from './pages/HomePage'
import TemplateListPage from './pages/TemplateListPage'
import EditorPage from './pages/EditorPage'
import ResultPage from './pages/ResultPage'
import MyTemplatesPage from './pages/MyTemplatesPage'
import HistoryPage from './pages/HistoryPage'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AuthGuard><HomePage /></AuthGuard>} />
          <Route path="/scenario/:id" element={<AuthGuard><TemplateListPage /></AuthGuard>} />
          <Route path="/editor" element={<AuthGuard><EditorPage /></AuthGuard>} />
          <Route path="/result" element={<AuthGuard><ResultPage /></AuthGuard>} />
          <Route path="/my-templates" element={<AuthGuard><MyTemplatesPage /></AuthGuard>} />
          <Route path="/history" element={<AuthGuard><HistoryPage /></AuthGuard>} />
        </Routes>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}

export default App
