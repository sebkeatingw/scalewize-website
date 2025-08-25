'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createLinkedInService } from '@/lib/linkedin-service'
import { Users, MessageSquare, TrendingUp, Calendar, Filter, Plus, Search } from 'lucide-react'

export default function LinkedInPage() {
  const { organization, user, profile } = useAuth()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const linkedinService = organization ? createLinkedInService(organization.id) : null

  useEffect(() => {
    if (linkedinService && organization) {
      loadLinkedInData()
    } else {
      setLoading(false)
    }
  }, [organization?.id, selectedStatus])

  const loadLinkedInData = async () => {
    if (!linkedinService) return

    setLoading(true)
    try {
      const leadsData = await linkedinService.getLeads(selectedStatus)
      setLeads(leadsData)
    } catch (error) {
      console.error('Error loading LinkedIn data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'SENT': 'bg-blue-100 text-blue-800',
      'CONNECTED': 'bg-green-100 text-green-800',
      'RESPONDED': 'bg-purple-100 text-purple-800',
      'ACTIVE': 'bg-indigo-100 text-indigo-800',
      'BOOKED': 'bg-emerald-100 text-emerald-800',
      'CLOSED': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LinkedIn Sales</h1>
            <p className="text-gray-600 mt-1">
              Manage your LinkedIn leads and sales pipeline
            </p>
          </div>
          <button className="bg-[#595F39] text-white px-4 py-2 rounded-lg hover:bg-[#4a5230] transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Overview */}
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
                    {leads.length}
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
                    Connected
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {leads.filter(lead => lead.status === 'CONNECTED').length}
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
                    {leads.length > 0 
                      ? Math.round((leads.filter(lead => lead.status === 'RESPONDED').length / leads.length) * 100) 
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
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Pipeline
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {leads.filter(lead => ['ACTIVE', 'RESPONDED'].includes(lead.status)).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#595F39] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#595F39] focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="SENT">Sent</option>
              <option value="CONNECTED">Connected</option>
              <option value="RESPONDED">Responded</option>
              <option value="ACTIVE">Active</option>
              <option value="BOOKED">Booked</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">LinkedIn Leads</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.full_name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">{lead.email || 'No email'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.company || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{lead.title || 'No title'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.last_contact_at 
                        ? new Date(lead.last_contact_at).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#595F39] hover:text-[#4a5230] mr-3">
                        View
                      </button>
                      <button className="text-[#595F39] hover:text-[#4a5230]">
                        Message
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900 mb-2">No leads found</p>
                    <p className="text-gray-600">
                      {selectedStatus === 'all' 
                        ? 'Start building your LinkedIn sales pipeline by adding your first lead.'
                        : `No leads with status "${selectedStatus}" found.`
                      }
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced LinkedIn Features Coming Soon</h3>
          <p className="text-gray-600">
            We're working on adding automated messaging, campaign management, 
            and advanced analytics to supercharge your LinkedIn sales.
          </p>
        </div>
      </div>
    </div>
  )
} 