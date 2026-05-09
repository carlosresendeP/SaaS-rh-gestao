import { api } from "@/lib/api"
import type { ApiResponse, Company, UpdateCompanyRequest } from "@/types/api"

export interface CompanyStats {
  tempoMedioContratacao: number | null
  conversao: Record<string, number>
  candidaturasPorSemana: { semana: string; count: number }[]
  topVagas: { id: string; titulo: string; count: number }[]
  vagasSemCandidatos: { id: string; titulo: string; dias: number }[]
}

export const companyService = {
  get: async (): Promise<Company> => {
    const { data } = await api.get<ApiResponse<Company>>("/company")
    return data.data
  },

  update: async (body: UpdateCompanyRequest): Promise<Company> => {
    const { data } = await api.patch<ApiResponse<Company>>("/company", body)
    return data.data
  },

  setOnboardingStep: async (step: number): Promise<Company> => {
    const { data } = await api.patch<ApiResponse<Company>>(`/company/onboarding/${step}`)
    return data.data
  },

  getStats: async (): Promise<CompanyStats> => {
    const { data } = await api.get<ApiResponse<CompanyStats>>("/company/stats")
    return data.data
  },
}
