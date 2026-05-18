import { Download, Printer } from 'lucide-react'
import { Button } from './ui/button'

const ResumePreview = ({ resume }) => {
  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('resume-preview')
      if (!element) {
        alert('Resume content not found')
        return
      }

      const html2pdf = window.html2pdf
      if (!html2pdf) {
        alert('PDF library not loaded. Please wait and try again.')
        return
      }

      const element_copy = element.cloneNode(true)
      element_copy.style.width = '8.5in'
      element_copy.style.height = 'auto'
      
      const options = {
        margin: 10,
        filename: `${resume.fullName || 'Resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
        pagebreak: { mode: ['css', 'legacy'] }
      }

      html2pdf().set(options).from(element_copy).save()
    } catch (error) {
      console.error('PDF download error:', error)
      alert('Failed to download PDF. Please try again.')
    }
  }

  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const month = d.toLocaleString('en-US', { month: 'short' })
    const year = d.getFullYear()
    return `${month} ${year}`
  }

  const getDateRange = (startDate, endDate, current) => {
    const start = formatDate(startDate)
    const end = current ? 'Present' : formatDate(endDate)
    return `${start} - ${end}`
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handleDownloadPDF} size="sm" className="flex-1 gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button onClick={() => window.print()} size="sm" variant="outline" className="flex-1 gap-2">
          <Printer className="w-4 h-4" />
          Print
        </Button>
      </div>

      <div
        id="resume-preview"
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        style={{
          minHeight: '11in',
          width: '8.5in',
          color: '#000',
          margin: '0 auto',
          padding: '40px 32px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '11px',
          lineHeight: '1.5',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ borderBottom: '2px solid rgb(37, 99, 235)', paddingBottom: '16px', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            {resume.fullName || 'Your Name'}
          </h1>
          <div style={{ fontSize: '10px', color: '#666', display: 'flex', gap: '16px', flexWrap: 'wrap', margin: '4px 0' }}>
            {resume.email && <span>{resume.email}</span>}
            {resume.phone && <span>{resume.phone}</span>}
            {resume.location && <span>{resume.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {resume.summary && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px 0', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
              PROFESSIONAL SUMMARY
            </h2>
            <p style={{ fontSize: '10px', margin: '0', color: '#333' }}>
              {resume.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px 0', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
              EXPERIENCE
            </h2>
            <div style={{ marginTop: '6px' }}>
              {resume.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{exp.position}</div>
                    <div style={{ fontSize: '9px', color: '#666' }}>{getDateRange(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                  <div style={{ fontSize: '9px', color: '#666', marginBottom: '2px' }}>{exp.company}</div>
                  <div style={{ fontSize: '9px', color: '#333', whiteSpace: 'pre-wrap' }}>{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px 0', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
              EDUCATION
            </h2>
            <div style={{ marginTop: '6px' }}>
              {resume.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>{edu.school}</div>
                    <div style={{ fontSize: '9px', color: '#666' }}>{getDateRange(edu.startDate, edu.endDate, edu.current)}</div>
                  </div>
                  <div style={{ fontSize: '9px', color: '#333' }}>
                    {edu.degree} in {edu.field}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px 0', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
              PROJECTS
            </h2>
            <div style={{ marginTop: '6px' }}>
              {resume.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '10px', marginBottom: '2px' }}>
                    {proj.title}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '4px', color: '#0066cc', textDecoration: 'none', fontSize: '9px' }}>
                        (Link)
                      </a>
                    )}
                  </div>
                  <div style={{ fontSize: '9px', color: '#333', marginBottom: '2px' }}>
                    {proj.description}
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div style={{ fontSize: '8px', color: '#666' }}>
                      <strong>Tech:</strong> {proj.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: '12px', fontWeight: 'bold', margin: '0 0 6px 0', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
              SKILLS
            </h2>
            <div style={{ fontSize: '9px', color: '#333', marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {resume.skills.map((skill, idx) => (
                <span key={idx} style={{ display: 'inline-block', backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumePreview
