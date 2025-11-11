"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-600">Smart Component Tracker</div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-20">
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Smart Component Tracker</h1>
          <p className="text-xl text-gray-600 mb-8">
            Track, request, and return lab components efficiently. Designed for students and mentors.
          </p>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mb-16">
          <div className="text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900">Component Catalog</h3>
            <p className="text-gray-600 mt-2">Browse available electronic components</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">👨‍🎓</div>
            <h3 className="text-lg font-semibold text-gray-900">Student Dashboard</h3>
            <p className="text-gray-600 mt-2">Request and track your components</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">👨‍🏫</div>
            <h3 className="text-lg font-semibold text-gray-900">Mentor Controls</h3>
            <p className="text-gray-600 mt-2">Approve and manage requests</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/login/student">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Login as Student
            </Button>
          </Link>
          <Link href="/login/mentor">
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Login as Mentor
            </Button>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-gray-600">
          <p>
            New user?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-semibold">
              Create an account here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
