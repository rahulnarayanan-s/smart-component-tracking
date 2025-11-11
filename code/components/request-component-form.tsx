"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { sendEmailNotification } from "@/lib/email-service"

export function RequestComponentForm() {
  const [componentName, setComponentName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")
  const [dateNeeded, setDateNeeded] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { user } = useAuth()
  const supabase = getSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      if (!user) {
        setMessage("User not authenticated")
        return
      }

      // First, find the component ID
      const { data: component } = await supabase.from("components").select("id").eq("name", componentName).single()

      if (!component) {
        setMessage("Component not found")
        return
      }

      // Get user info
      const { data: userData } = await supabase.from("users").select("name, email").eq("id", user.id).single()

      // Create the request
      const { error } = await supabase.from("requests").insert([
        {
          student_id: user.id,
          component_id: component.id,
          quantity: Number.parseInt(quantity),
          reason,
          status: "Requested",
          return_date: returnDate,
        },
      ])

      if (error) throw error

      // Get all mentors
      const { data: mentorsData } = await supabase.from("users").select("email").eq("role", "mentor")

      // Send emails to all mentors
      if (mentorsData && mentorsData.length > 0) {
        for (const mentor of mentorsData) {
          try {
            await sendEmailNotification(mentor.email, "request", {
              studentName: userData?.name || "Unknown",
              studentEmail: userData?.email || "Unknown",
              componentName,
              quantity: Number.parseInt(quantity),
              reason,
            })
          } catch (emailErr) {
            console.error("Error sending email to mentor:", emailErr)
          }
        }
      }

      setMessage("Request submitted successfully! Mentors have been notified.")
      setComponentName("")
      setQuantity("")
      setReason("")
      setDateNeeded("")
      setReturnDate("")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error submitting request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Request a Component</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Component Name</label>
          <Input
            type="text"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value)}
            placeholder="e.g., Arduino Uno, Resistor"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="1"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Request</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you need this component..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Needed</label>
            <Input type="date" value={dateNeeded} onChange={(e) => setDateNeeded(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Return By Date</label>
            <Input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {message}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </Card>
  )
}
