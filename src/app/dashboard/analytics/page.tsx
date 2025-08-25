'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createLinkedInService } from '@/lib/linkedin-service'
import { TrendingUp, Users, MessageSquare, Calendar, BarChart3, PieChart } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

export default function AnalyticsPage() {
  const { organization, user, profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)

  const linkedinService = organization ? createLinkedInService(organization.id) : null

  useEffect(() => {
    if (linkedinService && organization) {
      loadAnalytics()
    } else {
      setLoading(false)
    }
  }, [organization?.id])

  const loadAnalytics = async () => {
    if (!linkedinService) return

    setLoading(true)
    try {
      // Get leads data
      const leads = await linkedinService.getLeads()
      
      // Calculate basic metrics
      const totalLeads = leads.length
      const pendingLeads = leads.filter(lead => lead.status === 'PENDING').length
      const sentLeads = leads.filter(lead => lead.status === 'SENT').length
      const connectedLeads = leads.filter(lead => lead.status === 'CONNECTED').length
      const respondedLeads = leads.filter(lead => lead.status === 'RESPONDED').length
      const activeLeads = leads.filter(lead => lead.status === 'ACTIVE').length
      const bookedLeads = leads.filter(lead => lead.status === 'BOOKED').length
      const closedLeads = leads.filter(lead => lead.status === 'CLOSED').length

      setAnalytics({
        leads: {
          total: totalLeads,
          pending: pendingLeads,
          sent: sentLeads,
          connected: connectedLeads,
          responded: respondedLeads,
          active: activeLeads,
          booked: bookedLeads,
          closed: closedLeads
        }
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track performance across all your AI automation tools
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Leads
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {analytics?.leads?.total || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Connected Leads
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {analytics?.leads?.connected || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Response Rate
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {analytics?.leads?.total > 0 
                      ? Math.round((analytics.leads.responded / analytics.leads.total) * 100) 
                      : 0}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Leads
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {analytics?.leads?.active || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Status Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analytics?.leads?.pending || 0}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{analytics?.leads?.sent || 0}</div>
            <div className="text-sm text-gray-600">Sent</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analytics?.leads?.connected || 0}</div>
            <div className="text-sm text-gray-600">Connected</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{analytics?.leads?.responded || 0}</div>
            <div className="text-sm text-gray-600">Responded</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Connection Rate</span>
              <span className="font-semibold">
                {analytics?.leads?.total > 0 
                  ? Math.round((analytics.leads.connected / analytics.leads.total) * 100) 
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="font-semibold">
                {analytics?.leads?.total > 0 
                  ? Math.round((analytics.leads.responded / analytics.leads.total) * 100) 
                  : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Rate</span>
              <span className="font-semibold">
                {analytics?.leads?.total > 0 
                  ? Math.round((analytics.leads.active / analytics.leads.total) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Booked Leads</span>
              <span className="font-semibold text-green-600">{analytics?.leads?.booked || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Closed Leads</span>
              <span className="font-semibold text-gray-600">{analytics?.leads?.closed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="font-semibold">
                {analytics?.leads?.total > 0 
                  ? Math.round(((analytics.leads.booked + analytics.leads.closed) / analytics.leads.total) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Enhanced Analytics Coming Soon</h3>
          <p className="text-gray-600">
            We're working on adding more detailed analytics including chatbot performance, 
            token usage, and advanced LinkedIn insights.
          </p>
        </div>
      </div>
    </div>
  )
} 