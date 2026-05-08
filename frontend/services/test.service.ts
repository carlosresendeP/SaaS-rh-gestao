import { api } from "@/lib/api"
import type { ApiResponse, TestData, TestSubmitRequest } from "@/types/api"

export const testService = {
  getTest: async (token: string): Promise<TestData> => {
    const { data } = await api.get<ApiResponse<TestData>>(`/public/tests/${token}`)
    return data.data
  },

  submit: async (token: string, answers: TestSubmitRequest): Promise<void> => {
    await api.post(`/public/tests/${token}/submit`, answers)
  },
}
