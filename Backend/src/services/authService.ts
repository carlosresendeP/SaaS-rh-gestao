import bcrypt from "bcryptjs";
import { prisma } from "@/config/prisma";
import { AppError } from "@/config/error";
import type { RegisterDTO, LoginDTO } from "../schemas/auth.schema";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { env } from "../config/env";
import { Prisma } from "../generated/prisma/client";

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 dias

function generateRefreshToken() {
  return randomUUID() + randomUUID() // 72 hex chars, sem hifens
}

export class AuthService {
  async register({ nome, email, password, razaoSocial, cnpj }: RegisterDTO) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new AppError("E-mail já cadastrado.", 409);

    const existingCompany = await prisma.company.findUnique({ where: { cnpj } });
    if (existingCompany) throw new AppError("CNPJ já cadastrado.", 409);

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = await prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: { razaoSocial, cnpj },
        });
        const user = await tx.user.create({
          data: { nome, email, password: hashedPassword, companyId: company.id },
        });
        return { company, user };
      });
      return result;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError("E-mail ou CNPJ já cadastrado.", 409);
      }
      throw err;
    }
  }

  // Método para Login  --------------------------
  async login({ email, password }: LoginDTO) {
    // 1. Busca o usuário pelo email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("Email or password incorrect", 401);
    }

    // 2. Valida a senha (Comparação segura)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Email or password incorrect", 401);
    }

    // 3. Busca os dados da empresa relacionados a este usuário
    const company = await prisma.company.findUnique({
      where: { id: user.companyId },
      select: { id: true, razaoSocial: true, cnpj: true }, // Seleciona só o que precisa
    });

    if (!company) {
      // Isso aqui é só por segurança extra, teoricamente não deveria acontecer
      throw new AppError("Company data not found.", 500);
    }

    // 4. Gera access token (1h) + refresh token (7d)
    const payload = {
      sub: user.id,
      companyId: user.companyId,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1d" });

    const rawRefresh = generateRefreshToken();
    const expiresAt  = new Date(Date.now() + REFRESH_TTL_MS);

    // Limpa tokens antigos do usuário antes de criar novo
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    await prisma.refreshToken.create({ data: { token: rawRefresh, userId: user.id, expiresAt } });

    return {
      accessToken,
      refreshToken: rawRefresh,
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
      company,
    };
  }

  async refresh(token: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { token } });

    if (!stored) throw new AppError("Sessão inválida.", 401);
    if (new Date() > stored.expiresAt) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new AppError("Sessão expirada. Faça login novamente.", 401);
    }

    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw new AppError("Usuário não encontrado.", 401);

    // Rotação: gera novo refresh token
    const newRawRefresh = generateRefreshToken();
    const newExpiresAt  = new Date(Date.now() + REFRESH_TTL_MS);

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { token: newRawRefresh, expiresAt: newExpiresAt },
    });

    const accessToken = jwt.sign(
      { sub: user.id, companyId: user.companyId, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { accessToken, refreshToken: newRawRefresh };
  }

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }


  // Método para buscar o próprio usuário --------------------------
  async getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
      companyId: true,
      company: {
        select: {
          nome: true,
          onboardingStep: true,
          logoUrl: true
        }
      }
    }
  });

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  return user;
}
}