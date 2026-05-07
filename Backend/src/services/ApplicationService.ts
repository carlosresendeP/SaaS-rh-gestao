import { prisma } from "@/config/prisma";
import { AppError } from "@/config/error";
import { ApplyJobDTO } from "../schemas/application.schema";
import { ApplicationStatus } from "@/generated/prisma/enums";
import { formatBR } from "@/config/dayjs";

export class ApplicationService {
  async apply(data: ApplyJobDTO) {
    // 1. Verificar se a vaga existe e pegar o companyId dela
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      select: { id: true, companyId: true, status: true }
    });

    if (!job) {
      throw new AppError("A vaga informada não existe.", 404);
    }

    if (job.status !== "ABERTA") {
      throw new AppError("Esta vaga não está mais aceitando inscrições.", 400);
    }

    // 2. Buscar ou Criar o candidato (Upsert manual para controle total)
    let candidate = await prisma.candidate.findUnique({
      where: { email: data.email }
    });

    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          curriculoUrl: data.curriculoUrl
        }
      });
    }

    // 3. Verificar se o candidato já está inscrito NESTA vaga
    const alreadyApplied = await prisma.application.findFirst({
      where: {
        jobId: job.id,
        candidateId: candidate.id
      }
    });

    if (alreadyApplied) {
      throw new AppError("Você já se candidatou para esta vaga.", 409);
    }

    // 4. Criar a inscrição vinculando empresa, vaga e candidato
    const application = await prisma.application.create({
      data: {
        jobId: job.id,
        candidateId: candidate.id,
        companyId: job.companyId,
      },
      include: {
        candidate: true,
        job: { select: { titulo: true } }
      }
    });

    return {
      ...application,
      createdAt: formatBR(application.createdAt),
      updatedAt: formatBR(application.updatedAt),
    };
  }

  async listByCompany(companyId: string) {
    const applications = await prisma.application.findMany({
      where: { companyId },
      include: {
        candidate: true,
        job: { select: { titulo: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return applications.map(a => ({
      ...a,
      createdAt: formatBR(a.createdAt),
      updatedAt: formatBR(a.updatedAt),
    }));
  }

  async listByJob(jobId: string, companyId: string) {
    const applications = await prisma.application.findMany({
      where: { jobId, companyId },
      include: { candidate: true }
    });

    return applications.map(a => ({
      ...a,
      createdAt: formatBR(a.createdAt),
      updatedAt: formatBR(a.updatedAt),
    }));
  }

async updateStatus(id: string, companyId: string, status: ApplicationStatus) {
  return await prisma.application.update({
    where: { id, companyId },
    data: { status }
  });
}
  



}