import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { FileText, Plus, Edit2, Trash2, LogOut } from 'lucide-react'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

interface Resume {
  _id: string
  fullName: string
  email: string
  createdAt: string
}

export default function Dashboard() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      setLoading(true)
      const response = await API.get('/resume')
      setResumes(response.data)
    } catch (err: any) {
      setError('Failed to load resumes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await API.delete(`/resume/${id}`)
        setResumes(resumes.filter((r) => r._id !== id))
      } catch (err) {
        setError('Failed to delete resume')
      }
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ResumePro</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, <strong>{user?.name}</strong></span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Resumes</h2>
            <p className="text-gray-600 mt-2">Manage and edit your resumes</p>
          </div>
          <Button
            onClick={() => navigate('/resume/new')}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Create New Resume
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first resume to get started</p>
            <Button
              onClick={() => navigate('/resume/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Resume
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {resume.fullName || 'Untitled Resume'}
                    </h3>
                    <p className="text-sm text-gray-500">{resume.email}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Created: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/resume/${resume._id}`)}
                    className="flex-1 gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(resume._id)}
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
