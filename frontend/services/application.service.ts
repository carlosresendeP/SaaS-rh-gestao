import { api } from "@/lib/api"
import type { ApiResponse, Application, ApplicationStatus } from "@/types/api"

export const applicationService = {
  listByCompany: async (): Promise<Application[]> => {
    const { data } = await api.get<ApiResponse<Application[]>>("/applications/company")
    return data.data
  },

  listByJob: async (jobId: string): Promise<Application[]> => {
    const { data } = await api.get<ApiResponse<Application[]>>(`/applications/job/${jobId}`)
    return data.data
  },

  updateStatus: async (id: string, status: ApplicationStatus): Promise<Application> => {
    const { data } = await api.patch<ApiResponse<Application>>(
      `/applications/${id}/status`,
      { status }
    )
    return data.data
  },

  createTestLink: async (id: string): Promise<{ url: string; expiresAt: string }> => {
    const { data } = await api.post<ApiResponse<{ url: string; expiresAt: string }>>(
      `/applications/${id}/test-link`
    )
    // Backend returns its own API URL — extract the UUID token and build the frontend URL
    const token = data.data.url.split("/").pop()
    const frontendUrl = `${window.location.origin}/teste/${token}`
    return { url: frontendUrl, expiresAt: data.data.expiresAt }
  },
}
