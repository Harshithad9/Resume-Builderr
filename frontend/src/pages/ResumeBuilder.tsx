import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Plus, Trash2, Download, Save, ArrowLeft } from 'lucide-react'
import html2pdf from 'html2pdf.js'
import API from '../services/api'
import ResumePreview from '../components/ResumePreview'

interface ResumeData {
  _id?: string
  fullName: string
  email: string
  phone: string
  linkedin: string
  github: string
  education: string
  skills: string
  projects: string
  experience: string
  certifications: string
}

const initialData: ResumeData = {
  fullName: '',
  email: '',
  phone: '',
  linkedin: '',
  github: '',
  education: '',
  skills: '',
  projects: '',
  experience: '',
  certifications: '',
}

export default function ResumeBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<ResumeData>(initialData)
  const [loading, setLoading] = useState(!!id)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      fetchResume()
    }
  }, [id])

  const fetchResume = async () => {
    try {
      const response = await API.get(`/resume/${id}`)
      setData(response.data)
    } catch (err) {
      console.error('Failed to load resume', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (data._id) {
        await API.put(`/resume/${data._id}`, data)
      } else {
        const response = await API.post('/resume', data)
        setData((prev) => ({ ...prev, _id: response.data._id }))
      }
      alert('Resume saved successfully!')
    } catch (err) {
      console.error('Failed to save resume', err)
      alert('Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-preview')
    if (!element) return

    const opt = {
      margin: 10,
      filename: `${data.fullName || 'Resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    }

    html2pdf().set(opt).from(element).save()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 flex-1">
            {data._id ? 'Edit Resume' : 'Create New Resume'}
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="gap-2"
              disabled={!data.fullName}
            >
              <Download className="w-4 h-4" />
              PDF
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-[calc(100vh-80px)]">
          {/* Left Side - Form */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)]">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    name="fullName"
                    value={data.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <Input
                    name="linkedin"
                    value={data.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub URL
                  </label>
                  <Input
                    name="github"
                    value={data.github}
                    onChange={handleChange}
                    placeholder="https://github.com/johndoe"
                  />
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
              <Textarea
                name="education"
                value={data.education}
                onChange={handleChange}
                placeholder="Enter your education details (degree, school, graduation date, etc.)"
                rows={4}
              />
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Experience</h2>
              <Textarea
                name="experience"
                value={data.experience}
                onChange={handleChange}
                placeholder="Enter your work experience (job title, company, duration, responsibilities, etc.)"
                rows={4}
              />
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
              <Textarea
                name="skills"
                value={data.skills}
                onChange={handleChange}
                placeholder="List your skills (e.g., JavaScript, React, Python, etc.)"
                rows={4}
              />
            </div>

            {/* Projects */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects</h2>
              <Textarea
                name="projects"
                value={data.projects}
                onChange={handleChange}
                placeholder="Describe your key projects (project name, description, technologies, links, etc.)"
                rows={4}
              />
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
              <Textarea
                name="certifications"
                value={data.certifications}
                onChange={handleChange}
                placeholder="List your certifications and licenses"
                rows={4}
              />
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="sticky top-[73px] h-[calc(100vh-93px)] overflow-y-auto">
            <ResumePreview data={data} />
          </div>
        </div>
      </main>
    </div>
  )
}
