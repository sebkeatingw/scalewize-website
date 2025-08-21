'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquare, Users, Zap, Clock, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { profile, organization } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [organization?.id])

  const stats = [
    { name: 'Connection Rate', value: '0%', change: '+0%', changeType: 'positive', icon: Users },
    { name: 'Response Rate', value: '0%', change: '+0%', changeType: 'positive', icon: MessageSquare },
    { name: 'Active Conversations', value: '0', change: '+0', changeType: 'positive', icon: TrendingUp },
    { name: 'Avg Response Time', value: '0 days', change: '-0 day', changeType: 'positive', icon: Clock },
  ]

  const usagePercentage = organization ? Math.round((0 / organization.monthly_token_limit) * 100) : 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.full_name || 'User'}!</h1>
        <p className="text-gray-600 mt-1">Your AI assistant is ready to help with {organization?.name}'s automation needs.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Monthly Usage</h3>
          <span className="text-sm text-gray-500">0 / {organization?.monthly_token_limit?.toLocaleString()} tokens</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`h-2 rounded-full ${usagePercentage > 80 ? 'bg-red-500' : usagePercentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(usagePercentage, 100)}%` }} />
        </div>
        <p className="text-sm text-gray-600 mt-2">{usagePercentage}% of your monthly limit used</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">AI Chatbot</h3>
            <p className="text-sm text-gray-600">Your custom AI assistant connected to your business systems and databases.</p>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Preview of your AI Chatbot</p>
                <Link href="/dashboard/chatbot" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Open Chatbot</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">LinkedIn Sales Agent</h3>
            <p className="text-sm text-gray-600">Automated lead identification and outreach on LinkedIn.</p>
          </div>
          <div className="p-6">
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">LinkedIn Sales Dashboard</p>
                <Link href="/dashboard/linkedin" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">View Leads</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


