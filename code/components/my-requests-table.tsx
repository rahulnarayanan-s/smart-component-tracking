"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

interface Request {
  id: string
  component_id: string
  quantity: number
  status: string
  return_date: string
  request_date: string
}

export function MyRequestsTable() {
  const [requests, setRequests] = useState<Request[]>([])
  const [components, setComponents] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return

      const { data: requestsData } = await supabase
        .from("requests")
        .select("*")
        .eq("student_id", user.id)
        .order("request_date", { ascending: false })

      setRequests(requestsData || [])

      // Fetch component names
      const { data: componentsData } = await supabase.from("components").select("id, name")

      const componentMap: Record<string, string> = {}
      componentsData?.forEach((comp) => {
        componentMap[comp.id] = comp.name
      })
      setComponents(componentMap)
      setLoading(false)
    }

    fetchRequests()

    const channel = supabase
      .channel(`requests:user_${user?.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
          filter: `student_id=eq.${user?.id}`,
        },
        () => {
          fetchRequests()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  const handleReturnComponent = async (requestId: string) => {
    setActionLoading(requestId)
    setMessage("")

    try {
      const { error } = await supabase.from("requests").update({ status: "Returned" }).eq("id", requestId)

      if (error) throw error

      setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: "Returned" } : r)))
      setMessage("Component marked as returned successfully!")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error returning component")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Requested":
        return "bg-yellow-100 text-yellow-800"
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Returned":
        return "bg-gray-100 text-gray-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Requested":
        return "⏳"
      case "Approved":
        return "✅"
      case "Returned":
        return "📦"
      case "Rejected":
        return "❌"
      default:
        return "❓"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) return <div>Loading requests...</div>

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h2>

      {message && (
        <div
          className={`p-3 rounded-lg mb-4 ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Component</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Requested</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Return Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {components[request.component_id] || "Unknown"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{request.quantity}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${getStatusColor(request.status)}`}
                  >
                    <span>{getStatusIcon(request.status)}</span>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{formatDate(request.request_date)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {request.return_date ? formatDate(request.return_date) : "Not set"}
                </td>
                <td className="px-6 py-4 text-sm">
                  {request.status === "Approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReturnComponent(request.id)}
                      disabled={actionLoading === request.id}
                      className="hover:bg-blue-50"
                    >
                      {actionLoading === request.id ? "Returning..." : "Return Component"}
                    </Button>
                  )}
                  {request.status === "Rejected" && <span className="text-gray-500 text-xs">No action available</span>}
                  {request.status === "Returned" && <span className="text-gray-500 text-xs">Completed</span>}
                  {request.status === "Requested" && <span className="text-gray-500 text-xs">Awaiting approval</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <div className="text-center py-8 text-gray-500">No requests yet. Start by requesting a component!</div>
      )}

      {/* Request Summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {requests.filter((r) => r.status === "Requested").length}
          </p>
        </Card>
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">{requests.filter((r) => r.status === "Approved").length}</p>
        </Card>
        <Card className="p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-600">Returned</p>
          <p className="text-2xl font-bold text-blue-600">{requests.filter((r) => r.status === "Returned").length}</p>
        </Card>
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{requests.filter((r) => r.status === "Rejected").length}</p>
        </Card>
      </div>
    </Card>
  )
}
