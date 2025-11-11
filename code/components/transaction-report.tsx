"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase"

interface TransactionRecord {
  id: string
  studentName: string
  studentEmail: string
  componentName: string
  quantity: number
  status: string
  requestDate: string
  returnDate: string
}

export function TransactionReport() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchTransactions = async () => {
      // Fetch all requests with related data
      const { data: requestsData } = await supabase.from("requests").select("*")
      const { data: componentsData } = await supabase.from("components").select("*")
      const { data: usersData } = await supabase.from("users").select("*")

      // Build maps
      const componentMap: Record<string, string> = {}
      componentsData?.forEach((c) => {
        componentMap[c.id] = c.name
      })

      const userMap: Record<string, { name: string; email: string }> = {}
      usersData?.forEach((u) => {
        userMap[u.id] = { name: u.name, email: u.email }
      })

      // Build transactions
      const txns: TransactionRecord[] =
        requestsData?.map((req) => ({
          id: req.id,
          studentName: userMap[req.student_id]?.name || "Unknown",
          studentEmail: userMap[req.student_id]?.email || "Unknown",
          componentName: componentMap[req.component_id] || "Unknown",
          quantity: req.quantity,
          status: req.status,
          requestDate: new Date(req.request_date).toLocaleDateString(),
          returnDate: req.return_date || "Pending",
        })) || []

      setTransactions(txns)
      setLoading(false)
    }

    fetchTransactions()
  }, [supabase])

  const exportToCSV = () => {
    const headers = ["Student Name", "Email", "Component", "Quantity", "Status", "Request Date", "Return Date"]

    const csv = [
      headers.join(","),
      ...transactions.map((t) =>
        [t.studentName, t.studentEmail, t.componentName, t.quantity, t.status, t.requestDate, t.returnDate].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `component-report-${new Date().toISOString()}.csv`
    a.click()
  }

  if (loading) return <div>Loading transactions...</div>

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Transaction Report</h2>
        <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700">
          Export as CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Component</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Request Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Return Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  <div className="font-semibold text-gray-900">{txn.studentName}</div>
                  <div className="text-xs text-gray-500">{txn.studentEmail}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{txn.componentName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{txn.quantity}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      txn.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : txn.status === "Requested"
                          ? "bg-yellow-100 text-yellow-800"
                          : txn.status === "Returned"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{txn.requestDate}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{txn.returnDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && <div className="text-center py-8 text-gray-500">No transactions yet.</div>}
    </Card>
  )
}
