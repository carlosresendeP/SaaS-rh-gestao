import { prisma } from "@/config/prisma";
import { AppError } from "@/config/error";
import { UpdateCompanyDTO } from "../schemas/company.schema";

// Retorna a segunda-feira da semana de uma data (para agrupar por semana)
function mondayOf(date: Date): string {
  const d = new Date(date)
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() - (day - 1))
  return d.toISOString().slice(0, 10) // "YYYY-MM-DD"
}

export class CompanyService {
  async getById(id: string) {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) throw new AppError("Empresa não encontrada", 404);
    return company;
  }

  async update(id: string, data: UpdateCompanyDTO) {
    // O Prisma agora reconhece os tipos automaticamente através do DTO
    return await prisma.company.update({
      where: { id },
      data: {
        nome: data.nome,
        razaoSocial: data.razaoSocial,
        cnpj: data.cnpj,
        contextoEmpresa: data.contextoEmpresa,
        perfilRitmo: data.perfilRitmo,
        valores: data.valores,
        logoUrl: data.logoUrl,
      },
    });
  }

  async updateStep(id: string, step: number) {
    return await prisma.company.update({
      where: { id },
      data: { onboardingStep: step },
    });
  }

  async getStats(companyId: string) {
    const now   = new Date()
    const ms7d  = 7  * 24 * 60 * 60 * 1000
    const ms8w  = 8  * 7 * 24 * 60 * 60 * 1000
    const ago8w = new Date(now.getTime() - ms8w)

    // 1. Tempo médio de contratação (usa updatedAt como proxy da aprovação)
    const aprovadas = await prisma.application.findMany({
      where: { companyId, status: "APROVADO" },
      select: { createdAt: true, updatedAt: true },
    })
    const tempoMedioContratacao = aprovadas.length > 0
      ? Math.round(
          aprovadas.reduce((sum, a) =>
            sum + (a.updatedAt.getTime() - a.createdAt.getTime()) / 86400000, 0
          ) / aprovadas.length
        )
      : null

    // 2. Contagem por status (para conversão)
    const byStatus = await prisma.application.groupBy({
      by: ["status"],
      where: { companyId },
      _count: { id: true },
    })
    const conversao: Record<string, number> = {}
    for (const row of byStatus) conversao[row.status] = row._count.id

    // 3. Candidaturas por semana — últimas 8 semanas
    const recentApps = await prisma.application.findMany({
      where: { companyId, createdAt: { gte: ago8w } },
      select: { createdAt: true },
    })
    const weekMap = new Map<string, number>()
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
      weekMap.set(mondayOf(d), 0)
    }
    for (const a of recentApps) {
      const key = mondayOf(a.createdAt)
      if (weekMap.has(key)) weekMap.set(key, (weekMap.get(key) ?? 0) + 1)
    }
    const candidaturasPorSemana = [...weekMap.entries()].map(([semana, count]) => ({ semana, count }))

    // 4. Top 3 vagas com mais candidatos
    const topRaw = await prisma.application.groupBy({
      by: ["jobId"],
      where: { companyId },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 3,
    })
    const jobs = await prisma.job.findMany({
      where: { id: { in: topRaw.map(r => r.jobId) } },
      select: { id: true, titulo: true },
    })
    const topVagas = topRaw.map(r => ({
      id: r.jobId,
      titulo: jobs.find(j => j.id === r.jobId)?.titulo ?? "—",
      count: r._count.id,
    }))

    // 5. Vagas abertas sem nova candidatura há > 7 dias
    const vagasAbertas = await prisma.job.findMany({
      where: { companyId, status: "ABERTA" },
      select: {
        id: true,
        titulo: true,
        createdAt: true,
        applications: { select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 },
      },
    })
    const vagasSemCandidatos = vagasAbertas
      .map(v => {
        const ref = v.applications[0]?.createdAt ?? v.createdAt
        return { id: v.id, titulo: v.titulo, dias: Math.round((now.getTime() - ref.getTime()) / 86400000) }
      })
      .filter(v => v.dias > 7)
      .sort((a, b) => b.dias - a.dias)

    return { tempoMedioContratacao, conversao, candidaturasPorSemana, topVagas, vagasSemCandidatos }
  }
}