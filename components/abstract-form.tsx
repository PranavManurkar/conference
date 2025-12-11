"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function AbstractForm() {
  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    affiliation: "",
    country: "",
    phoneNumber: "",
    abstract: "",
    keywords: "",
    theme: "",
    presentationType: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.title.trim() || !formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.abstract.trim().length < 100 || formData.abstract.trim().length > 250) {
      setError("Abstract must be between 100-250 words")
      return
    }

    try {
      // Simulate form submission - In production, this would send to your backend
      console.log("[v0] Submitting form:", formData)

      // Here you would typically send the data to your backend API
      // const response = await fetch('/api/submit-abstract', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })

      setSubmitted(true)
      setFormData({
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        affiliation: "",
        country: "",
        phoneNumber: "",
        abstract: "",
        keywords: "",
        theme: "",
        presentationType: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError("Failed to submit abstract. Please try again.")
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-green-900 font-bold text-lg mb-2">Submission Successful!</h3>
        <p className="text-green-800">
          Your abstract has been submitted successfully. You will receive a confirmation email shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-900 font-semibold">{error}</p>
        </div>
      )}

      {/* Paper Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Paper Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter your paper title"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
      </div>

      {/* Author Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Last Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>
      </div>

      {/* Email and Phone */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Affiliation and Country */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Affiliation <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="affiliation"
            value={formData.affiliation}
            onChange={handleChange}
            placeholder="University/Organization"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Country <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>
      </div>

      {/* Conference Theme */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Select Theme <span className="text-red-600">*</span>
        </label>
        <select
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        >
          <option value="">Choose a theme...</option>
          <option value="2d-materials">Science & Engineering of 2D materials</option>
          <option value="characterization">Advanced Characterization Techniques</option>
          <option value="energy">Energy Applications of 2D materials</option>
          <option value="emerging">2D Materials in Emerging Technologies</option>
        </select>
      </div>

      {/* Presentation Type */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Preferred Presentation Type <span className="text-red-600">*</span>
        </label>
        <select
          name="presentationType"
          value={formData.presentationType}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        >
          <option value="">Choose presentation type...</option>
          <option value="oral">Oral Presentation</option>
          <option value="poster">Poster Presentation</option>
          <option value="either">Either (Committee will decide)</option>
        </select>
      </div>

      {/* Abstract */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Abstract (100-250 words) <span className="text-red-600">*</span>
        </label>
        <textarea
          name="abstract"
          value={formData.abstract}
          onChange={handleChange}
          placeholder="Enter your abstract here..."
          rows={6}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          required
        />
        <p className="text-sm text-slate-500 mt-1">
          Word count: {formData.abstract.trim().split(/\s+/).filter(Boolean).length}
        </p>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Keywords</label>
        <input
          type="text"
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          placeholder="Enter keywords separated by commas"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Submit Abstract
      </Button>
    </form>
  )
}
