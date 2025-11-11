"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase"
import { sendEmailNotification } from "@/lib/email-service"

interface Request {
  id: string
  student_id: string
  component_id: string
  quantity: number
  status: string
  return_date: string
  reason: string
}

interface StudentInfo {
  [key: string]: { name: string; email: string }
}

export function RequestsManagement() {
  const [requests, setRequests] = useState<Request[]>([])
  const [components, setComponents] = useState<Record<string, string>>({})
  const [students, setStudents] = useState<StudentInfo>({})
  const [filter, setFilter] = useState<"all" | "Requested" | "Approved" | "Returned">("all")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchData = async () => {
      // Fetch requests
      const { data: requestsData } = await supabase.from("requests").select("*")
      setRequests(requestsData || [])

      // Fetch components
      const { data: componentsData } = await supabase.from("components").select("id, name")
      const componentMap: Record<string, string> = {}
      componentsData?.forEach((comp) => {
        componentMap[comp.id] = comp.name
      })
      setComponents(componentMap)

      // Fetch students
      const { data: studentsData } = await supabase.from("users").select("id, name, email")
      const studentMap: StudentInfo = {}
      studentsData?.forEach((student) => {
        studentMap[student.id] = { name: student.name, email: student.email }
      })
      setStudents(studentMap)

      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const handleApprove = async (requestId: string) => {
    setActionLoading(requestId)
    setMessage("")
    try {
      const request = requests.find((r) => r.id === requestId)
      if (!request) throw new Error("Request not found")

      const studentInfo = students[request.student_id]
      const componentName = components[request.component_id]

      await sendEmailNotification(studentInfo.email, "approved", {
        componentName,
        quantity: request.quantity,
        mentorName: "Mentor",
      })

      const { error } = await supabase.from("requests").update({ status: "Approved" }).eq("id", requestId)

      if (error) throw error

      setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: "Approved" } : r)))
      setMessage("Request approved and email sent!")
    } catch (err) {
      console.error("Error approving request:", err)
      setMessage(err instanceof Error ? err.message : "Error approving request")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId)
    setMessage("")
    try {
      const request = requests.find((r) => r.id === requestId)
      if (!request) throw new Error("Request not found")

      const studentInfo = students[request.student_id]
      const componentName = components[request.component_id]

      await sendEmailNotification(studentInfo.email, "rejected", {
        componentName,
        quantity: request.quantity,
        mentorName: "Mentor",
      })

      const { error } = await supabase.from("requests").update({ status: "Rejected" }).eq("id", requestId)

      if (error) throw error

      setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: "Rejected" } : r)))
      setMessage("Request rejected and email sent!")
    } catch (err) {
      console.error("Error rejecting request:", err)
      setMessage(err instanceof Error ? err.message : "Error rejecting request")
    } finally {
      setActionLoading(null)
    }
  }

  const handleMarkReturned = async (requestId: string) => {
    setActionLoading(requestId)
    setMessage("")
    try {
      const request = requests.find((r) => r.id === requestId)
      if (!request) throw new Error("Request not found")

      const studentInfo = students[request.student_id]
      const componentName = components[request.component_id]

      await sendEmailNotification(studentInfo.email, "returned", {
        componentName,
        quantity: request.quantity,
      })

      const { error } = await supabase.from("requests").update({ status: "Returned" }).eq("id", requestId)

      if (error) throw error

      setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: "Returned" } : r)))
      setMessage("Request marked as returned and email sent!")
    } catch (err) {
      console.error("Error marking returned:", err)
      setMessage(err instanceof Error ? err.message : "Error marking returned")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredRequests = filter === "all" ? requests : requests.filter((r) => r.status === filter)

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

  if (loading) return <div>Loading requests...</div>

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Requests</h2>
        <div className="flex gap-2">
          {(["all", "Requested", "Approved", "Returned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded text-sm font-medium transition ${
                filter === f ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg mb-4 ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
        >
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Component</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Return Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  <div className="font-semibold text-gray-900">{students[request.student_id]?.name || "Unknown"}</div>
                  <div className="text-xs text-gray-500">{students[request.student_id]?.email || ""}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{components[request.component_id] || "Unknown"}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{request.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {request.reason || "No reason provided"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{request.return_date || "Not set"}</td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  {request.status === "Requested" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading === request.id}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request.id)}
                        disabled={actionLoading === request.id}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {request.status === "Approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkReturned(request.id)}
                      disabled={actionLoading === request.id}
                    >
                      Mark Returned
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRequests.length === 0 && <div className="text-center py-8 text-gray-500">No requests found.</div>}
    </Card>
  )
}
