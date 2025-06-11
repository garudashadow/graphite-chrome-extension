'use client'

import { Company } from '@/types/database'
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  Calendar,
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface CompanyDetailProps {
  company: Company
  onClose: () => void
  onEdit: () => void
}

export default function CompanyDetail({ company, onClose, onEdit }: CompanyDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Detail Perusahaan</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit Perusahaan"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <div className="flex items-center space-x-4">
                {company.business_type && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {company.business_type}
                  </span>
                )}
                <div className="flex items-center">
                  {company.is_active ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    company.is_active ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {company.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {company.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Deskripsi</h3>
              <p className="text-gray-700 leading-relaxed">{company.description}</p>
            </div>
          )}

          {/* Location Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Informasi Lokasi</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900">{company.address}</p>
                  <div className="text-sm text-gray-600 mt-1">
                    {company.village && <span>{company.village}, </span>}
                    {company.sub_district && <span>Kec. {company.sub_district}, </span>}
                    <span>{company.district}</span>
                    {company.postal_code && <span> {company.postal_code}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Informasi Kontak</h3>
            <div className="space-y-3">
              {company.phone && (
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <a 
                    href={`tel:${company.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {company.phone}
                  </a>
                </div>
              )}

              {company.email && (
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <a 
                    href={`mailto:${company.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {company.email}
                  </a>
                </div>
              )}

              {company.website && (
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <a 
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Company Information */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Informasi Perusahaan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.established_year && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Tahun Didirikan</p>
                    <p className="font-medium text-gray-900">{company.established_year}</p>
                  </div>
                </div>
              )}

              {company.employee_count && (
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Jumlah Karyawan</p>
                    <p className="font-medium text-gray-900">{company.employee_count} orang</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium">Dibuat pada:</p>
                <p>{new Date(company.created_at).toLocaleString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <p className="font-medium">Terakhir diupdate:</p>
                <p>{new Date(company.updated_at).toLocaleString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={onEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Perusahaan
          </button>
        </div>
      </div>
    </div>
  )
}

