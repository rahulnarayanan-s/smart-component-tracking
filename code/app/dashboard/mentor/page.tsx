"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MentorNavbar } from "@/components/mentor-navbar"
import { RequestsManagement } from "@/components/requests-management"
import { ComponentStats } from "@/components/component-stats"

export default function MentorDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"manage" | "stats">("manage")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login/mentor")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <MentorNavbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
          <p className="text-gray-600 mt-2">Review and manage component requests</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "manage"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Manage Requests
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "stats"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "manage" && <RequestsManagement />}
          {activeTab === "stats" && <ComponentStats />}
        </div>
      </main>
    </div>
  )
}
