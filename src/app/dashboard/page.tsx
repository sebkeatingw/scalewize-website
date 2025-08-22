'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquare, Users, Zap, Clock, TrendingUp, ArrowRight, BarChart3, Settings, Building2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const { profile, organization } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [organization?.id])

  const stats = [
    { 
      name: 'Connection Rate', 
      value: '0%', 
      change: '+0%', 
      changeType: 'positive', 
      icon: Users,
      color: 'blue',
      description: 'LinkedIn connection success rate'
    },
    { 
      name: 'Response Rate', 
      value: '0%', 
      change: '+0%', 
      changeType: 'positive', 
      icon: MessageSquare,
      color: 'green',
      description: 'Message response rate'
    },
    { 
      name: 'Active Conversations', 
      value: '0', 
      change: '+0', 
      changeType: 'positive', 
      icon: TrendingUp,
      color: 'purple',
      description: 'Ongoing conversations'
    },
    { 
      name: 'Avg Response Time', 
      value: '0 days', 
      change: '-0 day', 
      changeType: 'positive', 
      icon: Clock,
      color: 'orange',
      description: 'Average response time'
    },
  ]

  const quickActions = [
    {
      name: 'AI Chatbot',
      description: 'Your custom AI assistant connected to your business systems',
      icon: MessageSquare,
      href: '/dashboard/chatbot',
      color: 'blue',
      status: 'Active'
    },
    {
      name: 'LinkedIn Sales',
      description: 'Automated lead identification and outreach on LinkedIn',
      icon: Users,
      href: '/dashboard/linkedin',
      color: 'green',
      status: 'Ready'
    },
    {
      name: 'Analytics',
      description: 'View detailed performance metrics and insights',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'purple',
      status: 'Available'
    }
  ]

  const usagePercentage = organization ? Math.round((0 / organization.monthly_token_limit) * 100) : 0

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ backgroundColor: '#f0ede8' }}>
            <Building2 className="h-6 w-6" style={{ color: '#595F39' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name || 'User'}!</h1>
            <p className="text-gray-600">Your AI assistant is ready to help with {organization?.name}'s automation needs.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0ede8' }}>
                <Building2 className="h-5 w-5" style={{ color: '#595F39' }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Organization</p>
                <p className="text-lg font-semibold text-gray-900">{organization?.name}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0ede8' }}>
                <Settings className="h-5 w-5" style={{ color: '#595F39' }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Plan</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{organization?.plan_type}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0ede8' }}>
                <Users className="h-5 w-5" style={{ color: '#595F39' }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Role</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{profile?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'purple' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-900 mb-1">{stat.name}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0ede8' }}>
              <Zap className="h-5 w-5" style={{ color: '#595F39' }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Monthly Usage</h3>
              <p className="text-gray-600">Token consumption and limits</p>
            </div>
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            0 / {organization?.monthly_token_limit?.toLocaleString()} tokens
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                usagePercentage > 80 ? 'bg-red-500' : 
                usagePercentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
              }`} 
              style={{ width: `${Math.min(usagePercentage, 100)}%` }} 
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{usagePercentage}% of your monthly limit used</span>
            <span className="text-gray-900 font-medium">{organization?.monthly_token_limit?.toLocaleString()} tokens remaining</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0ede8' }}>
            <Zap className="h-4 w-4" style={{ color: '#595F39' }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <div key={action.name} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    action.color === 'blue' ? 'bg-blue-100' :
                    action.color === 'green' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    <action.icon className={`h-6 w-6 ${
                      action.color === 'blue' ? 'text-blue-600' :
                      action.color === 'green' ? 'text-green-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    action.status === 'Active' ? 'bg-green-100 text-green-700' :
                    action.status === 'Ready' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {action.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                
                <Link 
                  href={action.href}
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Open {action.name}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


