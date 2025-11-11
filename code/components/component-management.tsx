"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseClient } from "@/lib/supabase"

interface Component {
  id: string
  name: string
  description: string
  total_quantity: number
  available_quantity: number
}

export function ComponentManagement() {
  const [components, setComponents] = useState<Component[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    total_quantity: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchComponents = async () => {
      const { data } = await supabase.from("components").select("*")
      setComponents(data || [])
      setLoading(false)
    }

    fetchComponents()
  }, [supabase])

  const handleAddComponent = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    try {
      if (editingId) {
        // Update component
        const { error } = await supabase
          .from("components")
          .update({
            name: formData.name,
            description: formData.description,
            total_quantity: Number.parseInt(formData.total_quantity),
            available_quantity: Number.parseInt(formData.total_quantity),
          })
          .eq("id", editingId)

        if (error) throw error

        setComponents(
          components.map((c) =>
            c.id === editingId
              ? {
                  ...c,
                  name: formData.name,
                  description: formData.description,
                  total_quantity: Number.parseInt(formData.total_quantity),
                  available_quantity: Number.parseInt(formData.total_quantity),
                }
              : c,
          ),
        )
        setMessage("Component updated successfully!")
        setEditingId(null)
      } else {
        // Add new component
        const { data, error } = await supabase
          .from("components")
          .insert([
            {
              name: formData.name,
              description: formData.description,
              total_quantity: Number.parseInt(formData.total_quantity),
              available_quantity: Number.parseInt(formData.total_quantity),
            },
          ])
          .select()

        if (error) throw error

        if (data) {
          setComponents([...components, data[0]])
          setMessage("Component added successfully!")
        }
      }

      setFormData({ name: "", description: "", total_quantity: "" })
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error processing component")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this component?")) return

    try {
      const { error } = await supabase.from("components").delete().eq("id", id)

      if (error) throw error

      setComponents(components.filter((c) => c.id !== id))
      setMessage("Component deleted successfully!")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error deleting component")
    }
  }

  const handleEdit = (component: Component) => {
    setEditingId(component.id)
    setFormData({
      name: component.name,
      description: component.description,
      total_quantity: component.total_quantity.toString(),
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: "", description: "", total_quantity: "" })
  }

  if (loading) return <div>Loading components...</div>

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? "Edit Component" : "Add New Component"}</h2>

        <form onSubmit={handleAddComponent} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Component Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Arduino Uno"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Component description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Quantity</label>
            <Input
              type="number"
              value={formData.total_quantity}
              onChange={(e) => setFormData({ ...formData, total_quantity: e.target.value })}
              placeholder="10"
              min="1"
              required
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg ${message.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
            >
              {message}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingId ? "Update Component" : "Add Component"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Component Inventory</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Component</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Available</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {components.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{comp.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{comp.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{comp.total_quantity}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                      {comp.available_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(comp)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => handleDelete(comp.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {components.length === 0 && (
          <div className="text-center py-8 text-gray-500">No components yet. Add your first component above.</div>
        )}
      </Card>
    </div>
  )
}
