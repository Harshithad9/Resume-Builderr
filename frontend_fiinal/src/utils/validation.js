export const validateResume = (resume) => {
  const errors = []

  // Required fields
  if (!resume.fullName?.trim()) {
    errors.push({
      field: 'fullName',
      message: 'Full name is required'
    })
  }

  if (!resume.email?.trim()) {
    errors.push({
      field: 'email',
      message: 'Email is required'
    })
  } else if (!isValidEmail(resume.email)) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address'
    })
  }

  if (!resume.phone?.trim()) {
    errors.push({
      field: 'phone',
      message: 'Phone number is required'
    })
  }

  // Education validation
  if (!resume.education || resume.education.length === 0) {
    errors.push({
      field: 'education',
      message: 'Add at least one education entry'
    })
  } else {
    resume.education.forEach((edu, idx) => {
      if (!edu.school?.trim()) {
        errors.push({
          field: `education.${idx}.school`,
          message: `Education ${idx + 1}: School name is required`
        })
      }
      if (!edu.degree?.trim()) {
        errors.push({
          field: `education.${idx}.degree`,
          message: `Education ${idx + 1}: Degree is required`
        })
      }
      if (edu.startDate && edu.endDate && !edu.current) {
        if (new Date(edu.startDate) > new Date(edu.endDate)) {
          errors.push({
            field: `education.${idx}.dates`,
            message: `Education ${idx + 1}: End date must be after start date`
          })
        }
      }
    })
  }

  // Experience validation
  if (!resume.experience || resume.experience.length === 0) {
    errors.push({
      field: 'experience',
      message: 'Add at least one experience entry'
    })
  } else {
    resume.experience.forEach((exp, idx) => {
      if (!exp.company?.trim()) {
        errors.push({
          field: `experience.${idx}.company`,
          message: `Experience ${idx + 1}: Company name is required`
        })
      }
      if (!exp.position?.trim()) {
        errors.push({
          field: `experience.${idx}.position`,
          message: `Experience ${idx + 1}: Position is required`
        })
      }
      if (exp.startDate && exp.endDate && !exp.current) {
        if (new Date(exp.startDate) > new Date(exp.endDate)) {
          errors.push({
            field: `experience.${idx}.dates`,
            message: `Experience ${idx + 1}: End date must be after start date`
          })
        }
      }
    })
  }

  // Projects validation
  if (!resume.projects || resume.projects.length === 0) {
    errors.push({
      field: 'projects',
      message: 'Add at least one project'
    })
  } else {
    resume.projects.forEach((proj, idx) => {
      if (!proj.title?.trim()) {
        errors.push({
          field: `projects.${idx}.title`,
          message: `Project ${idx + 1}: Title is required`
        })
      }
      if (!proj.description?.trim()) {
        errors.push({
          field: `projects.${idx}.description`,
          message: `Project ${idx + 1}: Description is required`
        })
      }
    })
  }

  // Skills validation
  if (!resume.skills || resume.skills.length < 3) {
    errors.push({
      field: 'skills',
      message: `Add at least 3 skills (you have ${resume.skills?.length || 0})`
    })
  }

  return errors
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const getErrorMessage = (errors, field) => {
  return errors.find(e => e.field === field)?.message
}

export const hasFieldError = (errors, field) => {
  return errors.some(e => e.field === field)
}
