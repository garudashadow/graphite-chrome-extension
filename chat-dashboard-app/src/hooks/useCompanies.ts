'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Company, CompanyStats } from '@/types/database'

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompanies(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching companies')
    } finally {
      setLoading(false)
    }
  }

  const addCompany = async (companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single()

      if (error) throw error
      
      setCompanies(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error adding company'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setCompanies(prev => 
        prev.map(company => 
          company.id === id ? { ...company, ...data } : company
        )
      )
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating company'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCompanies(prev => prev.filter(company => company.id !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting company'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  const searchCompanies = async (query: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .or(`name.ilike.%${query}%,address.ilike.%${query}%,business_type.ilike.%${query}%,sub_district.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompanies(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching companies')
    } finally {
      setLoading(false)
    }
  }

  const filterByBusinessType = async (businessType: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('business_type', businessType)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompanies(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error filtering companies')
    } finally {
      setLoading(false)
    }
  }

  const filterBySubDistrict = async (subDistrict: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('sub_district', subDistrict)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCompanies(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error filtering companies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    searchCompanies,
    filterByBusinessType,
    filterBySubDistrict
  }
}

export function useCompanyStats() {
  const [stats, setStats] = useState<CompanyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('company_stats')
        .select('*')
        .single()

      if (error) throw error
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching company stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, fetchStats }
}

