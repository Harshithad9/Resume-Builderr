import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Trash2, Edit2, Save, X, AlertCircle } from 'lucide-react'
import ResumePreview from '../components/ResumePreview.jsx'
import API from '../services/api'
import { validateResume as validateResumeUtil } from '../utils/validation.js'

const ResumeBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState([])

  const [resume, setResume] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: [],
  })

  const [skillInput, setSkillInput] = useState('')
  const [editingEducation, setEditingEducation] = useState(null)
  const [editingExperience, setEditingExperience] = useState(null)
  const [editingProject, setEditingProject] = useState(null)

  useEffect(() => {
    if (id) {
      loadResume()
    }
  }, [id])

  const loadResume = async () => {
    setLoading(true)
    try {
      const response = await API.get(`/resume/${id}`)
      setResume(response.data)
    } catch (error) {
      console.error('Error loading resume:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateResume = () => {
    const newErrors = validateResumeUtil(resume)
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleBasicInfoChange = (field, value) => {
    setResume(prev => ({ ...prev, [field]: value }))
  }

  // Education handlers
  const addEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
    }
    setEditingEducation(newEducation)
  }

  const saveEducation = () => {
    if (!editingEducation?.school || !editingEducation?.degree) {
      alert('Please fill in school and degree')
      return
    }
    if (editingEducation.id && resume.education.find(e => e.id === editingEducation.id)) {
      setResume(prev => ({
        ...prev,
        education: prev.education.map(e => e.id === editingEducation.id ? editingEducation : e)
      }))
    } else {
      setResume(prev => ({ ...prev, education: [...prev.education, editingEducation] }))
    }
    setEditingEducation(null)
  }

  const deleteEducation = (id) => {
    setResume(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }))
  }

  // Experience handlers
  const addExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    }
    setEditingExperience(newExperience)
  }

  const saveExperience = () => {
    if (!editingExperience?.company || !editingExperience?.position) {
      alert('Please fill in company and position')
      return
    }
    if (editingExperience.id && resume.experience.find(e => e.id === editingExperience.id)) {
      setResume(prev => ({
        ...prev,
        experience: prev.experience.map(e => e.id === editingExperience.id ? editingExperience : e)
      }))
    } else {
      setResume(prev => ({ ...prev, experience: [...prev.experience, editingExperience] }))
    }
    setEditingExperience(null)
  }

  const deleteExperience = (id) => {
    setResume(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }))
  }

  // Project handlers
  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: '',
      description: '',
      technologies: [],
      link: '',
    }
    setEditingProject(newProject)
  }

  const saveProject = () => {
    if (!editingProject?.title || !editingProject?.description) {
      alert('Please fill in project title and description')
      return
    }
    if (editingProject.id && resume.projects.find(p => p.id === editingProject.id)) {
      setResume(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === editingProject.id ? editingProject : p)
      }))
    } else {
      setResume(prev => ({ ...prev, projects: [...prev.projects, editingProject] }))
    }
    setEditingProject(null)
  }

  const deleteProject = (id) => {
    setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }))
  }

  // Skills handlers
  const addSkill = () => {
    if (skillInput.trim() && !resume.skills.includes(skillInput.trim())) {
      setResume(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => {
    setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }))
  }

  const saveResume = async () => {
    if (!validateResume()) return

    setSaving(true)
    try {
      if (id) {
        await API.put(`/resume/${id}`, resume)
      } else {
        await API.post('/resume', resume)
      }
      navigate('/dashboard')
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  const getFieldError = (field) => errors.find(e => e.field === field)?.message

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-muted-foreground mt-4">Loading resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Build Your Resume</h1>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Back</Button>
            </div>

            {/* Error Alert */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-2">Please fix the following errors:</h3>
                    <ul className="space-y-1 text-sm text-red-800">
                      {errors.map((error, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>{error.message}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <Card>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      placeholder="John Doe"
                      value={resume.fullName}
                      onChange={(e) => handleBasicInfoChange('fullName', e.target.value)}
                      className={getFieldError('fullName') ? 'border-red-500 mt-1' : 'mt-1'}
                    />
                    {getFieldError('fullName') && <p className="text-sm text-red-500 mt-1">{getFieldError('fullName')}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      value={resume.email}
                      onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                      className={getFieldError('email') ? 'border-red-500 mt-1' : 'mt-1'}
                    />
                    {getFieldError('email') && <p className="text-sm text-red-500 mt-1">{getFieldError('email')}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone *</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      value={resume.phone}
                      onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
                      className={getFieldError('phone') ? 'border-red-500 mt-1' : 'mt-1'}
                    />
                    {getFieldError('phone') && <p className="text-sm text-red-500 mt-1">{getFieldError('phone')}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      placeholder="New York, USA"
                      value={resume.location}
                      onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Professional Summary</label>
                    <Textarea
                      placeholder="Brief overview of your professional background..."
                      value={resume.summary}
                      onChange={(e) => handleBasicInfoChange('summary', e.target.value)}
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Education Section */}
            <Card>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Education</h2>
                  <Button size="sm" onClick={addEducation}>Add Education</Button>
                </div>
                {getFieldError('education') && <p className="text-sm text-red-500">{getFieldError('education')}</p>}

                {editingEducation ? (
                  <div className="space-y-3 border-t pt-4">
                    <Input
                      placeholder="School/University"
                      value={editingEducation.school}
                      onChange={(e) => setEditingEducation({ ...editingEducation, school: e.target.value })}
                    />
                    <Input
                      placeholder="Degree"
                      value={editingEducation.degree}
                      onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                    />
                    <Input
                      placeholder="Field of Study"
                      value={editingEducation.field}
                      onChange={(e) => setEditingEducation({ ...editingEducation, field: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium">Start Date</label>
                        <Input
                          type="date"
                          value={editingEducation.startDate}
                          onChange={(e) => setEditingEducation({ ...editingEducation, startDate: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">End Date</label>
                        <Input
                          type="date"
                          value={editingEducation.endDate}
                          onChange={(e) => setEditingEducation({ ...editingEducation, endDate: e.target.value })}
                          disabled={editingEducation.current}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingEducation.current}
                        onChange={(e) => setEditingEducation({ ...editingEducation, current: e.target.checked })}
                      />
                      <span className="text-sm">Currently studying</span>
                    </label>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEducation} className="gap-2"><Save className="w-4 h-4" />Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingEducation(null)} className="gap-2"><X className="w-4 h-4" />Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resume.education.map((edu) => (
                      <div key={edu.id} className="flex items-center justify-between p-3 bg-muted rounded">
                        <div className="flex-1">
                          <p className="font-medium">{edu.school}</p>
                          <p className="text-sm text-muted-foreground">{edu.degree} in {edu.field}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setEditingEducation(edu)} className="gap-1"><Edit2 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteEducation(edu.id)} className="gap-1"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Experience Section */}
            <Card>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Experience</h2>
                  <Button size="sm" onClick={addExperience}>Add Experience</Button>
                </div>
                {getFieldError('experience') && <p className="text-sm text-red-500">{getFieldError('experience')}</p>}

                {editingExperience ? (
                  <div className="space-y-3 border-t pt-4">
                    <Input
                      placeholder="Company"
                      value={editingExperience.company}
                      onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                    />
                    <Input
                      placeholder="Position/Title"
                      value={editingExperience.position}
                      onChange={(e) => setEditingExperience({ ...editingExperience, position: e.target.value })}
                    />
                    <Textarea
                      placeholder="Job description and responsibilities..."
                      value={editingExperience.description}
                      onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium">Start Date</label>
                        <Input
                          type="date"
                          value={editingExperience.startDate}
                          onChange={(e) => setEditingExperience({ ...editingExperience, startDate: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">End Date</label>
                        <Input
                          type="date"
                          value={editingExperience.endDate}
                          onChange={(e) => setEditingExperience({ ...editingExperience, endDate: e.target.value })}
                          disabled={editingExperience.current}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingExperience.current}
                        onChange={(e) => setEditingExperience({ ...editingExperience, current: e.target.checked })}
                      />
                      <span className="text-sm">Currently working here</span>
                    </label>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveExperience} className="gap-2"><Save className="w-4 h-4" />Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingExperience(null)} className="gap-2"><X className="w-4 h-4" />Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resume.experience.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between p-3 bg-muted rounded">
                        <div className="flex-1">
                          <p className="font-medium">{exp.position}</p>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setEditingExperience(exp)} className="gap-1"><Edit2 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteExperience(exp.id)} className="gap-1"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Projects Section */}
            <Card>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <Button size="sm" onClick={addProject}>Add Project</Button>
                </div>
                {getFieldError('projects') && <p className="text-sm text-red-500">{getFieldError('projects')}</p>}

                {editingProject ? (
                  <div className="space-y-3 border-t pt-4">
                    <Input
                      placeholder="Project Title"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Project description..."
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      rows={3}
                    />
                    <Input
                      placeholder="Project Link (optional)"
                      value={editingProject.link}
                      onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveProject} className="gap-2"><Save className="w-4 h-4" />Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingProject(null)} className="gap-2"><X className="w-4 h-4" />Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resume.projects.map((proj) => (
                      <div key={proj.id} className="flex items-center justify-between p-3 bg-muted rounded">
                        <div className="flex-1">
                          <p className="font-medium">{proj.title}</p>
                          <p className="text-sm text-muted-foreground">{proj.description.substring(0, 50)}...</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setEditingProject(proj)} className="gap-1"><Edit2 className="w-4 h-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteProject(proj.id)} className="gap-1"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Skills Section */}
            <Card>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Skills</h2>
                {getFieldError('skills') && <p className="text-sm text-red-500">{getFieldError('skills')}</p>}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill (e.g., React, Python)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="cursor-pointer hover:opacity-80 gap-1 py-1 px-2">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-1">×</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">Cancel</Button>
              <Button onClick={saveResume} disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save Resume'}
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="sticky top-8 h-fit">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
