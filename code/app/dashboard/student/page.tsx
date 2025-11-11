"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { StudentNavbar } from "@/components/student-navbar"
import { RequestComponentForm } from "@/components/request-component-form"
import { MyRequestsTable } from "@/components/my-requests-table"
import { ComponentCatalog } from "@/components/component-catalog"

export default function StudentDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"request" | "requests" | "catalog">("request")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login/student")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">Request and track your lab components</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("request")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "request"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Request Component
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "requests"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            My Requests
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "catalog"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Component Catalog
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "request" && <RequestComponentForm />}
          {activeTab === "requests" && <MyRequestsTable />}
          {activeTab === "catalog" && <ComponentCatalog />}
        </div>
      </main>
    </div>
  )
}
