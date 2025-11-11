import { LoginForm } from "@/components/login-form"

export default function StudentLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="text-4xl mb-2">👨‍🎓</div>
        <h1 className="text-2xl font-bold text-gray-900">Component Request System</h1>
      </div>
      <LoginForm role="student" />
      <a href="/" className="mt-6 text-blue-600 hover:underline">
        Back to home
      </a>
    </div>
  )
}
