'use client'

import { useState } from 'react'
import { useCompanies } from '@/hooks/useCompanies'
import { Company } from '@/types/database'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import CompanyForm from './CompanyForm'
import CompanyDetail from './CompanyDetail'

export default function CompanyList() {
  const { 
    companies, 
    loading, 
    error, 
    searchCompanies, 
    filterByBusinessType, 
    filterBySubDistrict,
    fetchCompanies,
    deleteCompany 
  } = useCompanies()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBusinessType, setSelectedBusinessType] = useState('')
  const [selectedSubDistrict, setSelectedSubDistrict] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null)

  // Get unique business types and sub districts for filters
  const businessTypes = [...new Set(companies.map(c => c.business_type).filter(Boolean))]
  const subDistricts = [...new Set(companies.map(c => c.sub_district).filter(Boolean))]

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      await searchCompanies(query)
    } else {
      await fetchCompanies()
    }
  }

  const handleBusinessTypeFilter = async (type: string) => {
    setSelectedBusinessType(type)
    if (type) {
      await filterByBusinessType(type)
    } else {
      await fetchCompanies()
    }
  }

  const handleSubDistrictFilter = async (district: string) => {
    setSelectedSubDistrict(district)
    if (district) {
      await filterBySubDistrict(district)
    } else {
      await fetchCompanies()
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus perusahaan ini?')) {
      await deleteCompany(id)
    }
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setShowForm(true)
  }

  const handleView = (company: Company) => {
    setViewingCompany(company)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCompany(null)
    fetchCompanies()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={fetchCompanies}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Database Perusahaan</h1>
          <p className="text-gray-600">Bekasi Kabupaten</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Perusahaan
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari nama, alamat, atau jenis usaha..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={selectedBusinessType}
          onChange={(e) => handleBusinessTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Jenis Usaha</option>
          {businessTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={selectedSubDistrict}
          onChange={(e) => handleSubDistrictFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Kecamatan</option>
          {subDistricts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{company.name}</h3>
                  {company.business_type && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {company.business_type}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleView(company)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Lihat Detail"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(company)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{company.address}</span>
              </div>
              
              {company.sub_district && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Kec. {company.sub_district}</span>
                </div>
              )}

              {company.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{company.phone}</span>
                </div>
              )}

              {company.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{company.email}</span>
                </div>
              )}

              {company.website && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {company.website}
                  </a>
                </div>
              )}

              {company.employee_count && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{company.employee_count} karyawan</span>
                </div>
              )}

              {company.established_year && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Didirikan {company.established_year}</span>
                </div>
              )}
            </div>

            {company.description && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 line-clamp-2">{company.description}</p>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  company.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {company.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(company.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada perusahaan</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedBusinessType || selectedSubDistrict 
              ? 'Tidak ada perusahaan yang sesuai dengan filter yang dipilih.'
              : 'Belum ada perusahaan yang terdaftar.'
            }
          </p>
          {(searchQuery || selectedBusinessType || selectedSubDistrict) && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedBusinessType('')
                setSelectedSubDistrict('')
                fetchCompanies()
              }}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>
      )}

      {/* Company Form Modal */}
      {showForm && (
        <CompanyForm
          company={editingCompany}
          onClose={handleFormClose}
        />
      )}

      {/* Company Detail Modal */}
      {viewingCompany && (
        <CompanyDetail
          company={viewingCompany}
          onClose={() => setViewingCompany(null)}
          onEdit={() => {
            setEditingCompany(viewingCompany)
            setViewingCompany(null)
            setShowForm(true)
          }}
        />
      )}
    </div>
  )
}

