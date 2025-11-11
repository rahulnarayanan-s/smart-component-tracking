import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Smart Component Tracker</h1>
      </div>
      <RegisterForm />
      <a href="/" className="mt-6 text-blue-600 hover:underline">
        Back to home
      </a>
    </div>
  )
}
