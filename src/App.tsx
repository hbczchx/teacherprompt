import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import TemplateListPage from './pages/TemplateListPage'
import EditorPage from './pages/EditorPage'
import ResultPage from './pages/ResultPage'
import MyTemplatesPage from './pages/MyTemplatesPage'
import HistoryPage from './pages/HistoryPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scenario/:id" element={<TemplateListPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/my-templates" element={<MyTemplatesPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      <Toaster position="top-center" />
    </div>
  )
}

export default App
