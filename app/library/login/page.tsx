'use client'

import RoleSelector from '@/app/components/RoleSelector'
import { libraryLogin } from '@/app/library/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LibraryLoginPage() {
  const router = useRouter()

  const [role, setRole] = useState<'librarian' | 'customer'>('librarian')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      if (role === 'librarian') {
        const data = await libraryLogin(email, password)

        if (data.error) {
          setError(data.error)
        } else {
          // ✅ store exactly what dashboard expects
          localStorage.setItem(
            'library_session',
            JSON.stringify({
              access_token: data.session.access_token,
              user: data.user,
            })
          )

          router.push('/library/dashboard')
        }
      }

      if (role === 'customer') {
        router.push('/search')
      }
    } catch (err) {
      setError('Server error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0F172A]">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 text-white">
        <h1 className="text-2xl font-bold text-[#D4AF37] mb-2 text-center">
          Login to BookScavenger
        </h1>

        <p className="text-gray-400 text-sm mb-4 text-center">
          Choose how you want to continue
        </p>

        <RoleSelector role={role} setRole={setRole} />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800 border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800 border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{' '}
          <Link href="/library/signup" className="text-[#D4AF37]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
