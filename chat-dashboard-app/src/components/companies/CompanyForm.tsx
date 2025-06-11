'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Building2, Save } from 'lucide-react'
import { useCompanies } from '@/hooks/useCompanies'
import { Company } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

const companySchema = z.object({
  name: z.string().min(1, 'Nama perusahaan wajib diisi'),
  address: z.string().min(1, 'Alamat wajib diisi'),
  district: z.string().default('Bekasi Kabupaten'),
  sub_district: z.string().optional(),
  village: z.string().optional(),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  website: z.string().url('Format website tidak valid').optional().or(z.literal('')),
  business_type: z.string().optional(),
  description: z.string().optional(),
  established_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  employee_count: z.number().min(1).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_active: z.boolean().default(true)
})

type CompanyFormData = z.infer<typeof companySchema>

interface CompanyFormProps {
  company?: Company | null
  onClose: () => void
}

const businessTypes = [
  'Manufaktur',
  'Perdagangan',
  'Jasa',
  'Konstruksi',
  'Teknologi',
  'Pertanian',
  'Perikanan',
  'Logistik',
  'Consumer Goods',
  'Otomotif',
  'Tekstil',
  'Manufaktur Makanan',
  'Lainnya'
]

const subDistricts = [
  'Balaraja',
  'Bantargebang',
  'Bekasi Timur',
  'Cibarusah',
  'Cibitung',
  'Cikarang Barat',
  'Cikarang Utara',
  'Cileungsi',
  'Muaragembong',
  'Rajeg',
  'Serpong',
  'Tambun Selatan',
  'Tambun Utara',
  'Tanjung Priok'
]

export default function CompanyForm({ company, onClose }: CompanyFormProps) {
  const { user } = useAuth()
  const { addCompany, updateCompany } = useCompanies()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      district: 'Bekasi Kabupaten',
      is_active: true
    }
  })

  useEffect(() => {
    if (company) {
      // Populate form with existing company data
      Object.keys(company).forEach((key) => {
        const value = company[key as keyof Company]
        if (value !== null && value !== undefined) {
          setValue(key as keyof CompanyFormData, value as any)
        }
      })
    }
  }, [company, setValue])

  const onSubmit = async (data: CompanyFormData) => {
    if (!user) return

    setIsSubmitting(true)
    try {
      // Clean up empty strings
      const cleanData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value === '' ? null : value
        ])
      ) as any

      if (company) {
        // Update existing company
        const result = await updateCompany(company.id, cleanData)
        if (result.error) {
          alert('Error: ' + result.error)
          return
        }
      } else {
        // Add new company
        const result = await addCompany({
          ...cleanData,
          created_by: user.id
        })
        if (result.error) {
          alert('Error: ' + result.error)
          return
        }
      }

      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Terjadi kesalahan saat menyimpan data')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {company ? 'Edit Perusahaan' : 'Tambah Perusahaan Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informasi Dasar</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Perusahaan *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="PT. Contoh Perusahaan"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Usaha
                </label>
                <select
                  {...register('business_type')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih jenis usaha</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Lengkap *
              </label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jl. Contoh No. 123, RT/RW 01/02"
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kabupaten
                </label>
                <input
                  {...register('district')}
                  type="text"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  value="Bekasi Kabupaten"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kecamatan
                </label>
                <select
                  {...register('sub_district')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Pilih kecamatan</option>
                  {subDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kelurahan/Desa
                </label>
                <input
                  {...register('village')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama kelurahan/desa"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informasi Kontak</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="021-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Pos
                </label>
                <input
                  {...register('postal_code')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="17530"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="info@perusahaan.co.id"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  {...register('website')}
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.perusahaan.co.id"
                />
                {errors.website && (
                  <p className="text-red-600 text-sm mt-1">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Informasi Tambahan</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tahun Didirikan
                </label>
                <input
                  {...register('established_year', { valueAsNumber: true })}
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2020"
                />
                {errors.established_year && (
                  <p className="text-red-600 text-sm mt-1">{errors.established_year.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Karyawan
                </label>
                <input
                  {...register('employee_count', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="50"
                />
                {errors.employee_count && (
                  <p className="text-red-600 text-sm mt-1">{errors.employee_count.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Perusahaan
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Deskripsi singkat tentang perusahaan, produk, atau layanan yang ditawarkan..."
              />
            </div>

            <div className="flex items-center">
              <input
                {...register('is_active')}
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Perusahaan aktif beroperasi
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

