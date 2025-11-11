"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AdminNavbar } from "@/components/admin-navbar"
import { ComponentManagement } from "@/components/component-management"
import { TransactionReport } from "@/components/transaction-report"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"components" | "reports">("components")

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
      <AdminNavbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage components and generate reports</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("components")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "components"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Manage Components
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "reports"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Reports
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "components" && <ComponentManagement />}
          {activeTab === "reports" && <TransactionReport />}
        </div>
      </main>
    </div>
  )
}
