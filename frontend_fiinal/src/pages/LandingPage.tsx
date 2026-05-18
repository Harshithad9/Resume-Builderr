import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { FileText, ArrowRight, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ResumePro</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Build Your Resume in Minutes
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create a professional resume that stands out. Choose from beautiful templates, get instant feedback, and land your dream job.
            </p>

            <div className="space-y-4 mb-8">
              {[
                'Professional templates',
                'Real-time preview',
                'PDF download',
                'Easy editing',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image/Mockup */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-8 shadow-lg">
            <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
              <div className="bg-blue-600 h-8 w-32 rounded"></div>
              <div className="space-y-3">
                <div className="bg-gray-200 h-4 w-full rounded"></div>
                <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
                <div className="bg-gray-200 h-4 w-4/5 rounded"></div>
              </div>
              <div className="pt-4 space-y-3 border-t border-gray-200">
                <div className="bg-gray-200 h-4 w-48 rounded"></div>
                <div className="bg-gray-200 h-4 w-full rounded"></div>
                <div className="bg-gray-200 h-4 w-full rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            {
              title: 'Easy to Use',
              description: 'Intuitive interface makes creating a resume simple and fast.',
            },
            {
              title: 'Smart Resume Builder',
              description: 'Create professional resumes with live preview and easy customization.',
            },
            {
              title: 'Instant PDF Download',
              description: 'Download your resume as PDF instantly and share anywhere.',
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
