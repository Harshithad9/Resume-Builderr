import { ExternalLink } from 'lucide-react'

interface ResumeData {
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

export default function ResumePreview({ data }: { data: ResumeData }) {
  const parseText = (text: string) => {
    return text.split('\n').map((line, idx) => (
      <div key={idx} className="text-sm text-gray-700">
        {line}
      </div>
    ))
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  return (
    <div
      id="resume-preview"
      className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto"
      style={{ minHeight: '11in', width: '8.5in', color: '#000' }}
    >
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {data.email && (
            <div>
              <span className="font-semibold">Email:</span> {data.email}
            </div>
          )}
          {data.phone && (
            <div>
              <span className="font-semibold">Phone:</span> {data.phone}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          {data.linkedin && isValidUrl(data.linkedin) && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            >
              LinkedIn <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {data.github && isValidUrl(data.github) && (
            <a
              href={data.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm flex items-center gap-1"
            >
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Experience */}
      {data.experience && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-200 pb-2">
            Experience
          </h2>
          <div className="space-y-2">{parseText(data.experience)}</div>
        </div>
      )}

      {/* Education */}
      {data.education && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-200 pb-2">
            Education
          </h2>
          <div className="space-y-2">{parseText(data.education)}</div>
        </div>
      )}

      {/* Skills */}
      {data.skills && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-200 pb-2">
            Skills
          </h2>
          <div className="space-y-2">{parseText(data.skills)}</div>
        </div>
      )}

      {/* Projects */}
      {data.projects && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-200 pb-2">
            Projects
          </h2>
          <div className="space-y-2">{parseText(data.projects)}</div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-200 pb-2">
            Certifications
          </h2>
          <div className="space-y-2">{parseText(data.certifications)}</div>
        </div>
      )}
    </div>
  )
}
