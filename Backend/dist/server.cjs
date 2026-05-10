"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_fastify = __toESM(require("fastify"), 1);

// src/services/authService.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// src/config/prisma.ts
var import_config = require("dotenv/config");
var import_adapter_pg = require("@prisma/adapter-pg");

// src/generated/prisma/internal/class.ts
var runtime = __toESM(require("@prisma/client/runtime/client"), 1);
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Company {\n  id          String  @id @default(uuid())\n  nome        String?\n  razaoSocial String\n  cnpj        String  @unique\n\n  // Novos campos para Onboarding e Contexto\n  onboardingStep  Int      @default(1)\n  contextoEmpresa String?  @db.Text\n  perfilRitmo     String? // Ex: Acelerado, Anal\xEDtico\n  valores         String[] // Array de strings para cultura\n  logoUrl         String?\n\n  // Endere\xE7o\n  cep        String?\n  logradouro String?\n  cidade     String?\n  estado     String?\n\n  // Onboarding: e-mails de colaboradores para convite de mapeamento\n  teamEmails String[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  users        User[]\n  jobs         Job[]\n  applications Application[]\n  organograma  OrganogramaNode[]\n}\n\nmodel User {\n  id        String   @id @default(uuid())\n  companyId String\n  nome      String\n  email     String   @unique\n  password  String\n  role      String   @default("admin")\n  createdAt DateTime @default(now())\n\n  company       Company        @relation(fields: [companyId], references: [id], onDelete: Cascade)\n  refreshTokens RefreshToken[]\n\n  @@index([companyId])\n}\n\nmodel RefreshToken {\n  id        String   @id @default(uuid())\n  token     String   @unique\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n\n  @@map("refresh_tokens")\n}\n\nenum JobStatus {\n  ABERTA\n  FECHADA\n  PAUSADA\n}\n\nmodel Job {\n  id         String    @id @default(uuid())\n  titulo     String\n  descricao  String    @db.Text\n  requisitos String?   @db.Text\n  salario    Decimal?  @db.Decimal(10, 2)\n  status     JobStatus @default(ABERTA)\n\n  // Novos campos para IA e Gest\xE3o\n  liderId         String? // ID do gestor no organograma\n  jdGerada        String?  @db.Text // Descri\xE7\xE3o otimizada pela IA\n  perfilIdealJson Json? // Perfil comportamental esperado\n  publicToken     String?  @unique @default(cuid()) // Para link p\xFAblico de inscri\xE7\xE3o\n  salaryMin       Decimal? @db.Decimal(10, 2)\n  salaryMax       Decimal? @db.Decimal(10, 2)\n\n  // Rela\xE7\xE3o Multi-tenant: Toda vaga pertence a uma empresa\n  companyId String\n  company   Company @relation(fields: [companyId], references: [id])\n\n  createdAt    DateTime      @default(now())\n  updatedAt    DateTime      @updatedAt\n  applications Application[]\n\n  @@index([companyId, titulo, status])\n  @@map("jobs")\n}\n\nmodel Candidate {\n  id           String  @id @default(uuid())\n  nome         String\n  email        String  @unique\n  telefone     String?\n  curriculoUrl String? // URL do PDF do curr\xEDculo\n  linkedinUrl  String? // URL do perfil no LinkedIn\n\n  respostasJson   Json? // Respostas brutas dos testes\n  testCompletedAt DateTime?\n\n  // Rela\xE7\xF5es\n  applications Application[]\n  personality  PersonalityResult?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("candidates")\n}\n\nenum ApplicationStatus {\n  PENDENTE\n  EM_ANALISE\n  TESTE_PSICOMETRICO\n  ENTREVISTA\n  APROVADO\n  REPROVADO\n}\n\nmodel Application {\n  id     String            @id @default(uuid())\n  status ApplicationStatus @default(PENDENTE)\n\n  // Campos de IA\n  feedbackIA      String? @db.Text\n  matchScore      Int?\n  matchResultJson Json?\n\n  testLinks TestLink[]\n\n  // Relacionamentos\n  jobId String\n  job   Job    @relation(fields: [jobId], references: [id])\n\n  candidateId String\n  candidate   Candidate @relation(fields: [candidateId], references: [id])\n\n  // Facilitador para o Multi-tenancy (ajuda a listar todos os candidatos da empresa X r\xE1pido)\n  companyId String\n  company   Company @relation(fields: [companyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("applications")\n}\n\nmodel OrganogramaNode {\n  id        String  @id @default(uuid())\n  nome      String\n  cargo     String\n  parentId  String? // Para criar a \xE1rvore hier\xE1rquica\n  companyId String\n  company   Company @relation(fields: [companyId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("organograma_nodes")\n}\n\nmodel PersonalityResult {\n  id          String    @id @default(uuid())\n  candidateId String    @unique\n  candidate   Candidate @relation(fields: [candidateId], references: [id])\n  disc        String? // Resultado simplificado DISC\n  eneagrama   String? // Resultado simplificado Eneagrama\n  rawScore    Json?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("personality_results")\n}\n\nmodel TestLink {\n  id            String      @id @default(uuid())\n  token         String      @unique\n  applicationId String\n  application   Application @relation(fields: [applicationId], references: [id])\n  expiresAt     DateTime\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("test_links")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Company":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"nome","kind":"scalar","type":"String"},{"name":"razaoSocial","kind":"scalar","type":"String"},{"name":"cnpj","kind":"scalar","type":"String"},{"name":"onboardingStep","kind":"scalar","type":"Int"},{"name":"contextoEmpresa","kind":"scalar","type":"String"},{"name":"perfilRitmo","kind":"scalar","type":"String"},{"name":"valores","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"cep","kind":"scalar","type":"String"},{"name":"logradouro","kind":"scalar","type":"String"},{"name":"cidade","kind":"scalar","type":"String"},{"name":"estado","kind":"scalar","type":"String"},{"name":"teamEmails","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"CompanyToUser"},{"name":"jobs","kind":"object","type":"Job","relationName":"CompanyToJob"},{"name":"applications","kind":"object","type":"Application","relationName":"ApplicationToCompany"},{"name":"organograma","kind":"object","type":"OrganogramaNode","relationName":"CompanyToOrganogramaNode"}],"dbName":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"nome","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToUser"},{"name":"refreshTokens","kind":"object","type":"RefreshToken","relationName":"RefreshTokenToUser"}],"dbName":null},"RefreshToken":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"RefreshTokenToUser"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"refresh_tokens"},"Job":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"titulo","kind":"scalar","type":"String"},{"name":"descricao","kind":"scalar","type":"String"},{"name":"requisitos","kind":"scalar","type":"String"},{"name":"salario","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"JobStatus"},{"name":"liderId","kind":"scalar","type":"String"},{"name":"jdGerada","kind":"scalar","type":"String"},{"name":"perfilIdealJson","kind":"scalar","type":"Json"},{"name":"publicToken","kind":"scalar","type":"String"},{"name":"salaryMin","kind":"scalar","type":"Decimal"},{"name":"salaryMax","kind":"scalar","type":"Decimal"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToJob"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"applications","kind":"object","type":"Application","relationName":"ApplicationToJob"}],"dbName":"jobs"},"Candidate":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"nome","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"telefone","kind":"scalar","type":"String"},{"name":"curriculoUrl","kind":"scalar","type":"String"},{"name":"linkedinUrl","kind":"scalar","type":"String"},{"name":"respostasJson","kind":"scalar","type":"Json"},{"name":"testCompletedAt","kind":"scalar","type":"DateTime"},{"name":"applications","kind":"object","type":"Application","relationName":"ApplicationToCandidate"},{"name":"personality","kind":"object","type":"PersonalityResult","relationName":"CandidateToPersonalityResult"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"candidates"},"Application":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ApplicationStatus"},{"name":"feedbackIA","kind":"scalar","type":"String"},{"name":"matchScore","kind":"scalar","type":"Int"},{"name":"matchResultJson","kind":"scalar","type":"Json"},{"name":"testLinks","kind":"object","type":"TestLink","relationName":"ApplicationToTestLink"},{"name":"jobId","kind":"scalar","type":"String"},{"name":"job","kind":"object","type":"Job","relationName":"ApplicationToJob"},{"name":"candidateId","kind":"scalar","type":"String"},{"name":"candidate","kind":"object","type":"Candidate","relationName":"ApplicationToCandidate"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"ApplicationToCompany"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"applications"},"OrganogramaNode":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"nome","kind":"scalar","type":"String"},{"name":"cargo","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"companyId","kind":"scalar","type":"String"},{"name":"company","kind":"object","type":"Company","relationName":"CompanyToOrganogramaNode"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"organograma_nodes"},"PersonalityResult":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"candidateId","kind":"scalar","type":"String"},{"name":"candidate","kind":"object","type":"Candidate","relationName":"CandidateToPersonalityResult"},{"name":"disc","kind":"scalar","type":"String"},{"name":"eneagrama","kind":"scalar","type":"String"},{"name":"rawScore","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"personality_results"},"TestLink":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"applicationId","kind":"scalar","type":"String"},{"name":"application","kind":"object","type":"Application","relationName":"ApplicationToTestLink"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"test_links"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","company","user","refreshTokens","_count","users","application","testLinks","job","applications","candidate","personality","jobs","organograma","Company.findUnique","Company.findUniqueOrThrow","Company.findFirst","Company.findFirstOrThrow","Company.findMany","data","Company.createOne","Company.createMany","Company.createManyAndReturn","Company.updateOne","Company.updateMany","Company.updateManyAndReturn","create","update","Company.upsertOne","Company.deleteOne","Company.deleteMany","having","_avg","_sum","_min","_max","Company.groupBy","Company.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","RefreshToken.findUnique","RefreshToken.findUniqueOrThrow","RefreshToken.findFirst","RefreshToken.findFirstOrThrow","RefreshToken.findMany","RefreshToken.createOne","RefreshToken.createMany","RefreshToken.createManyAndReturn","RefreshToken.updateOne","RefreshToken.updateMany","RefreshToken.updateManyAndReturn","RefreshToken.upsertOne","RefreshToken.deleteOne","RefreshToken.deleteMany","RefreshToken.groupBy","RefreshToken.aggregate","Job.findUnique","Job.findUniqueOrThrow","Job.findFirst","Job.findFirstOrThrow","Job.findMany","Job.createOne","Job.createMany","Job.createManyAndReturn","Job.updateOne","Job.updateMany","Job.updateManyAndReturn","Job.upsertOne","Job.deleteOne","Job.deleteMany","Job.groupBy","Job.aggregate","Candidate.findUnique","Candidate.findUniqueOrThrow","Candidate.findFirst","Candidate.findFirstOrThrow","Candidate.findMany","Candidate.createOne","Candidate.createMany","Candidate.createManyAndReturn","Candidate.updateOne","Candidate.updateMany","Candidate.updateManyAndReturn","Candidate.upsertOne","Candidate.deleteOne","Candidate.deleteMany","Candidate.groupBy","Candidate.aggregate","Application.findUnique","Application.findUniqueOrThrow","Application.findFirst","Application.findFirstOrThrow","Application.findMany","Application.createOne","Application.createMany","Application.createManyAndReturn","Application.updateOne","Application.updateMany","Application.updateManyAndReturn","Application.upsertOne","Application.deleteOne","Application.deleteMany","Application.groupBy","Application.aggregate","OrganogramaNode.findUnique","OrganogramaNode.findUniqueOrThrow","OrganogramaNode.findFirst","OrganogramaNode.findFirstOrThrow","OrganogramaNode.findMany","OrganogramaNode.createOne","OrganogramaNode.createMany","OrganogramaNode.createManyAndReturn","OrganogramaNode.updateOne","OrganogramaNode.updateMany","OrganogramaNode.updateManyAndReturn","OrganogramaNode.upsertOne","OrganogramaNode.deleteOne","OrganogramaNode.deleteMany","OrganogramaNode.groupBy","OrganogramaNode.aggregate","PersonalityResult.findUnique","PersonalityResult.findUniqueOrThrow","PersonalityResult.findFirst","PersonalityResult.findFirstOrThrow","PersonalityResult.findMany","PersonalityResult.createOne","PersonalityResult.createMany","PersonalityResult.createManyAndReturn","PersonalityResult.updateOne","PersonalityResult.updateMany","PersonalityResult.updateManyAndReturn","PersonalityResult.upsertOne","PersonalityResult.deleteOne","PersonalityResult.deleteMany","PersonalityResult.groupBy","PersonalityResult.aggregate","TestLink.findUnique","TestLink.findUniqueOrThrow","TestLink.findFirst","TestLink.findFirstOrThrow","TestLink.findMany","TestLink.createOne","TestLink.createMany","TestLink.createManyAndReturn","TestLink.updateOne","TestLink.updateMany","TestLink.updateManyAndReturn","TestLink.upsertOne","TestLink.deleteOne","TestLink.deleteMany","TestLink.groupBy","TestLink.aggregate","AND","OR","NOT","id","token","applicationId","expiresAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","candidateId","disc","eneagrama","rawScore","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","nome","cargo","parentId","companyId","ApplicationStatus","status","feedbackIA","matchScore","matchResultJson","jobId","email","telefone","curriculoUrl","linkedinUrl","respostasJson","testCompletedAt","every","some","none","titulo","descricao","requisitos","salario","JobStatus","liderId","jdGerada","perfilIdealJson","publicToken","salaryMin","salaryMax","userId","password","role","razaoSocial","cnpj","onboardingStep","contextoEmpresa","perfilRitmo","valores","logoUrl","cep","logradouro","cidade","estado","teamEmails","has","hasEvery","hasSome","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "rQRUkAEXBwAAqAIAIAsAAJYCACAOAACpAgAgDwAAqgIAIKgBAACmAgAwqQEAACgAEKoBAACmAgAwqwEBAAAAAa8BQACFAgAhsAFAAIUCACHGAQEAgwIAIecBAQCUAgAh6AEBAAAAAekBAgCnAgAh6gEBAIMCACHrAQEAgwIAIewBAACjAgAg7QEBAIMCACHuAQEAgwIAIe8BAQCDAgAh8AEBAIMCACHxAQEAgwIAIfIBAACjAgAgAQAAAAEAIAwDAACsAgAgBQAAugIAIKgBAAC5AgAwqQEAAAMAEKoBAAC5AgAwqwEBAJQCACGvAUAAhQIAIcYBAQCUAgAhyQEBAJQCACHQAQEAlAIAIeUBAQCUAgAh5gEBAJQCACECAwAA8wMAIAUAAPgDACAMAwAArAIAIAUAALoCACCoAQAAuQIAMKkBAAADABCqAQAAuQIAMKsBAQAAAAGvAUAAhQIAIcYBAQCUAgAhyQEBAJQCACHQAQEAAAAB5QEBAJQCACHmAQEAlAIAIQMAAAADACABAAAEADACAAAFACAJBAAAuAIAIKgBAAC3AgAwqQEAAAcAEKoBAAC3AgAwqwEBAJQCACGsAQEAlAIAIa4BQACFAgAhrwFAAIUCACHkAQEAlAIAIQEEAAD3AwAgCQQAALgCACCoAQAAtwIAMKkBAAAHABCqAQAAtwIAMKsBAQAAAAGsAQEAAAABrgFAAIUCACGvAUAAhQIAIeQBAQCUAgAhAwAAAAcAIAEAAAgAMAIAAAkAIAEAAAAHACAUAwAArAIAIAsAAJYCACCoAQAAtAIAMKkBAAAMABCqAQAAtAIAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIckBAQCUAgAhywEAALYC3gEi2QEBAJQCACHaAQEAlAIAIdsBAQCDAgAh3AEQALUCACHeAQEAgwIAId8BAQCDAgAh4AEAAIQCACDhAQEAgwIAIeIBEAC1AgAh4wEQALUCACEKAwAA8wMAIAsAAIMDACDbAQAAwgIAINwBAADCAgAg3gEAAMICACDfAQAAwgIAIOABAADCAgAg4QEAAMICACDiAQAAwgIAIOMBAADCAgAgFAMAAKwCACALAACWAgAgqAEAALQCADCpAQAADAAQqgEAALQCADCrAQEAAAABrwFAAIUCACGwAUAAhQIAIckBAQCUAgAhywEAALYC3gEi2QEBAJQCACHaAQEAlAIAIdsBAQCDAgAh3AEQALUCACHeAQEAgwIAId8BAQCDAgAh4AEAAIQCACDhAQEAAAAB4gEQALUCACHjARAAtQIAIQMAAAAMACABAAANADACAAAOACARAwAArAIAIAkAALICACAKAACzAgAgDAAAhgIAIKgBAACvAgAwqQEAABAAEKoBAACvAgAwqwEBAJQCACGvAUAAhQIAIbABQACFAgAhvAEBAJQCACHJAQEAlAIAIcsBAACwAssBIswBAQCDAgAhzQECALECACHOAQAAhAIAIM8BAQCUAgAhBwMAAPMDACAJAAD1AwAgCgAA9gMAIAwAAMkCACDMAQAAwgIAIM0BAADCAgAgzgEAAMICACARAwAArAIAIAkAALICACAKAACzAgAgDAAAhgIAIKgBAACvAgAwqQEAABAAEKoBAACvAgAwqwEBAAAAAa8BQACFAgAhsAFAAIUCACG8AQEAlAIAIckBAQCUAgAhywEAALACywEizAEBAIMCACHNAQIAsQIAIc4BAACEAgAgzwEBAJQCACEDAAAAEAAgAQAAEQAwAgAAEgAgCggAAK4CACCoAQAArQIAMKkBAAAUABCqAQAArQIAMKsBAQCUAgAhrAEBAJQCACGtAQEAlAIAIa4BQACFAgAhrwFAAIUCACGwAUAAhQIAIQEIAAD0AwAgCggAAK4CACCoAQAArQIAMKkBAAAUABCqAQAArQIAMKsBAQAAAAGsAQEAAAABrQEBAJQCACGuAUAAhQIAIa8BQACFAgAhsAFAAIUCACEDAAAAFAAgAQAAFQAwAgAAFgAgAwAAABAAIAEAABEAMAIAABIAIAsMAACGAgAgqAEAAIICADCpAQAAGQAQqgEAAIICADCrAQEAlAIAIa8BQACFAgAhsAFAAIUCACG8AQEAlAIAIb0BAQCDAgAhvgEBAIMCACG_AQAAhAIAIAEAAAAZACABAAAAEAAgAQAAABQAIAEAAAAQACADAAAAEAAgAQAAEQAwAgAAEgAgCwMAAKwCACCoAQAAqwIAMKkBAAAfABCqAQAAqwIAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIcYBAQCUAgAhxwEBAJQCACHIAQEAgwIAIckBAQCUAgAhAgMAAPMDACDIAQAAwgIAIAsDAACsAgAgqAEAAKsCADCpAQAAHwAQqgEAAKsCADCrAQEAAAABrwFAAIUCACGwAUAAhQIAIcYBAQCUAgAhxwEBAJQCACHIAQEAgwIAIckBAQCUAgAhAwAAAB8AIAEAACAAMAIAACEAIAEAAAADACABAAAADAAgAQAAABAAIAEAAAAfACABAAAAAQAgFwcAAKgCACALAACWAgAgDgAAqQIAIA8AAKoCACCoAQAApgIAMKkBAAAoABCqAQAApgIAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIcYBAQCDAgAh5wEBAJQCACHoAQEAlAIAIekBAgCnAgAh6gEBAIMCACHrAQEAgwIAIewBAACjAgAg7QEBAIMCACHuAQEAgwIAIe8BAQCDAgAh8AEBAIMCACHxAQEAgwIAIfIBAACjAgAgDAcAAPADACALAACDAwAgDgAA8QMAIA8AAPIDACDGAQAAwgIAIOoBAADCAgAg6wEAAMICACDtAQAAwgIAIO4BAADCAgAg7wEAAMICACDwAQAAwgIAIPEBAADCAgAgAwAAACgAIAEAACkAMAIAAAEAIAMAAAAoACABAAApADACAAABACADAAAAKAAgAQAAKQAwAgAAAQAgFAcAAOwDACALAADuAwAgDgAA7QMAIA8AAO8DACCrAQEAAAABrwFAAAAAAbABQAAAAAHGAQEAAAAB5wEBAAAAAegBAQAAAAHpAQIAAAAB6gEBAAAAAesBAQAAAAHsAQAA6gMAIO0BAQAAAAHuAQEAAAAB7wEBAAAAAfABAQAAAAHxAQEAAAAB8gEAAOsDACABFQAALQAgEKsBAQAAAAGvAUAAAAABsAFAAAAAAcYBAQAAAAHnAQEAAAAB6AEBAAAAAekBAgAAAAHqAQEAAAAB6wEBAAAAAewBAADqAwAg7QEBAAAAAe4BAQAAAAHvAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQAA6wMAIAEVAAAvADABFQAALwAwFAcAALkDACALAAC7AwAgDgAAugMAIA8AALwDACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACHGAQEAxgIAIecBAQC-AgAh6AEBAL4CACHpAQIAtgMAIeoBAQDGAgAh6wEBAMYCACHsAQAAtwMAIO0BAQDGAgAh7gEBAMYCACHvAQEAxgIAIfABAQDGAgAh8QEBAMYCACHyAQAAuAMAIAIAAAABACAVAAAyACAQqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhxgEBAMYCACHnAQEAvgIAIegBAQC-AgAh6QECALYDACHqAQEAxgIAIesBAQDGAgAh7AEAALcDACDtAQEAxgIAIe4BAQDGAgAh7wEBAMYCACHwAQEAxgIAIfEBAQDGAgAh8gEAALgDACACAAAAKAAgFQAANAAgAgAAACgAIBUAADQAIAMAAAABACAcAAAtACAdAAAyACABAAAAAQAgAQAAACgAIA0GAACxAwAgIgAAsgMAICMAALUDACAkAAC0AwAgJQAAswMAIMYBAADCAgAg6gEAAMICACDrAQAAwgIAIO0BAADCAgAg7gEAAMICACDvAQAAwgIAIPABAADCAgAg8QEAAMICACATqAEAAKECADCpAQAAOwAQqgEAAKECADCrAQEA9AEAIa8BQAD1AQAhsAFAAPUBACHGAQEA_AEAIecBAQD0AQAh6AEBAPQBACHpAQIAogIAIeoBAQD8AQAh6wEBAPwBACHsAQAAowIAIO0BAQD8AQAh7gEBAPwBACHvAQEA_AEAIfABAQD8AQAh8QEBAPwBACHyAQAAowIAIAMAAAAoACABAAA6ADAhAAA7ACADAAAAKAAgAQAAKQAwAgAAAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAArwMAIAUAALADACCrAQEAAAABrwFAAAAAAcYBAQAAAAHJAQEAAAAB0AEBAAAAAeUBAQAAAAHmAQEAAAABARUAAEMAIAerAQEAAAABrwFAAAAAAcYBAQAAAAHJAQEAAAAB0AEBAAAAAeUBAQAAAAHmAQEAAAABARUAAEUAMAEVAABFADAJAwAAoQMAIAUAAKIDACCrAQEAvgIAIa8BQAC_AgAhxgEBAL4CACHJAQEAvgIAIdABAQC-AgAh5QEBAL4CACHmAQEAvgIAIQIAAAAFACAVAABIACAHqwEBAL4CACGvAUAAvwIAIcYBAQC-AgAhyQEBAL4CACHQAQEAvgIAIeUBAQC-AgAh5gEBAL4CACECAAAAAwAgFQAASgAgAgAAAAMAIBUAAEoAIAMAAAAFACAcAABDACAdAABIACABAAAABQAgAQAAAAMAIAMGAACeAwAgJAAAoAMAICUAAJ8DACAKqAEAAKACADCpAQAAUQAQqgEAAKACADCrAQEA9AEAIa8BQAD1AQAhxgEBAPQBACHJAQEA9AEAIdABAQD0AQAh5QEBAPQBACHmAQEA9AEAIQMAAAADACABAABQADAhAABRACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAGBAAAnQMAIKsBAQAAAAGsAQEAAAABrgFAAAAAAa8BQAAAAAHkAQEAAAABARUAAFkAIAWrAQEAAAABrAEBAAAAAa4BQAAAAAGvAUAAAAAB5AEBAAAAAQEVAABbADABFQAAWwAwBgQAAJwDACCrAQEAvgIAIawBAQC-AgAhrgFAAL8CACGvAUAAvwIAIeQBAQC-AgAhAgAAAAkAIBUAAF4AIAWrAQEAvgIAIawBAQC-AgAhrgFAAL8CACGvAUAAvwIAIeQBAQC-AgAhAgAAAAcAIBUAAGAAIAIAAAAHACAVAABgACADAAAACQAgHAAAWQAgHQAAXgAgAQAAAAkAIAEAAAAHACADBgAAmQMAICQAAJsDACAlAACaAwAgCKgBAACfAgAwqQEAAGcAEKoBAACfAgAwqwEBAPQBACGsAQEA9AEAIa4BQAD1AQAhrwFAAPUBACHkAQEA9AEAIQMAAAAHACABAABmADAhAABnACADAAAABwAgAQAACAAwAgAACQAgAQAAAA4AIAEAAAAOACADAAAADAAgAQAADQAwAgAADgAgAwAAAAwAIAEAAA0AMAIAAA4AIAMAAAAMACABAAANADACAAAOACARAwAAlwMAIAsAAJgDACCrAQEAAAABrwFAAAAAAbABQAAAAAHJAQEAAAABywEAAADeAQLZAQEAAAAB2gEBAAAAAdsBAQAAAAHcARAAAAAB3gEBAAAAAd8BAQAAAAHgAYAAAAAB4QEBAAAAAeIBEAAAAAHjARAAAAABARUAAG8AIA-rAQEAAAABrwFAAAAAAbABQAAAAAHJAQEAAAABywEAAADeAQLZAQEAAAAB2gEBAAAAAdsBAQAAAAHcARAAAAAB3gEBAAAAAd8BAQAAAAHgAYAAAAAB4QEBAAAAAeIBEAAAAAHjARAAAAABARUAAHEAMAEVAABxADARAwAAjAMAIAsAAI0DACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACHJAQEAvgIAIcsBAACLA94BItkBAQC-AgAh2gEBAL4CACHbAQEAxgIAIdwBEACKAwAh3gEBAMYCACHfAQEAxgIAIeABgAAAAAHhAQEAxgIAIeIBEACKAwAh4wEQAIoDACECAAAADgAgFQAAdAAgD6sBAQC-AgAhrwFAAL8CACGwAUAAvwIAIckBAQC-AgAhywEAAIsD3gEi2QEBAL4CACHaAQEAvgIAIdsBAQDGAgAh3AEQAIoDACHeAQEAxgIAId8BAQDGAgAh4AGAAAAAAeEBAQDGAgAh4gEQAIoDACHjARAAigMAIQIAAAAMACAVAAB2ACACAAAADAAgFQAAdgAgAwAAAA4AIBwAAG8AIB0AAHQAIAEAAAAOACABAAAADAAgDQYAAIUDACAiAACGAwAgIwAAiQMAICQAAIgDACAlAACHAwAg2wEAAMICACDcAQAAwgIAIN4BAADCAgAg3wEAAMICACDgAQAAwgIAIOEBAADCAgAg4gEAAMICACDjAQAAwgIAIBKoAQAAmAIAMKkBAAB9ABCqAQAAmAIAMKsBAQD0AQAhrwFAAPUBACGwAUAA9QEAIckBAQD0AQAhywEAAJoC3gEi2QEBAPQBACHaAQEA9AEAIdsBAQD8AQAh3AEQAJkCACHeAQEA_AEAId8BAQD8AQAh4AEAAP0BACDhAQEA_AEAIeIBEACZAgAh4wEQAJkCACEDAAAADAAgAQAAfAAwIQAAfQAgAwAAAAwAIAEAAA0AMAIAAA4AIA8LAACWAgAgDQAAlwIAIKgBAACTAgAwqQEAAIMBABCqAQAAkwIAMKsBAQAAAAGvAUAAhQIAIbABQACFAgAhxgEBAJQCACHQAQEAAAAB0QEBAIMCACHSAQEAgwIAIdMBAQCDAgAh1AEAAIQCACDVAUAAlQIAIQEAAACAAQAgAQAAAIABACAPCwAAlgIAIA0AAJcCACCoAQAAkwIAMKkBAACDAQAQqgEAAJMCADCrAQEAlAIAIa8BQACFAgAhsAFAAIUCACHGAQEAlAIAIdABAQCUAgAh0QEBAIMCACHSAQEAgwIAIdMBAQCDAgAh1AEAAIQCACDVAUAAlQIAIQcLAACDAwAgDQAAhAMAINEBAADCAgAg0gEAAMICACDTAQAAwgIAINQBAADCAgAg1QEAAMICACADAAAAgwEAIAEAAIQBADACAACAAQAgAwAAAIMBACABAACEAQAwAgAAgAEAIAMAAACDAQAgAQAAhAEAMAIAAIABACAMCwAAgQMAIA0AAIIDACCrAQEAAAABrwFAAAAAAbABQAAAAAHGAQEAAAAB0AEBAAAAAdEBAQAAAAHSAQEAAAAB0wEBAAAAAdQBgAAAAAHVAUAAAAABARUAAIgBACAKqwEBAAAAAa8BQAAAAAGwAUAAAAABxgEBAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQAAAAHUAYAAAAAB1QFAAAAAAQEVAACKAQAwARUAAIoBADAMCwAA7gIAIA0AAO8CACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACHGAQEAvgIAIdABAQC-AgAh0QEBAMYCACHSAQEAxgIAIdMBAQDGAgAh1AGAAAAAAdUBQADtAgAhAgAAAIABACAVAACNAQAgCqsBAQC-AgAhrwFAAL8CACGwAUAAvwIAIcYBAQC-AgAh0AEBAL4CACHRAQEAxgIAIdIBAQDGAgAh0wEBAMYCACHUAYAAAAAB1QFAAO0CACECAAAAgwEAIBUAAI8BACACAAAAgwEAIBUAAI8BACADAAAAgAEAIBwAAIgBACAdAACNAQAgAQAAAIABACABAAAAgwEAIAgGAADqAgAgJAAA7AIAICUAAOsCACDRAQAAwgIAINIBAADCAgAg0wEAAMICACDUAQAAwgIAINUBAADCAgAgDagBAACPAgAwqQEAAJYBABCqAQAAjwIAMKsBAQD0AQAhrwFAAPUBACGwAUAA9QEAIcYBAQD0AQAh0AEBAPQBACHRAQEA_AEAIdIBAQD8AQAh0wEBAPwBACHUAQAA_QEAINUBQACQAgAhAwAAAIMBACABAACVAQAwIQAAlgEAIAMAAACDAQAgAQAAhAEAMAIAAIABACABAAAAEgAgAQAAABIAIAMAAAAQACABAAARADACAAASACADAAAAEAAgAQAAEQAwAgAAEgAgAwAAABAAIAEAABEAMAIAABIAIA4DAADpAgAgCQAA5gIAIAoAAOcCACAMAADoAgAgqwEBAAAAAa8BQAAAAAGwAUAAAAABvAEBAAAAAckBAQAAAAHLAQAAAMsBAswBAQAAAAHNAQIAAAABzgGAAAAAAc8BAQAAAAEBFQAAngEAIAqrAQEAAAABrwFAAAAAAbABQAAAAAG8AQEAAAAByQEBAAAAAcsBAAAAywECzAEBAAAAAc0BAgAAAAHOAYAAAAABzwEBAAAAAQEVAACgAQAwARUAAKABADAOAwAA2QIAIAkAANYCACAKAADXAgAgDAAA2AIAIKsBAQC-AgAhrwFAAL8CACGwAUAAvwIAIbwBAQC-AgAhyQEBAL4CACHLAQAA1ALLASLMAQEAxgIAIc0BAgDVAgAhzgGAAAAAAc8BAQC-AgAhAgAAABIAIBUAAKMBACAKqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhvAEBAL4CACHJAQEAvgIAIcsBAADUAssBIswBAQDGAgAhzQECANUCACHOAYAAAAABzwEBAL4CACECAAAAEAAgFQAApQEAIAIAAAAQACAVAAClAQAgAwAAABIAIBwAAJ4BACAdAACjAQAgAQAAABIAIAEAAAAQACAIBgAAzwIAICIAANACACAjAADTAgAgJAAA0gIAICUAANECACDMAQAAwgIAIM0BAADCAgAgzgEAAMICACANqAEAAIgCADCpAQAArAEAEKoBAACIAgAwqwEBAPQBACGvAUAA9QEAIbABQAD1AQAhvAEBAPQBACHJAQEA9AEAIcsBAACJAssBIswBAQD8AQAhzQECAIoCACHOAQAA_QEAIM8BAQD0AQAhAwAAABAAIAEAAKsBADAhAACsAQAgAwAAABAAIAEAABEAMAIAABIAIAEAAAAhACABAAAAIQAgAwAAAB8AIAEAACAAMAIAACEAIAMAAAAfACABAAAgADACAAAhACADAAAAHwAgAQAAIAAwAgAAIQAgCAMAAM4CACCrAQEAAAABrwFAAAAAAbABQAAAAAHGAQEAAAABxwEBAAAAAcgBAQAAAAHJAQEAAAABARUAALQBACAHqwEBAAAAAa8BQAAAAAGwAUAAAAABxgEBAAAAAccBAQAAAAHIAQEAAAAByQEBAAAAAQEVAAC2AQAwARUAALYBADAIAwAAzQIAIKsBAQC-AgAhrwFAAL8CACGwAUAAvwIAIcYBAQC-AgAhxwEBAL4CACHIAQEAxgIAIckBAQC-AgAhAgAAACEAIBUAALkBACAHqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhxgEBAL4CACHHAQEAvgIAIcgBAQDGAgAhyQEBAL4CACECAAAAHwAgFQAAuwEAIAIAAAAfACAVAAC7AQAgAwAAACEAIBwAALQBACAdAAC5AQAgAQAAACEAIAEAAAAfACAEBgAAygIAICQAAMwCACAlAADLAgAgyAEAAMICACAKqAEAAIcCADCpAQAAwgEAEKoBAACHAgAwqwEBAPQBACGvAUAA9QEAIbABQAD1AQAhxgEBAPQBACHHAQEA9AEAIcgBAQD8AQAhyQEBAPQBACEDAAAAHwAgAQAAwQEAMCEAAMIBACADAAAAHwAgAQAAIAAwAgAAIQAgCwwAAIYCACCoAQAAggIAMKkBAAAZABCqAQAAggIAMKsBAQAAAAGvAUAAhQIAIbABQACFAgAhvAEBAAAAAb0BAQCDAgAhvgEBAIMCACG_AQAAhAIAIAEAAADFAQAgAQAAAMUBACAEDAAAyQIAIL0BAADCAgAgvgEAAMICACC_AQAAwgIAIAMAAAAZACABAADIAQAwAgAAxQEAIAMAAAAZACABAADIAQAwAgAAxQEAIAMAAAAZACABAADIAQAwAgAAxQEAIAgMAADIAgAgqwEBAAAAAa8BQAAAAAGwAUAAAAABvAEBAAAAAb0BAQAAAAG-AQEAAAABvwGAAAAAAQEVAADMAQAgB6sBAQAAAAGvAUAAAAABsAFAAAAAAbwBAQAAAAG9AQEAAAABvgEBAAAAAb8BgAAAAAEBFQAAzgEAMAEVAADOAQAwCAwAAMcCACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACG8AQEAvgIAIb0BAQDGAgAhvgEBAMYCACG_AYAAAAABAgAAAMUBACAVAADRAQAgB6sBAQC-AgAhrwFAAL8CACGwAUAAvwIAIbwBAQC-AgAhvQEBAMYCACG-AQEAxgIAIb8BgAAAAAECAAAAGQAgFQAA0wEAIAIAAAAZACAVAADTAQAgAwAAAMUBACAcAADMAQAgHQAA0QEAIAEAAADFAQAgAQAAABkAIAYGAADDAgAgJAAAxQIAICUAAMQCACC9AQAAwgIAIL4BAADCAgAgvwEAAMICACAKqAEAAPsBADCpAQAA2gEAEKoBAAD7AQAwqwEBAPQBACGvAUAA9QEAIbABQAD1AQAhvAEBAPQBACG9AQEA_AEAIb4BAQD8AQAhvwEAAP0BACADAAAAGQAgAQAA2QEAMCEAANoBACADAAAAGQAgAQAAyAEAMAIAAMUBACABAAAAFgAgAQAAABYAIAMAAAAUACABAAAVADACAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAABQAIAEAABUAMAIAABYAIAcIAADBAgAgqwEBAAAAAawBAQAAAAGtAQEAAAABrgFAAAAAAa8BQAAAAAGwAUAAAAABARUAAOIBACAGqwEBAAAAAawBAQAAAAGtAQEAAAABrgFAAAAAAa8BQAAAAAGwAUAAAAABARUAAOQBADABFQAA5AEAMAcIAADAAgAgqwEBAL4CACGsAQEAvgIAIa0BAQC-AgAhrgFAAL8CACGvAUAAvwIAIbABQAC_AgAhAgAAABYAIBUAAOcBACAGqwEBAL4CACGsAQEAvgIAIa0BAQC-AgAhrgFAAL8CACGvAUAAvwIAIbABQAC_AgAhAgAAABQAIBUAAOkBACACAAAAFAAgFQAA6QEAIAMAAAAWACAcAADiAQAgHQAA5wEAIAEAAAAWACABAAAAFAAgAwYAALsCACAkAAC9AgAgJQAAvAIAIAmoAQAA8wEAMKkBAADwAQAQqgEAAPMBADCrAQEA9AEAIawBAQD0AQAhrQEBAPQBACGuAUAA9QEAIa8BQAD1AQAhsAFAAPUBACEDAAAAFAAgAQAA7wEAMCEAAPABACADAAAAFAAgAQAAFQAwAgAAFgAgCagBAADzAQAwqQEAAPABABCqAQAA8wEAMKsBAQD0AQAhrAEBAPQBACGtAQEA9AEAIa4BQAD1AQAhrwFAAPUBACGwAUAA9QEAIQ4GAAD3AQAgJAAA-gEAICUAAPoBACCxAQEAAAABsgEBAAAABLMBAQAAAAS0AQEAAAABtQEBAAAAAbYBAQAAAAG3AQEAAAABuAEBAPkBACG5AQEAAAABugEBAAAAAbsBAQAAAAELBgAA9wEAICQAAPgBACAlAAD4AQAgsQFAAAAAAbIBQAAAAASzAUAAAAAEtAFAAAAAAbUBQAAAAAG2AUAAAAABtwFAAAAAAbgBQAD2AQAhCwYAAPcBACAkAAD4AQAgJQAA-AEAILEBQAAAAAGyAUAAAAAEswFAAAAABLQBQAAAAAG1AUAAAAABtgFAAAAAAbcBQAAAAAG4AUAA9gEAIQixAQIAAAABsgECAAAABLMBAgAAAAS0AQIAAAABtQECAAAAAbYBAgAAAAG3AQIAAAABuAECAPcBACEIsQFAAAAAAbIBQAAAAASzAUAAAAAEtAFAAAAAAbUBQAAAAAG2AUAAAAABtwFAAAAAAbgBQAD4AQAhDgYAAPcBACAkAAD6AQAgJQAA-gEAILEBAQAAAAGyAQEAAAAEswEBAAAABLQBAQAAAAG1AQEAAAABtgEBAAAAAbcBAQAAAAG4AQEA-QEAIbkBAQAAAAG6AQEAAAABuwEBAAAAAQuxAQEAAAABsgEBAAAABLMBAQAAAAS0AQEAAAABtQEBAAAAAbYBAQAAAAG3AQEAAAABuAEBAPoBACG5AQEAAAABugEBAAAAAbsBAQAAAAEKqAEAAPsBADCpAQAA2gEAEKoBAAD7AQAwqwEBAPQBACGvAUAA9QEAIbABQAD1AQAhvAEBAPQBACG9AQEA_AEAIb4BAQD8AQAhvwEAAP0BACAOBgAA_gEAICQAAIECACAlAACBAgAgsQEBAAAAAbIBAQAAAAWzAQEAAAAFtAEBAAAAAbUBAQAAAAG2AQEAAAABtwEBAAAAAbgBAQCAAgAhuQEBAAAAAboBAQAAAAG7AQEAAAABDwYAAP4BACAkAAD_AQAgJQAA_wEAILEBgAAAAAG0AYAAAAABtQGAAAAAAbYBgAAAAAG3AYAAAAABuAGAAAAAAcABAQAAAAHBAQEAAAABwgEBAAAAAcMBgAAAAAHEAYAAAAABxQGAAAAAAQixAQIAAAABsgECAAAABbMBAgAAAAW0AQIAAAABtQECAAAAAbYBAgAAAAG3AQIAAAABuAECAP4BACEMsQGAAAAAAbQBgAAAAAG1AYAAAAABtgGAAAAAAbcBgAAAAAG4AYAAAAABwAEBAAAAAcEBAQAAAAHCAQEAAAABwwGAAAAAAcQBgAAAAAHFAYAAAAABDgYAAP4BACAkAACBAgAgJQAAgQIAILEBAQAAAAGyAQEAAAAFswEBAAAABbQBAQAAAAG1AQEAAAABtgEBAAAAAbcBAQAAAAG4AQEAgAIAIbkBAQAAAAG6AQEAAAABuwEBAAAAAQuxAQEAAAABsgEBAAAABbMBAQAAAAW0AQEAAAABtQEBAAAAAbYBAQAAAAG3AQEAAAABuAEBAIECACG5AQEAAAABugEBAAAAAbsBAQAAAAELDAAAhgIAIKgBAACCAgAwqQEAABkAEKoBAACCAgAwqwEBAJQCACGvAUAAhQIAIbABQACFAgAhvAEBAJQCACG9AQEAgwIAIb4BAQCDAgAhvwEAAIQCACALsQEBAAAAAbIBAQAAAAWzAQEAAAAFtAEBAAAAAbUBAQAAAAG2AQEAAAABtwEBAAAAAbgBAQCBAgAhuQEBAAAAAboBAQAAAAG7AQEAAAABDLEBgAAAAAG0AYAAAAABtQGAAAAAAbYBgAAAAAG3AYAAAAABuAGAAAAAAcABAQAAAAHBAQEAAAABwgEBAAAAAcMBgAAAAAHEAYAAAAABxQGAAAAAAQixAUAAAAABsgFAAAAABLMBQAAAAAS0AUAAAAABtQFAAAAAAbYBQAAAAAG3AUAAAAABuAFAAPgBACERCwAAlgIAIA0AAJcCACCoAQAAkwIAMKkBAACDAQAQqgEAAJMCADCrAQEAlAIAIa8BQACFAgAhsAFAAIUCACHGAQEAlAIAIdABAQCUAgAh0QEBAIMCACHSAQEAgwIAIdMBAQCDAgAh1AEAAIQCACDVAUAAlQIAIfYBAACDAQAg9wEAAIMBACAKqAEAAIcCADCpAQAAwgEAEKoBAACHAgAwqwEBAPQBACGvAUAA9QEAIbABQAD1AQAhxgEBAPQBACHHAQEA9AEAIcgBAQD8AQAhyQEBAPQBACENqAEAAIgCADCpAQAArAEAEKoBAACIAgAwqwEBAPQBACGvAUAA9QEAIbABQAD1AQAhvAEBAPQBACHJAQEA9AEAIcsBAACJAssBIswBAQD8AQAhzQECAIoCACHOAQAA_QEAIM8BAQD0AQAhBwYAAPcBACAkAACOAgAgJQAAjgIAILEBAAAAywECsgEAAADLAQizAQAAAMsBCLgBAACNAssBIg0GAAD-AQAgIgAAjAIAICMAAP4BACAkAAD-AQAgJQAA_gEAILEBAgAAAAGyAQIAAAAFswECAAAABbQBAgAAAAG1AQIAAAABtgECAAAAAbcBAgAAAAG4AQIAiwIAIQ0GAAD-AQAgIgAAjAIAICMAAP4BACAkAAD-AQAgJQAA_gEAILEBAgAAAAGyAQIAAAAFswECAAAABbQBAgAAAAG1AQIAAAABtgECAAAAAbcBAgAAAAG4AQIAiwIAIQixAQgAAAABsgEIAAAABbMBCAAAAAW0AQgAAAABtQEIAAAAAbYBCAAAAAG3AQgAAAABuAEIAIwCACEHBgAA9wEAICQAAI4CACAlAACOAgAgsQEAAADLAQKyAQAAAMsBCLMBAAAAywEIuAEAAI0CywEiBLEBAAAAywECsgEAAADLAQizAQAAAMsBCLgBAACOAssBIg2oAQAAjwIAMKkBAACWAQAQqgEAAI8CADCrAQEA9AEAIa8BQAD1AQAhsAFAAPUBACHGAQEA9AEAIdABAQD0AQAh0QEBAPwBACHSAQEA_AEAIdMBAQD8AQAh1AEAAP0BACDVAUAAkAIAIQsGAAD-AQAgJAAAkgIAICUAAJICACCxAUAAAAABsgFAAAAABbMBQAAAAAW0AUAAAAABtQFAAAAAAbYBQAAAAAG3AUAAAAABuAFAAJECACELBgAA_gEAICQAAJICACAlAACSAgAgsQFAAAAAAbIBQAAAAAWzAUAAAAAFtAFAAAAAAbUBQAAAAAG2AUAAAAABtwFAAAAAAbgBQACRAgAhCLEBQAAAAAGyAUAAAAAFswFAAAAABbQBQAAAAAG1AUAAAAABtgFAAAAAAbcBQAAAAAG4AUAAkgIAIQ8LAACWAgAgDQAAlwIAIKgBAACTAgAwqQEAAIMBABCqAQAAkwIAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIcYBAQCUAgAh0AEBAJQCACHRAQEAgwIAIdIBAQCDAgAh0wEBAIMCACHUAQAAhAIAINUBQACVAgAhC7EBAQAAAAGyAQEAAAAEswEBAAAABLQBAQAAAAG1AQEAAAABtgEBAAAAAbcBAQAAAAG4AQEA-gEAIbkBAQAAAAG6AQEAAAABuwEBAAAAAQixAUAAAAABsgFAAAAABbMBQAAAAAW0AUAAAAABtQFAAAAAAbYBQAAAAAG3AUAAAAABuAFAAJICACED1gEAABAAINcBAAAQACDYAQAAEAAgDQwAAIYCACCoAQAAggIAMKkBAAAZABCqAQAAggIAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIbwBAQCUAgAhvQEBAIMCACG-AQEAgwIAIb8BAACEAgAg9gEAABkAIPcBAAAZACASqAEAAJgCADCpAQAAfQAQqgEAAJgCADCrAQEA9AEAIa8BQAD1AQAhsAFAAPUBACHJAQEA9AEAIcsBAACaAt4BItkBAQD0AQAh2gEBAPQBACHbAQEA_AEAIdwBEACZAgAh3gEBAPwBACHfAQEA_AEAIeABAAD9AQAg4QEBAPwBACHiARAAmQIAIeMBEACZAgAhDQYAAP4BACAiAACeAgAgIwAAngIAICQAAJ4CACAlAACeAgAgsQEQAAAAAbIBEAAAAAWzARAAAAAFtAEQAAAAAbUBEAAAAAG2ARAAAAABtwEQAAAAAbgBEACdAgAhBwYAAPcBACAkAACcAgAgJQAAnAIAILEBAAAA3gECsgEAAADeAQizAQAAAN4BCLgBAACbAt4BIgcGAAD3AQAgJAAAnAIAICUAAJwCACCxAQAAAN4BArIBAAAA3gEIswEAAADeAQi4AQAAmwLeASIEsQEAAADeAQKyAQAAAN4BCLMBAAAA3gEIuAEAAJwC3gEiDQYAAP4BACAiAACeAgAgIwAAngIAICQAAJ4CACAlAACeAgAgsQEQAAAAAbIBEAAAAAWzARAAAAAFtAEQAAAAAbUBEAAAAAG2ARAAAAABtwEQAAAAAbgBEACdAgAhCLEBEAAAAAGyARAAAAAFswEQAAAABbQBEAAAAAG1ARAAAAABtgEQAAAAAbcBEAAAAAG4ARAAngIAIQioAQAAnwIAMKkBAABnABCqAQAAnwIAMKsBAQD0AQAhrAEBAPQBACGuAUAA9QEAIa8BQAD1AQAh5AEBAPQBACEKqAEAAKACADCpAQAAUQAQqgEAAKACADCrAQEA9AEAIa8BQAD1AQAhxgEBAPQBACHJAQEA9AEAIdABAQD0AQAh5QEBAPQBACHmAQEA9AEAIROoAQAAoQIAMKkBAAA7ABCqAQAAoQIAMKsBAQD0AQAhrwFAAPUBACGwAUAA9QEAIcYBAQD8AQAh5wEBAPQBACHoAQEA9AEAIekBAgCiAgAh6gEBAPwBACHrAQEA_AEAIewBAACjAgAg7QEBAPwBACHuAQEA_AEAIe8BAQD8AQAh8AEBAPwBACHxAQEA_AEAIfIBAACjAgAgDQYAAPcBACAiAAClAgAgIwAA9wEAICQAAPcBACAlAAD3AQAgsQECAAAAAbIBAgAAAASzAQIAAAAEtAECAAAAAbUBAgAAAAG2AQIAAAABtwECAAAAAbgBAgCkAgAhBLEBAQAAAAXzAQEAAAAB9AEBAAAABPUBAQAAAAQNBgAA9wEAICIAAKUCACAjAAD3AQAgJAAA9wEAICUAAPcBACCxAQIAAAABsgECAAAABLMBAgAAAAS0AQIAAAABtQECAAAAAbYBAgAAAAG3AQIAAAABuAECAKQCACEIsQEIAAAAAbIBCAAAAASzAQgAAAAEtAEIAAAAAbUBCAAAAAG2AQgAAAABtwEIAAAAAbgBCAClAgAhFwcAAKgCACALAACWAgAgDgAAqQIAIA8AAKoCACCoAQAApgIAMKkBAAAoABCqAQAApgIAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIcYBAQCDAgAh5wEBAJQCACHoAQEAlAIAIekBAgCnAgAh6gEBAIMCACHrAQEAgwIAIewBAACjAgAg7QEBAIMCACHuAQEAgwIAIe8BAQCDAgAh8AEBAIMCACHxAQEAgwIAIfIBAACjAgAgCLEBAgAAAAGyAQIAAAAEswECAAAABLQBAgAAAAG1AQIAAAABtgECAAAAAbcBAgAAAAG4AQIA9wEAIQPWAQAAAwAg1wEAAAMAINgBAAADACAD1gEAAAwAINcBAAAMACDYAQAADAAgA9YBAAAfACDXAQAAHwAg2AEAAB8AIAsDAACsAgAgqAEAAKsCADCpAQAAHwAQqgEAAKsCADCrAQEAlAIAIa8BQACFAgAhsAFAAIUCACHGAQEAlAIAIccBAQCUAgAhyAEBAIMCACHJAQEAlAIAIRkHAACoAgAgCwAAlgIAIA4AAKkCACAPAACqAgAgqAEAAKYCADCpAQAAKAAQqgEAAKYCADCrAQEAlAIAIa8BQACFAgAhsAFAAIUCACHGAQEAgwIAIecBAQCUAgAh6AEBAJQCACHpAQIApwIAIeoBAQCDAgAh6wEBAIMCACHsAQAAowIAIO0BAQCDAgAh7gEBAIMCACHvAQEAgwIAIfABAQCDAgAh8QEBAIMCACHyAQAAowIAIPYBAAAoACD3AQAAKAAgCggAAK4CACCoAQAArQIAMKkBAAAUABCqAQAArQIAMKsBAQCUAgAhrAEBAJQCACGtAQEAlAIAIa4BQACFAgAhrwFAAIUCACGwAUAAhQIAIRMDAACsAgAgCQAAsgIAIAoAALMCACAMAACGAgAgqAEAAK8CADCpAQAAEAAQqgEAAK8CADCrAQEAlAIAIa8BQACFAgAhsAFAAIUCACG8AQEAlAIAIckBAQCUAgAhywEAALACywEizAEBAIMCACHNAQIAsQIAIc4BAACEAgAgzwEBAJQCACH2AQAAEAAg9wEAABAAIBEDAACsAgAgCQAAsgIAIAoAALMCACAMAACGAgAgqAEAAK8CADCpAQAAEAAQqgEAAK8CADCrAQEAlAIAIa8BQACFAgAhsAFAAIUCACG8AQEAlAIAIckBAQCUAgAhywEAALACywEizAEBAIMCACHNAQIAsQIAIc4BAACEAgAgzwEBAJQCACEEsQEAAADLAQKyAQAAAMsBCLMBAAAAywEIuAEAAI4CywEiCLEBAgAAAAGyAQIAAAAFswECAAAABbQBAgAAAAG1AQIAAAABtgECAAAAAbcBAgAAAAG4AQIA_gEAIQPWAQAAFAAg1wEAABQAINgBAAAUACAWAwAArAIAIAsAAJYCACCoAQAAtAIAMKkBAAAMABCqAQAAtAIAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIckBAQCUAgAhywEAALYC3gEi2QEBAJQCACHaAQEAlAIAIdsBAQCDAgAh3AEQALUCACHeAQEAgwIAId8BAQCDAgAh4AEAAIQCACDhAQEAgwIAIeIBEAC1AgAh4wEQALUCACH2AQAADAAg9wEAAAwAIBQDAACsAgAgCwAAlgIAIKgBAAC0AgAwqQEAAAwAEKoBAAC0AgAwqwEBAJQCACGvAUAAhQIAIbABQACFAgAhyQEBAJQCACHLAQAAtgLeASLZAQEAlAIAIdoBAQCUAgAh2wEBAIMCACHcARAAtQIAId4BAQCDAgAh3wEBAIMCACHgAQAAhAIAIOEBAQCDAgAh4gEQALUCACHjARAAtQIAIQixARAAAAABsgEQAAAABbMBEAAAAAW0ARAAAAABtQEQAAAAAbYBEAAAAAG3ARAAAAABuAEQAJ4CACEEsQEAAADeAQKyAQAAAN4BCLMBAAAA3gEIuAEAAJwC3gEiCQQAALgCACCoAQAAtwIAMKkBAAAHABCqAQAAtwIAMKsBAQCUAgAhrAEBAJQCACGuAUAAhQIAIa8BQACFAgAh5AEBAJQCACEOAwAArAIAIAUAALoCACCoAQAAuQIAMKkBAAADABCqAQAAuQIAMKsBAQCUAgAhrwFAAIUCACHGAQEAlAIAIckBAQCUAgAh0AEBAJQCACHlAQEAlAIAIeYBAQCUAgAh9gEAAAMAIPcBAAADACAMAwAArAIAIAUAALoCACCoAQAAuQIAMKkBAAADABCqAQAAuQIAMKsBAQCUAgAhrwFAAIUCACHGAQEAlAIAIckBAQCUAgAh0AEBAJQCACHlAQEAlAIAIeYBAQCUAgAhA9YBAAAHACDXAQAABwAg2AEAAAcAIAAAAAH7AQEAAAABAfsBQAAAAAEFHAAAqQQAIB0AAKwEACD4AQAAqgQAIPkBAACrBAAg_gEAABIAIAMcAACpBAAg-AEAAKoEACD-AQAAEgAgAAAAAAH7AQEAAAABBRwAAKQEACAdAACnBAAg-AEAAKUEACD5AQAApgQAIP4BAACAAQAgAxwAAKQEACD4AQAApQQAIP4BAACAAQAgBwsAAIMDACANAACEAwAg0QEAAMICACDSAQAAwgIAINMBAADCAgAg1AEAAMICACDVAQAAwgIAIAAAAAUcAACfBAAgHQAAogQAIPgBAACgBAAg-QEAAKEEACD-AQAAAQAgAxwAAJ8EACD4AQAAoAQAIP4BAAABACAAAAAAAAH7AQAAAMsBAgX7AQIAAAABggICAAAAAYMCAgAAAAGEAgIAAAABhQICAAAAAQscAADaAgAwHQAA3wIAMPgBAADbAgAw-QEAANwCADD6AQAA3QIAIPsBAADeAgAw_AEAAN4CADD9AQAA3gIAMP4BAADeAgAw_wEAAOACADCAAgAA4QIAMAUcAACTBAAgHQAAnQQAIPgBAACUBAAg-QEAAJwEACD-AQAADgAgBRwAAJEEACAdAACaBAAg-AEAAJIEACD5AQAAmQQAIP4BAACAAQAgBRwAAI8EACAdAACXBAAg-AEAAJAEACD5AQAAlgQAIP4BAAABACAFqwEBAAAAAawBAQAAAAGuAUAAAAABrwFAAAAAAbABQAAAAAECAAAAFgAgHAAA5QIAIAMAAAAWACAcAADlAgAgHQAA5AIAIAEVAACVBAAwCggAAK4CACCoAQAArQIAMKkBAAAUABCqAQAArQIAMKsBAQAAAAGsAQEAAAABrQEBAJQCACGuAUAAhQIAIa8BQACFAgAhsAFAAIUCACECAAAAFgAgFQAA5AIAIAIAAADiAgAgFQAA4wIAIAmoAQAA4QIAMKkBAADiAgAQqgEAAOECADCrAQEAlAIAIawBAQCUAgAhrQEBAJQCACGuAUAAhQIAIa8BQACFAgAhsAFAAIUCACEJqAEAAOECADCpAQAA4gIAEKoBAADhAgAwqwEBAJQCACGsAQEAlAIAIa0BAQCUAgAhrgFAAIUCACGvAUAAhQIAIbABQACFAgAhBasBAQC-AgAhrAEBAL4CACGuAUAAvwIAIa8BQAC_AgAhsAFAAL8CACEFqwEBAL4CACGsAQEAvgIAIa4BQAC_AgAhrwFAAL8CACGwAUAAvwIAIQWrAQEAAAABrAEBAAAAAa4BQAAAAAGvAUAAAAABsAFAAAAAAQQcAADaAgAw-AEAANsCADD6AQAA3QIAIP4BAADeAgAwAxwAAJMEACD4AQAAlAQAIP4BAAAOACADHAAAkQQAIPgBAACSBAAg_gEAAIABACADHAAAjwQAIPgBAACQBAAg_gEAAAEAIAAAAAH7AUAAAAABCxwAAPUCADAdAAD6AgAw-AEAAPYCADD5AQAA9wIAMPoBAAD4AgAg-wEAAPkCADD8AQAA-QIAMP0BAAD5AgAw_gEAAPkCADD_AQAA-wIAMIACAAD8AgAwBxwAAPACACAdAADzAgAg-AEAAPECACD5AQAA8gIAIPwBAAAZACD9AQAAGQAg_gEAAMUBACAGqwEBAAAAAa8BQAAAAAGwAUAAAAABvQEBAAAAAb4BAQAAAAG_AYAAAAABAgAAAMUBACAcAADwAgAgAwAAABkAIBwAAPACACAdAAD0AgAgCAAAABkAIBUAAPQCACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACG9AQEAxgIAIb4BAQDGAgAhvwGAAAAAAQarAQEAvgIAIa8BQAC_AgAhsAFAAL8CACG9AQEAxgIAIb4BAQDGAgAhvwGAAAAAAQwDAADpAgAgCQAA5gIAIAoAAOcCACCrAQEAAAABrwFAAAAAAbABQAAAAAHJAQEAAAABywEAAADLAQLMAQEAAAABzQECAAAAAc4BgAAAAAHPAQEAAAABAgAAABIAIBwAAIADACADAAAAEgAgHAAAgAMAIB0AAP8CACABFQAAjgQAMBEDAACsAgAgCQAAsgIAIAoAALMCACAMAACGAgAgqAEAAK8CADCpAQAAEAAQqgEAAK8CADCrAQEAAAABrwFAAIUCACGwAUAAhQIAIbwBAQCUAgAhyQEBAJQCACHLAQAAsALLASLMAQEAgwIAIc0BAgCxAgAhzgEAAIQCACDPAQEAlAIAIQIAAAASACAVAAD_AgAgAgAAAP0CACAVAAD-AgAgDagBAAD8AgAwqQEAAP0CABCqAQAA_AIAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIbwBAQCUAgAhyQEBAJQCACHLAQAAsALLASLMAQEAgwIAIc0BAgCxAgAhzgEAAIQCACDPAQEAlAIAIQ2oAQAA_AIAMKkBAAD9AgAQqgEAAPwCADCrAQEAlAIAIa8BQACFAgAhsAFAAIUCACG8AQEAlAIAIckBAQCUAgAhywEAALACywEizAEBAIMCACHNAQIAsQIAIc4BAACEAgAgzwEBAJQCACEJqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhyQEBAL4CACHLAQAA1ALLASLMAQEAxgIAIc0BAgDVAgAhzgGAAAAAAc8BAQC-AgAhDAMAANkCACAJAADWAgAgCgAA1wIAIKsBAQC-AgAhrwFAAL8CACGwAUAAvwIAIckBAQC-AgAhywEAANQCywEizAEBAMYCACHNAQIA1QIAIc4BgAAAAAHPAQEAvgIAIQwDAADpAgAgCQAA5gIAIAoAAOcCACCrAQEAAAABrwFAAAAAAbABQAAAAAHJAQEAAAABywEAAADLAQLMAQEAAAABzQECAAAAAc4BgAAAAAHPAQEAAAABBBwAAPUCADD4AQAA9gIAMPoBAAD4AgAg_gEAAPkCADADHAAA8AIAIPgBAADxAgAg_gEAAMUBACAABAwAAMkCACC9AQAAwgIAIL4BAADCAgAgvwEAAMICACAAAAAAAAX7ARAAAAABggIQAAAAAYMCEAAAAAGEAhAAAAABhQIQAAAAAQH7AQAAAN4BAgUcAACIBAAgHQAAjAQAIPgBAACJBAAg-QEAAIsEACD-AQAAAQAgCxwAAI4DADAdAACSAwAw-AEAAI8DADD5AQAAkAMAMPoBAACRAwAg-wEAAPkCADD8AQAA-QIAMP0BAAD5AgAw_gEAAPkCADD_AQAAkwMAMIACAAD8AgAwDAMAAOkCACAJAADmAgAgDAAA6AIAIKsBAQAAAAGvAUAAAAABsAFAAAAAAbwBAQAAAAHJAQEAAAABywEAAADLAQLMAQEAAAABzQECAAAAAc4BgAAAAAECAAAAEgAgHAAAlgMAIAMAAAASACAcAACWAwAgHQAAlQMAIAEVAACKBAAwAgAAABIAIBUAAJUDACACAAAA_QIAIBUAAJQDACAJqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhvAEBAL4CACHJAQEAvgIAIcsBAADUAssBIswBAQDGAgAhzQECANUCACHOAYAAAAABDAMAANkCACAJAADWAgAgDAAA2AIAIKsBAQC-AgAhrwFAAL8CACGwAUAAvwIAIbwBAQC-AgAhyQEBAL4CACHLAQAA1ALLASLMAQEAxgIAIc0BAgDVAgAhzgGAAAAAAQwDAADpAgAgCQAA5gIAIAwAAOgCACCrAQEAAAABrwFAAAAAAbABQAAAAAG8AQEAAAAByQEBAAAAAcsBAAAAywECzAEBAAAAAc0BAgAAAAHOAYAAAAABAxwAAIgEACD4AQAAiQQAIP4BAAABACAEHAAAjgMAMPgBAACPAwAw-gEAAJEDACD-AQAA-QIAMAAAAAUcAACDBAAgHQAAhgQAIPgBAACEBAAg-QEAAIUEACD-AQAABQAgAxwAAIMEACD4AQAAhAQAIP4BAAAFACAAAAAFHAAA_QMAIB0AAIEEACD4AQAA_gMAIPkBAACABAAg_gEAAAEAIAscAACjAwAwHQAAqAMAMPgBAACkAwAw-QEAAKUDADD6AQAApgMAIPsBAACnAwAw_AEAAKcDADD9AQAApwMAMP4BAACnAwAw_wEAAKkDADCAAgAAqgMAMASrAQEAAAABrAEBAAAAAa4BQAAAAAGvAUAAAAABAgAAAAkAIBwAAK4DACADAAAACQAgHAAArgMAIB0AAK0DACABFQAA_wMAMAkEAAC4AgAgqAEAALcCADCpAQAABwAQqgEAALcCADCrAQEAAAABrAEBAAAAAa4BQACFAgAhrwFAAIUCACHkAQEAlAIAIQIAAAAJACAVAACtAwAgAgAAAKsDACAVAACsAwAgCKgBAACqAwAwqQEAAKsDABCqAQAAqgMAMKsBAQCUAgAhrAEBAJQCACGuAUAAhQIAIa8BQACFAgAh5AEBAJQCACEIqAEAAKoDADCpAQAAqwMAEKoBAACqAwAwqwEBAJQCACGsAQEAlAIAIa4BQACFAgAhrwFAAIUCACHkAQEAlAIAIQSrAQEAvgIAIawBAQC-AgAhrgFAAL8CACGvAUAAvwIAIQSrAQEAvgIAIawBAQC-AgAhrgFAAL8CACGvAUAAvwIAIQSrAQEAAAABrAEBAAAAAa4BQAAAAAGvAUAAAAABAxwAAP0DACD4AQAA_gMAIP4BAAABACAEHAAAowMAMPgBAACkAwAw-gEAAKYDACD-AQAApwMAMAAAAAAABfsBAgAAAAGCAgIAAAABgwICAAAAAYQCAgAAAAGFAgIAAAABAvsBAQAAAASBAgEAAAAFAvsBAQAAAASBAgEAAAAFCxwAAN4DADAdAADjAwAw-AEAAN8DADD5AQAA4AMAMPoBAADhAwAg-wEAAOIDADD8AQAA4gMAMP0BAADiAwAw_gEAAOIDADD_AQAA5AMAMIACAADlAwAwCxwAANIDADAdAADXAwAw-AEAANMDADD5AQAA1AMAMPoBAADVAwAg-wEAANYDADD8AQAA1gMAMP0BAADWAwAw_gEAANYDADD_AQAA2AMAMIACAADZAwAwCxwAAMkDADAdAADNAwAw-AEAAMoDADD5AQAAywMAMPoBAADMAwAg-wEAAPkCADD8AQAA-QIAMP0BAAD5AgAw_gEAAPkCADD_AQAAzgMAMIACAAD8AgAwCxwAAL0DADAdAADCAwAw-AEAAL4DADD5AQAAvwMAMPoBAADAAwAg-wEAAMEDADD8AQAAwQMAMP0BAADBAwAw_gEAAMEDADD_AQAAwwMAMIACAADEAwAwBqsBAQAAAAGvAUAAAAABsAFAAAAAAcYBAQAAAAHHAQEAAAAByAEBAAAAAQIAAAAhACAcAADIAwAgAwAAACEAIBwAAMgDACAdAADHAwAgARUAAPwDADALAwAArAIAIKgBAACrAgAwqQEAAB8AEKoBAACrAgAwqwEBAAAAAa8BQACFAgAhsAFAAIUCACHGAQEAlAIAIccBAQCUAgAhyAEBAIMCACHJAQEAlAIAIQIAAAAhACAVAADHAwAgAgAAAMUDACAVAADGAwAgCqgBAADEAwAwqQEAAMUDABCqAQAAxAMAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIcYBAQCUAgAhxwEBAJQCACHIAQEAgwIAIckBAQCUAgAhCqgBAADEAwAwqQEAAMUDABCqAQAAxAMAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIcYBAQCUAgAhxwEBAJQCACHIAQEAgwIAIckBAQCUAgAhBqsBAQC-AgAhrwFAAL8CACGwAUAAvwIAIcYBAQC-AgAhxwEBAL4CACHIAQEAxgIAIQarAQEAvgIAIa8BQAC_AgAhsAFAAL8CACHGAQEAvgIAIccBAQC-AgAhyAEBAMYCACEGqwEBAAAAAa8BQAAAAAGwAUAAAAABxgEBAAAAAccBAQAAAAHIAQEAAAABDAkAAOYCACAKAADnAgAgDAAA6AIAIKsBAQAAAAGvAUAAAAABsAFAAAAAAbwBAQAAAAHLAQAAAMsBAswBAQAAAAHNAQIAAAABzgGAAAAAAc8BAQAAAAECAAAAEgAgHAAA0QMAIAMAAAASACAcAADRAwAgHQAA0AMAIAEVAAD7AwAwAgAAABIAIBUAANADACACAAAA_QIAIBUAAM8DACAJqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhvAEBAL4CACHLAQAA1ALLASLMAQEAxgIAIc0BAgDVAgAhzgGAAAAAAc8BAQC-AgAhDAkAANYCACAKAADXAgAgDAAA2AIAIKsBAQC-AgAhrwFAAL8CACGwAUAAvwIAIbwBAQC-AgAhywEAANQCywEizAEBAMYCACHNAQIA1QIAIc4BgAAAAAHPAQEAvgIAIQwJAADmAgAgCgAA5wIAIAwAAOgCACCrAQEAAAABrwFAAAAAAbABQAAAAAG8AQEAAAABywEAAADLAQLMAQEAAAABzQECAAAAAc4BgAAAAAHPAQEAAAABDwsAAJgDACCrAQEAAAABrwFAAAAAAbABQAAAAAHLAQAAAN4BAtkBAQAAAAHaAQEAAAAB2wEBAAAAAdwBEAAAAAHeAQEAAAAB3wEBAAAAAeABgAAAAAHhAQEAAAAB4gEQAAAAAeMBEAAAAAECAAAADgAgHAAA3QMAIAMAAAAOACAcAADdAwAgHQAA3AMAIAEVAAD6AwAwFAMAAKwCACALAACWAgAgqAEAALQCADCpAQAADAAQqgEAALQCADCrAQEAAAABrwFAAIUCACGwAUAAhQIAIckBAQCUAgAhywEAALYC3gEi2QEBAJQCACHaAQEAlAIAIdsBAQCDAgAh3AEQALUCACHeAQEAgwIAId8BAQCDAgAh4AEAAIQCACDhAQEAAAAB4gEQALUCACHjARAAtQIAIQIAAAAOACAVAADcAwAgAgAAANoDACAVAADbAwAgEqgBAADZAwAwqQEAANoDABCqAQAA2QMAMKsBAQCUAgAhrwFAAIUCACGwAUAAhQIAIckBAQCUAgAhywEAALYC3gEi2QEBAJQCACHaAQEAlAIAIdsBAQCDAgAh3AEQALUCACHeAQEAgwIAId8BAQCDAgAh4AEAAIQCACDhAQEAgwIAIeIBEAC1AgAh4wEQALUCACESqAEAANkDADCpAQAA2gMAEKoBAADZAwAwqwEBAJQCACGvAUAAhQIAIbABQACFAgAhyQEBAJQCACHLAQAAtgLeASLZAQEAlAIAIdoBAQCUAgAh2wEBAIMCACHcARAAtQIAId4BAQCDAgAh3wEBAIMCACHgAQAAhAIAIOEBAQCDAgAh4gEQALUCACHjARAAtQIAIQ6rAQEAvgIAIa8BQAC_AgAhsAFAAL8CACHLAQAAiwPeASLZAQEAvgIAIdoBAQC-AgAh2wEBAMYCACHcARAAigMAId4BAQDGAgAh3wEBAMYCACHgAYAAAAAB4QEBAMYCACHiARAAigMAIeMBEACKAwAhDwsAAI0DACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACHLAQAAiwPeASLZAQEAvgIAIdoBAQC-AgAh2wEBAMYCACHcARAAigMAId4BAQDGAgAh3wEBAMYCACHgAYAAAAAB4QEBAMYCACHiARAAigMAIeMBEACKAwAhDwsAAJgDACCrAQEAAAABrwFAAAAAAbABQAAAAAHLAQAAAN4BAtkBAQAAAAHaAQEAAAAB2wEBAAAAAdwBEAAAAAHeAQEAAAAB3wEBAAAAAeABgAAAAAHhAQEAAAAB4gEQAAAAAeMBEAAAAAEHBQAAsAMAIKsBAQAAAAGvAUAAAAABxgEBAAAAAdABAQAAAAHlAQEAAAAB5gEBAAAAAQIAAAAFACAcAADpAwAgAwAAAAUAIBwAAOkDACAdAADoAwAgARUAAPkDADAMAwAArAIAIAUAALoCACCoAQAAuQIAMKkBAAADABCqAQAAuQIAMKsBAQAAAAGvAUAAhQIAIcYBAQCUAgAhyQEBAJQCACHQAQEAAAAB5QEBAJQCACHmAQEAlAIAIQIAAAAFACAVAADoAwAgAgAAAOYDACAVAADnAwAgCqgBAADlAwAwqQEAAOYDABCqAQAA5QMAMKsBAQCUAgAhrwFAAIUCACHGAQEAlAIAIckBAQCUAgAh0AEBAJQCACHlAQEAlAIAIeYBAQCUAgAhCqgBAADlAwAwqQEAAOYDABCqAQAA5QMAMKsBAQCUAgAhrwFAAIUCACHGAQEAlAIAIckBAQCUAgAh0AEBAJQCACHlAQEAlAIAIeYBAQCUAgAhBqsBAQC-AgAhrwFAAL8CACHGAQEAvgIAIdABAQC-AgAh5QEBAL4CACHmAQEAvgIAIQcFAACiAwAgqwEBAL4CACGvAUAAvwIAIcYBAQC-AgAh0AEBAL4CACHlAQEAvgIAIeYBAQC-AgAhBwUAALADACCrAQEAAAABrwFAAAAAAcYBAQAAAAHQAQEAAAAB5QEBAAAAAeYBAQAAAAEB-wEBAAAABAH7AQEAAAAEBBwAAN4DADD4AQAA3wMAMPoBAADhAwAg_gEAAOIDADAEHAAA0gMAMPgBAADTAwAw-gEAANUDACD-AQAA1gMAMAQcAADJAwAw-AEAAMoDADD6AQAAzAMAIP4BAAD5AgAwBBwAAL0DADD4AQAAvgMAMPoBAADAAwAg_gEAAMEDADAAAAAMBwAA8AMAIAsAAIMDACAOAADxAwAgDwAA8gMAIMYBAADCAgAg6gEAAMICACDrAQAAwgIAIO0BAADCAgAg7gEAAMICACDvAQAAwgIAIPABAADCAgAg8QEAAMICACAHAwAA8wMAIAkAAPUDACAKAAD2AwAgDAAAyQIAIMwBAADCAgAgzQEAAMICACDOAQAAwgIAIAAKAwAA8wMAIAsAAIMDACDbAQAAwgIAINwBAADCAgAg3gEAAMICACDfAQAAwgIAIOABAADCAgAg4QEAAMICACDiAQAAwgIAIOMBAADCAgAgAgMAAPMDACAFAAD4AwAgAAarAQEAAAABrwFAAAAAAcYBAQAAAAHQAQEAAAAB5QEBAAAAAeYBAQAAAAEOqwEBAAAAAa8BQAAAAAGwAUAAAAABywEAAADeAQLZAQEAAAAB2gEBAAAAAdsBAQAAAAHcARAAAAAB3gEBAAAAAd8BAQAAAAHgAYAAAAAB4QEBAAAAAeIBEAAAAAHjARAAAAABCasBAQAAAAGvAUAAAAABsAFAAAAAAbwBAQAAAAHLAQAAAMsBAswBAQAAAAHNAQIAAAABzgGAAAAAAc8BAQAAAAEGqwEBAAAAAa8BQAAAAAGwAUAAAAABxgEBAAAAAccBAQAAAAHIAQEAAAABEwsAAO4DACAOAADtAwAgDwAA7wMAIKsBAQAAAAGvAUAAAAABsAFAAAAAAcYBAQAAAAHnAQEAAAAB6AEBAAAAAekBAgAAAAHqAQEAAAAB6wEBAAAAAewBAADqAwAg7QEBAAAAAe4BAQAAAAHvAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQAA6wMAIAIAAAABACAcAAD9AwAgBKsBAQAAAAGsAQEAAAABrgFAAAAAAa8BQAAAAAEDAAAAKAAgHAAA_QMAIB0AAIIEACAVAAAAKAAgCwAAuwMAIA4AALoDACAPAAC8AwAgFQAAggQAIKsBAQC-AgAhrwFAAL8CACGwAUAAvwIAIcYBAQDGAgAh5wEBAL4CACHoAQEAvgIAIekBAgC2AwAh6gEBAMYCACHrAQEAxgIAIewBAAC3AwAg7QEBAMYCACHuAQEAxgIAIe8BAQDGAgAh8AEBAMYCACHxAQEAxgIAIfIBAAC4AwAgEwsAALsDACAOAAC6AwAgDwAAvAMAIKsBAQC-AgAhrwFAAL8CACGwAUAAvwIAIcYBAQDGAgAh5wEBAL4CACHoAQEAvgIAIekBAgC2AwAh6gEBAMYCACHrAQEAxgIAIewBAAC3AwAg7QEBAMYCACHuAQEAxgIAIe8BAQDGAgAh8AEBAMYCACHxAQEAxgIAIfIBAAC4AwAgCAMAAK8DACCrAQEAAAABrwFAAAAAAcYBAQAAAAHJAQEAAAAB0AEBAAAAAeUBAQAAAAHmAQEAAAABAgAAAAUAIBwAAIMEACADAAAAAwAgHAAAgwQAIB0AAIcEACAKAAAAAwAgAwAAoQMAIBUAAIcEACCrAQEAvgIAIa8BQAC_AgAhxgEBAL4CACHJAQEAvgIAIdABAQC-AgAh5QEBAL4CACHmAQEAvgIAIQgDAAChAwAgqwEBAL4CACGvAUAAvwIAIcYBAQC-AgAhyQEBAL4CACHQAQEAvgIAIeUBAQC-AgAh5gEBAL4CACETBwAA7AMAIAsAAO4DACAPAADvAwAgqwEBAAAAAa8BQAAAAAGwAUAAAAABxgEBAAAAAecBAQAAAAHoAQEAAAAB6QECAAAAAeoBAQAAAAHrAQEAAAAB7AEAAOoDACDtAQEAAAAB7gEBAAAAAe8BAQAAAAHwAQEAAAAB8QEBAAAAAfIBAADrAwAgAgAAAAEAIBwAAIgEACAJqwEBAAAAAa8BQAAAAAGwAUAAAAABvAEBAAAAAckBAQAAAAHLAQAAAMsBAswBAQAAAAHNAQIAAAABzgGAAAAAAQMAAAAoACAcAACIBAAgHQAAjQQAIBUAAAAoACAHAAC5AwAgCwAAuwMAIA8AALwDACAVAACNBAAgqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhxgEBAMYCACHnAQEAvgIAIegBAQC-AgAh6QECALYDACHqAQEAxgIAIesBAQDGAgAh7AEAALcDACDtAQEAxgIAIe4BAQDGAgAh7wEBAMYCACHwAQEAxgIAIfEBAQDGAgAh8gEAALgDACATBwAAuQMAIAsAALsDACAPAAC8AwAgqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhxgEBAMYCACHnAQEAvgIAIegBAQC-AgAh6QECALYDACHqAQEAxgIAIesBAQDGAgAh7AEAALcDACDtAQEAxgIAIe4BAQDGAgAh7wEBAMYCACHwAQEAxgIAIfEBAQDGAgAh8gEAALgDACAJqwEBAAAAAa8BQAAAAAGwAUAAAAAByQEBAAAAAcsBAAAAywECzAEBAAAAAc0BAgAAAAHOAYAAAAABzwEBAAAAARMHAADsAwAgDgAA7QMAIA8AAO8DACCrAQEAAAABrwFAAAAAAbABQAAAAAHGAQEAAAAB5wEBAAAAAegBAQAAAAHpAQIAAAAB6gEBAAAAAesBAQAAAAHsAQAA6gMAIO0BAQAAAAHuAQEAAAAB7wEBAAAAAfABAQAAAAHxAQEAAAAB8gEAAOsDACACAAAAAQAgHAAAjwQAIAsNAACCAwAgqwEBAAAAAa8BQAAAAAGwAUAAAAABxgEBAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQAAAAHUAYAAAAAB1QFAAAAAAQIAAACAAQAgHAAAkQQAIBADAACXAwAgqwEBAAAAAa8BQAAAAAGwAUAAAAAByQEBAAAAAcsBAAAA3gEC2QEBAAAAAdoBAQAAAAHbAQEAAAAB3AEQAAAAAd4BAQAAAAHfAQEAAAAB4AGAAAAAAeEBAQAAAAHiARAAAAAB4wEQAAAAAQIAAAAOACAcAACTBAAgBasBAQAAAAGsAQEAAAABrgFAAAAAAa8BQAAAAAGwAUAAAAABAwAAACgAIBwAAI8EACAdAACYBAAgFQAAACgAIAcAALkDACAOAAC6AwAgDwAAvAMAIBUAAJgEACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACHGAQEAxgIAIecBAQC-AgAh6AEBAL4CACHpAQIAtgMAIeoBAQDGAgAh6wEBAMYCACHsAQAAtwMAIO0BAQDGAgAh7gEBAMYCACHvAQEAxgIAIfABAQDGAgAh8QEBAMYCACHyAQAAuAMAIBMHAAC5AwAgDgAAugMAIA8AALwDACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACHGAQEAxgIAIecBAQC-AgAh6AEBAL4CACHpAQIAtgMAIeoBAQDGAgAh6wEBAMYCACHsAQAAtwMAIO0BAQDGAgAh7gEBAMYCACHvAQEAxgIAIfABAQDGAgAh8QEBAMYCACHyAQAAuAMAIAMAAACDAQAgHAAAkQQAIB0AAJsEACANAAAAgwEAIA0AAO8CACAVAACbBAAgqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhxgEBAL4CACHQAQEAvgIAIdEBAQDGAgAh0gEBAMYCACHTAQEAxgIAIdQBgAAAAAHVAUAA7QIAIQsNAADvAgAgqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhxgEBAL4CACHQAQEAvgIAIdEBAQDGAgAh0gEBAMYCACHTAQEAxgIAIdQBgAAAAAHVAUAA7QIAIQMAAAAMACAcAACTBAAgHQAAngQAIBIAAAAMACADAACMAwAgFQAAngQAIKsBAQC-AgAhrwFAAL8CACGwAUAAvwIAIckBAQC-AgAhywEAAIsD3gEi2QEBAL4CACHaAQEAvgIAIdsBAQDGAgAh3AEQAIoDACHeAQEAxgIAId8BAQDGAgAh4AGAAAAAAeEBAQDGAgAh4gEQAIoDACHjARAAigMAIRADAACMAwAgqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhyQEBAL4CACHLAQAAiwPeASLZAQEAvgIAIdoBAQC-AgAh2wEBAMYCACHcARAAigMAId4BAQDGAgAh3wEBAMYCACHgAYAAAAAB4QEBAMYCACHiARAAigMAIeMBEACKAwAhEwcAAOwDACALAADuAwAgDgAA7QMAIKsBAQAAAAGvAUAAAAABsAFAAAAAAcYBAQAAAAHnAQEAAAAB6AEBAAAAAekBAgAAAAHqAQEAAAAB6wEBAAAAAewBAADqAwAg7QEBAAAAAe4BAQAAAAHvAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQAA6wMAIAIAAAABACAcAACfBAAgAwAAACgAIBwAAJ8EACAdAACjBAAgFQAAACgAIAcAALkDACALAAC7AwAgDgAAugMAIBUAAKMEACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACHGAQEAxgIAIecBAQC-AgAh6AEBAL4CACHpAQIAtgMAIeoBAQDGAgAh6wEBAMYCACHsAQAAtwMAIO0BAQDGAgAh7gEBAMYCACHvAQEAxgIAIfABAQDGAgAh8QEBAMYCACHyAQAAuAMAIBMHAAC5AwAgCwAAuwMAIA4AALoDACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACHGAQEAxgIAIecBAQC-AgAh6AEBAL4CACHpAQIAtgMAIeoBAQDGAgAh6wEBAMYCACHsAQAAtwMAIO0BAQDGAgAh7gEBAMYCACHvAQEAxgIAIfABAQDGAgAh8QEBAMYCACHyAQAAuAMAIAsLAACBAwAgqwEBAAAAAa8BQAAAAAGwAUAAAAABxgEBAAAAAdABAQAAAAHRAQEAAAAB0gEBAAAAAdMBAQAAAAHUAYAAAAAB1QFAAAAAAQIAAACAAQAgHAAApAQAIAMAAACDAQAgHAAApAQAIB0AAKgEACANAAAAgwEAIAsAAO4CACAVAACoBAAgqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhxgEBAL4CACHQAQEAvgIAIdEBAQDGAgAh0gEBAMYCACHTAQEAxgIAIdQBgAAAAAHVAUAA7QIAIQsLAADuAgAgqwEBAL4CACGvAUAAvwIAIbABQAC_AgAhxgEBAL4CACHQAQEAvgIAIdEBAQDGAgAh0gEBAMYCACHTAQEAxgIAIdQBgAAAAAHVAUAA7QIAIQ0DAADpAgAgCgAA5wIAIAwAAOgCACCrAQEAAAABrwFAAAAAAbABQAAAAAG8AQEAAAAByQEBAAAAAcsBAAAAywECzAEBAAAAAc0BAgAAAAHOAYAAAAABzwEBAAAAAQIAAAASACAcAACpBAAgAwAAABAAIBwAAKkEACAdAACtBAAgDwAAABAAIAMAANkCACAKAADXAgAgDAAA2AIAIBUAAK0EACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACG8AQEAvgIAIckBAQC-AgAhywEAANQCywEizAEBAMYCACHNAQIA1QIAIc4BgAAAAAHPAQEAvgIAIQ0DAADZAgAgCgAA1wIAIAwAANgCACCrAQEAvgIAIa8BQAC_AgAhsAFAAL8CACG8AQEAvgIAIckBAQC-AgAhywEAANQCywEizAEBAMYCACHNAQIA1QIAIc4BgAAAAAHPAQEAvgIAIQUGAA4HBgILHgYODwUPIg0DAwABBQoDBgAEAQQAAgEFCwADAwABBgAMCxMGBQMAAQYACwkXBwoABQwACAEIAAYDBgAKCxgGDRoJAQwACAELGwABCRwAAQsdAAEDAAEEByMACyUADiQADyYAAAAABQYAEyIAFCMAFSQAFiUAFwAAAAAABQYAEyIAFCMAFSQAFiUAFwEDAAEBAwABAwYAHCQAHSUAHgAAAAMGABwkAB0lAB4BBAACAQQAAgMGACMkACQlACUAAAADBgAjJAAkJQAlAQMAAQEDAAEFBgAqIgArIwAsJAAtJQAuAAAAAAAFBgAqIgArIwAsJAAtJQAuAAADBgAzJAA0JQA1AAAAAwYAMyQANCUANQMDAAEKAAUMAAgDAwABCgAFDAAIBQYAOiIAOyMAPCQAPSUAPgAAAAAABQYAOiIAOyMAPCQAPSUAPgEDAAEBAwABAwYAQyQARCUARQAAAAMGAEMkAEQlAEUBDAAIAQwACAMGAEokAEslAEwAAAADBgBKJABLJQBMAQgABgEIAAYDBgBRJABSJQBTAAAAAwYAUSQAUiUAUxACAREnARIqARMrARQsARYuARcwDxgxEBkzARo1Dxs2ER43AR84ASA5DyY8Eic9GCg-Aik_AipAAitBAixCAi1EAi5GDy9HGTBJAjFLDzJMGjNNAjROAjVPDzZSGzdTHzhUAzlVAzpWAztXAzxYAz1aAz5cDz9dIEBfA0FhD0JiIUNjA0RkA0VlD0ZoIkdpJkhqBUlrBUpsBUttBUxuBU1wBU5yD09zJ1B1BVF3D1J4KFN5BVR6BVV7D1Z-KVd_L1iBAQhZggEIWoUBCFuGAQhchwEIXYkBCF6LAQ9fjAEwYI4BCGGQAQ9ikQExY5IBCGSTAQhllAEPZpcBMmeYATZomQEGaZoBBmqbAQZrnAEGbJ0BBm2fAQZuoQEPb6IBN3CkAQZxpgEPcqcBOHOoAQZ0qQEGdaoBD3atATl3rgE_eK8BDXmwAQ16sQENe7IBDXyzAQ19tQENfrcBD3-4AUCAAboBDYEBvAEPggG9AUGDAb4BDYQBvwENhQHAAQ-GAcMBQocBxAFGiAHGAQmJAccBCYoByQEJiwHKAQmMAcsBCY0BzQEJjgHPAQ-PAdABR5AB0gEJkQHUAQ-SAdUBSJMB1gEJlAHXAQmVAdgBD5YB2wFJlwHcAU2YAd0BB5kB3gEHmgHfAQebAeABB5wB4QEHnQHjAQeeAeUBD58B5gFOoAHoAQehAeoBD6IB6wFPowHsAQekAe0BB6UB7gEPpgHxAVCnAfIBVA"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  ApplicationScalarFieldEnum: () => ApplicationScalarFieldEnum,
  CandidateScalarFieldEnum: () => CandidateScalarFieldEnum,
  CompanyScalarFieldEnum: () => CompanyScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JobScalarFieldEnum: () => JobScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OrganogramaNodeScalarFieldEnum: () => OrganogramaNodeScalarFieldEnum,
  PersonalityResultScalarFieldEnum: () => PersonalityResultScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  RefreshTokenScalarFieldEnum: () => RefreshTokenScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TestLinkScalarFieldEnum: () => TestLinkScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
var runtime2 = __toESM(require("@prisma/client/runtime/client"), 1);
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.8.0",
  engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Company: "Company",
  User: "User",
  RefreshToken: "RefreshToken",
  Job: "Job",
  Candidate: "Candidate",
  Application: "Application",
  OrganogramaNode: "OrganogramaNode",
  PersonalityResult: "PersonalityResult",
  TestLink: "TestLink"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var CompanyScalarFieldEnum = {
  id: "id",
  nome: "nome",
  razaoSocial: "razaoSocial",
  cnpj: "cnpj",
  onboardingStep: "onboardingStep",
  contextoEmpresa: "contextoEmpresa",
  perfilRitmo: "perfilRitmo",
  valores: "valores",
  logoUrl: "logoUrl",
  cep: "cep",
  logradouro: "logradouro",
  cidade: "cidade",
  estado: "estado",
  teamEmails: "teamEmails",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  companyId: "companyId",
  nome: "nome",
  email: "email",
  password: "password",
  role: "role",
  createdAt: "createdAt"
};
var RefreshTokenScalarFieldEnum = {
  id: "id",
  token: "token",
  userId: "userId",
  expiresAt: "expiresAt",
  createdAt: "createdAt"
};
var JobScalarFieldEnum = {
  id: "id",
  titulo: "titulo",
  descricao: "descricao",
  requisitos: "requisitos",
  salario: "salario",
  status: "status",
  liderId: "liderId",
  jdGerada: "jdGerada",
  perfilIdealJson: "perfilIdealJson",
  publicToken: "publicToken",
  salaryMin: "salaryMin",
  salaryMax: "salaryMax",
  companyId: "companyId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CandidateScalarFieldEnum = {
  id: "id",
  nome: "nome",
  email: "email",
  telefone: "telefone",
  curriculoUrl: "curriculoUrl",
  linkedinUrl: "linkedinUrl",
  respostasJson: "respostasJson",
  testCompletedAt: "testCompletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ApplicationScalarFieldEnum = {
  id: "id",
  status: "status",
  feedbackIA: "feedbackIA",
  matchScore: "matchScore",
  matchResultJson: "matchResultJson",
  jobId: "jobId",
  candidateId: "candidateId",
  companyId: "companyId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrganogramaNodeScalarFieldEnum = {
  id: "id",
  nome: "nome",
  cargo: "cargo",
  parentId: "parentId",
  companyId: "companyId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PersonalityResultScalarFieldEnum = {
  id: "id",
  candidateId: "candidateId",
  disc: "disc",
  eneagrama: "eneagrama",
  rawScore: "rawScore",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TestLinkScalarFieldEnum = {
  id: "id",
  token: "token",
  applicationId: "applicationId",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var JobStatus = {
  ABERTA: "ABERTA",
  FECHADA: "FECHADA",
  PAUSADA: "PAUSADA"
};

// src/generated/prisma/client.ts
var PrismaClient = getPrismaClientClass();

// src/config/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new import_adapter_pg.PrismaPg({ connectionString });
var globalForPrisma = global;
var prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
var prismaConnect = async () => {
  try {
    await prisma.$connect();
    console.log("\u2705 Conex\xE3o com o banco de dados estabelecida com sucesso.");
  } catch (error) {
    console.error("\u274C Erro ao conectar ao banco de dados", error);
    throw Error;
  }
};

// src/config/error.ts
var AppError = class extends Error {
  constructor(message, statusCode = 400, code) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.code = code;
    this.name = "AppError";
  }
};

// src/services/authService.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_crypto = require("crypto");

// src/config/env.ts
var import_zod = require("zod");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var envShema = import_zod.z.object({
  PORT: import_zod.z.string().transform(Number).default(3001),
  // DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatório"),
  NODE_ENV: import_zod.z.enum(["dev", "test", "prod"], {
    message: "o Node Env deve ser ,dev, test, ou prod"
  }),
  JWT_SECRET: import_zod.z.string().min(10, "Secret Key required"),
  APP_URL: import_zod.z.string().default("http://localhost:3000"),
  OPENAI_API_KEY: import_zod.z.string().min(1, "OPENAI_API_KEY \xE9 obrigat\xF3ria"),
  RESEND_API_KEY: import_zod.z.string().min(1, "RESEND_API_KEY \xE9 obrigat\xF3ria"),
  EMAIL_FROM: import_zod.z.string().default("noreply@seudominio.com")
});
var _env = envShema.safeParse(process.env);
if (!_env.success) {
  console.error("Invalid environment variables!");
  process.exit(1);
}
var env = _env.data;

// src/services/authService.ts
var REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
function generateRefreshToken() {
  return (0, import_crypto.randomUUID)() + (0, import_crypto.randomUUID)();
}
var AuthService = class {
  async register({ nome, email, password, razaoSocial, cnpj }) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new AppError("E-mail j\xE1 cadastrado.", 409);
    const existingCompany = await prisma.company.findUnique({ where: { cnpj } });
    if (existingCompany) throw new AppError("CNPJ j\xE1 cadastrado.", 409);
    const hashedPassword = await import_bcryptjs.default.hash(password, 10);
    try {
      const result = await prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
          data: { razaoSocial, cnpj }
        });
        const user = await tx.user.create({
          data: { nome, email, password: hashedPassword, companyId: company.id }
        });
        return { company, user };
      });
      return result;
    } catch (err) {
      if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError("E-mail ou CNPJ j\xE1 cadastrado.", 409);
      }
      throw err;
    }
  }
  // Método para Login  --------------------------
  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError("Email or password incorrect", 401);
    }
    const isPasswordValid = await import_bcryptjs.default.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Email or password incorrect", 401);
    }
    const company = await prisma.company.findUnique({
      where: { id: user.companyId },
      select: { id: true, razaoSocial: true, cnpj: true }
      // Seleciona só o que precisa
    });
    if (!company) {
      throw new AppError("Company data not found.", 500);
    }
    const payload = {
      sub: user.id,
      companyId: user.companyId,
      role: user.role
    };
    const accessToken = import_jsonwebtoken.default.sign(payload, env.JWT_SECRET, { expiresIn: "1d" });
    const rawRefresh = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    await prisma.refreshToken.create({ data: { token: rawRefresh, userId: user.id, expiresAt } });
    return {
      accessToken,
      refreshToken: rawRefresh,
      user: { id: user.id, nome: user.nome, email: user.email, role: user.role },
      company
    };
  }
  async refresh(token) {
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored) throw new AppError("Sess\xE3o inv\xE1lida.", 401);
    if (/* @__PURE__ */ new Date() > stored.expiresAt) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new AppError("Sess\xE3o expirada. Fa\xE7a login novamente.", 401);
    }
    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw new AppError("Usu\xE1rio n\xE3o encontrado.", 401);
    const newRawRefresh = generateRefreshToken();
    const newExpiresAt = new Date(Date.now() + REFRESH_TTL_MS);
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { token: newRawRefresh, expiresAt: newExpiresAt }
    });
    const accessToken = import_jsonwebtoken.default.sign(
      { sub: user.id, companyId: user.companyId, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return { accessToken, refreshToken: newRawRefresh };
  }
  async logout(token) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
  // Método para buscar o próprio usuário --------------------------
  async getMe(userId) {
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
      throw new AppError("Usu\xE1rio n\xE3o encontrado", 404);
    }
    return user;
  }
};

// src/controllers/AuthController.ts
var AuthController = class {
  constructor() {
    //register
    this.register = async (req, reply) => {
      const { user, company } = await this.authService.register(req.body);
      return reply.status(201).send({
        ok: true,
        data: {
          user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            role: user.role
          },
          company: {
            id: company.id,
            razaoSocial: company.razaoSocial
          }
        }
      });
    };
    //login
    this.login = async (req, reply) => {
      const result = await this.authService.login(req.body);
      return reply.status(200).send({
        ok: true,
        data: { user: result.user, company: result.company },
        token: result.accessToken,
        refreshToken: result.refreshToken
      });
    };
    this.refresh = async (req, reply) => {
      const { refreshToken } = req.body;
      if (!refreshToken) throw new AppError("refreshToken obrigat\xF3rio.", 400);
      const result = await this.authService.refresh(refreshToken);
      return reply.send({ ok: true, data: result });
    };
    this.logout = async (req, reply) => {
      if (req.body.refreshToken) {
        await this.authService.logout(req.body.refreshToken);
      }
      return reply.send({ ok: true });
    };
    this.me = async (req, reply) => {
      const user = await this.authService.getMe(req.user.userId);
      return reply.send({ ok: true, data: user });
    };
    this.authService = new AuthService();
  }
};

// src/schemas/auth.schema.ts
var import_zod2 = require("zod");
var registerSchema = import_zod2.z.object({
  nome: import_zod2.z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: import_zod2.z.string().email("Formato de e-mail inv\xE1lido"),
  password: import_zod2.z.string().min(6, "A senha deve ter no m\xEDnimo 6 caracteres"),
  razaoSocial: import_zod2.z.string().min(2, "A raz\xE3o social \xE9 obrigat\xF3ria"),
  cnpj: import_zod2.z.string().min(14, "CNPJ inv\xE1lido")
});
var loginSchema = import_zod2.z.object({
  email: import_zod2.z.string().email("E-mail inv\xE1lido"),
  password: import_zod2.z.string().min(6, "Senha \xE9 obrigat\xF3ria min 6 caracteres")
});

// src/middleware/validade.schema.ts
var validateSchema = (schema, source = "body") => {
  return async (req, reply) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return reply.status(400).send({
        ok: false,
        message: "Dados inv\xE1lidos",
        errors: result.error.format()
      });
    }
    req[source] = result.data;
  };
};

// src/middleware/auth.middleware.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
async function authMiddleware(req, reply) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Token de autentica\xE7\xE3o n\xE3o fornecido", 401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, env.JWT_SECRET);
    req.user = {
      userId: decoded.sub,
      companyId: decoded.companyId,
      role: decoded.role
    };
  } catch (error) {
    throw new AppError("Token inv\xE1lido ou expirado", 401);
  }
}

// src/Routes/auth.routes.ts
async function authRoutes(app2) {
  const authController = new AuthController();
  app2.post(
    "/register",
    {
      preHandler: [validateSchema(registerSchema)]
    },
    authController.register
  );
  app2.post(
    "/login",
    {
      preHandler: [validateSchema(loginSchema)]
    },
    authController.login
  );
  app2.get("/me", { preHandler: [authMiddleware] }, authController.me);
  app2.post("/refresh", authController.refresh);
  app2.post("/logout", authController.logout);
}

// src/config/dayjs.ts
var import_dayjs = __toESM(require("dayjs"), 1);
var import_utc = __toESM(require("dayjs/plugin/utc"), 1);
var import_timezone = __toESM(require("dayjs/plugin/timezone"), 1);
var import_pt_br = require("dayjs/locale/pt-br");
import_dayjs.default.extend(import_utc.default);
import_dayjs.default.extend(import_timezone.default);
import_dayjs.default.locale("pt-br");
var TZ = "America/Sao_Paulo";
var formatBR = (date) => import_dayjs.default.utc(date).tz(TZ).format("DD/MM/YYYY HH:mm");

// src/services/JobService.ts
var JobService = class {
  async create(data, companyId) {
    if (!companyId) {
      throw new AppError("O ID da empresa \xE9 obrigat\xF3rio para criar uma vaga.", 400);
    }
    const companyExists = await prisma.company.findUnique({
      where: { id: companyId }
    });
    if (!companyExists) {
      throw new AppError("Empresa n\xE3o encontrada ou conta desativada.", 404);
    }
    const duplicateJob = await prisma.job.findFirst({
      where: {
        titulo: data.titulo,
        companyId,
        status: "ABERTA"
      }
    });
    if (duplicateJob) {
      throw new AppError("J\xE1 existe uma vaga aberta com este t\xEDtulo para sua empresa.", 409);
    }
    if (data.salario !== void 0 && data.salario <= 0) {
      throw new AppError("O sal\xE1rio deve ser um valor positivo.", 400);
    }
    try {
      const job = await prisma.job.create({
        data: {
          ...data,
          descricao: data.descricao ?? "",
          // coluna NOT NULL — usa string vazia até a IA gerar o JD
          companyId
        }
      });
      return {
        ...job,
        createdAt: formatBR(job.createdAt),
        updatedAt: formatBR(job.updatedAt)
      };
    } catch (error) {
      console.error("Erro ao criar vaga no banco:", error);
      throw new AppError("Erro interno ao processar a cria\xE7\xE3o da vaga.", 500);
    }
  }
  async listByCompany(companyId) {
    if (!companyId) {
      throw new AppError("ID da empresa n\xE3o informado para listagem.", 400);
    }
    const jobs = await prisma.job.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } }
    });
    return jobs.map((j) => ({
      ...j,
      createdAt: formatBR(j.createdAt),
      updatedAt: formatBR(j.updatedAt)
    }));
  }
  //busca vaga pelo id
  async getById(id, companyId) {
    const job = await prisma.job.findFirst({ where: { id, companyId } });
    if (!job) throw new AppError("Vaga n\xE3o encontrada", 404);
    return {
      ...job,
      createdAt: formatBR(job.createdAt),
      updatedAt: formatBR(job.updatedAt)
    };
  }
  //update de vaga
  async update(id, companyId, data) {
    const job = await prisma.job.update({
      where: { id, companyId },
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        requisitos: data.requisitos,
        salario: data.salario,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        liderId: data.liderId,
        status: data.status
      }
    });
    return {
      ...job,
      createdAt: formatBR(job.createdAt),
      updatedAt: formatBR(job.updatedAt)
    };
  }
};

// src/controllers/JobController.ts
var JobController = class {
  constructor() {
    //criar nova vaga
    this.create = async (req, reply) => {
      const { companyId } = req.user;
      const job = await this.jobService.create(req.body, companyId);
      return reply.status(201).send({ ok: true, data: job });
    };
    //listar todas as vagas de uma empresa
    this.list = async (req, reply) => {
      const { companyId } = req.user;
      const jobs = await this.jobService.listByCompany(companyId);
      return reply.send({ ok: true, data: jobs });
    };
    //update
    this.update = async (req, reply) => {
      const data = await this.jobService.update(req.params.id, req.user.companyId, req.body);
      return reply.send({ ok: true, data });
    };
    //buscar vaga por id
    this.getById = async (req, reply) => {
      const data = await this.jobService.getById(req.params.id, req.user.companyId);
      return reply.send({ ok: true, data });
    };
    this.jobService = new JobService();
  }
};

// src/schemas/job.schema.ts
var import_zod3 = require("zod");
var createJobSchema = import_zod3.z.object({
  titulo: import_zod3.z.string().min(3, "O t\xEDtulo deve ter pelo menos 3 caracteres"),
  descricao: import_zod3.z.string().optional(),
  requisitos: import_zod3.z.string().optional(),
  salario: import_zod3.z.coerce.number().positive().optional(),
  salaryMin: import_zod3.z.coerce.number().positive().optional(),
  salaryMax: import_zod3.z.coerce.number().positive().optional(),
  liderId: import_zod3.z.string().uuid().optional().nullable(),
  status: import_zod3.z.nativeEnum(JobStatus).default("ABERTA")
});
var updateJobSchema = import_zod3.z.object({
  titulo: import_zod3.z.string().min(3).optional(),
  descricao: import_zod3.z.string().optional(),
  requisitos: import_zod3.z.string().optional(),
  salario: import_zod3.z.coerce.number().positive().optional(),
  salaryMin: import_zod3.z.coerce.number().positive().optional(),
  salaryMax: import_zod3.z.coerce.number().positive().optional(),
  liderId: import_zod3.z.string().uuid().optional().nullable(),
  status: import_zod3.z.nativeEnum(JobStatus).optional()
});

// src/Routes/job.routes.ts
async function jobRoutes(app2) {
  const jobController = new JobController();
  app2.addHook("preHandler", authMiddleware);
  app2.post(
    "/",
    {
      preHandler: [validateSchema(createJobSchema)]
    },
    jobController.create
  );
  app2.get("/", jobController.list);
  app2.get("/:id", jobController.getById);
  app2.patch("/:id", jobController.update);
}

// src/services/emailService.ts
var import_resend = require("resend");
var resend = new import_resend.Resend(env.RESEND_API_KEY);
var base = `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
`;
var emailService = {
  async sendTestLink(params) {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [params.to],
      subject: `Voc\xEA foi convidado para um teste \u2014 ${params.jobTitle}`,
      html: `${base}
        <h2>Ol\xE1, ${params.candidateName}!</h2>
        <p>Voc\xEA foi selecionado para realizar um teste psicom\xE9trico referente \xE0 vaga <strong>${params.jobTitle}</strong>.</p>
        <p>Clique no bot\xE3o abaixo para acessar o teste:</p>
        <a href="${params.testUrl}" style="
          display: inline-block;
          background-color: #4F46E5;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin: 16px 0;
        ">Acessar Teste</a>
        <p style="color: #6B7280; font-size: 14px;">
          Este link expira em <strong>${params.expiresAt}</strong>.<br/>
          Se voc\xEA n\xE3o se candidatou a esta vaga, ignore este e-mail.
        </p>
      </div>`
    });
  },
  async sendNewApplication(params) {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [params.to],
      subject: `Nova candidatura \u2014 ${params.candidateName} para ${params.jobTitle}`,
      html: `${base}
        <h2>Nova candidatura recebida</h2>
        <p><strong>${params.candidateName}</strong> (${params.candidateEmail}) se inscreveu na vaga <strong>${params.jobTitle}</strong>.</p>
        <p style="color: #6B7280; font-size: 14px;">Acesse o painel para visualizar o perfil completo do candidato.</p>
      </div>`
    });
  },
  async sendTeamInvite(params) {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [params.to],
      subject: `${params.companyName} te convidou para o mapeamento comportamental`,
      html: `${base}
        <h2>Convite de mapeamento comportamental</h2>
        <p>A empresa <strong>${params.companyName}</strong> te convidou para fazer parte do mapeamento comportamental da equipe.</p>
        <p>Em breve voc\xEA receber\xE1 um link para responder o question\xE1rio. O processo leva cerca de <strong>30 minutos</strong> e n\xE3o h\xE1 respostas certas ou erradas.</p>
        <p style="color: #6B7280; font-size: 14px;">Este mapeamento \xE9 utilizado para melhorar a din\xE2mica da equipe e potencializar futuros processos seletivos.</p>
      </div>`
    });
  },
  async sendCandidateResults(params) {
    const discDescriptions = {
      dominance: "Domin\xE2ncia (D) \u2014 orientado a resultados e desafios",
      influence: "Influ\xEAncia (I) \u2014 comunicativo e entusiasta",
      steadiness: "Estabilidade (S) \u2014 colaborativo e consistente",
      conscientiousness: "Conformidade (C) \u2014 anal\xEDtico e preciso"
    };
    const discRows = params.disc ? `
        <table style="width:100%;border-collapse:collapse;margin:8px 0;">
          ${[
      ["D", params.disc.dominance],
      ["I", params.disc.influence],
      ["S", params.disc.steadiness],
      ["C", params.disc.conscientiousness]
    ].map(([label, val]) => `
            <tr>
              <td style="width:20px;font-weight:bold;color:#4F46E5;padding:3px 6px 3px 0;">${label}</td>
              <td style="padding:3px 0;">
                <div style="background:#E5E7EB;border-radius:4px;height:10px;overflow:hidden;">
                  <div style="background:#4F46E5;height:10px;width:${val}%;border-radius:4px;"></div>
                </div>
              </td>
              <td style="width:35px;text-align:right;font-size:12px;color:#6B7280;padding:3px 0 3px 6px;">${val}%</td>
            </tr>
          `).join("")}
        </table>
        <p style="font-size:13px;color:#374151;">Perfil dominante: <strong>${discDescriptions[params.disc.primary] ?? params.disc.primary}</strong></p>
      ` : "<p style='color:#6B7280;'>DISC n\xE3o realizado.</p>";
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [params.to],
      subject: `Seus resultados psicom\xE9tricos \u2014 ${params.jobTitle}`,
      html: `${base}
        <h2>Ol\xE1, ${params.candidateName}!</h2>
        <p>Voc\xEA concluiu os testes psicom\xE9tricos para a vaga <strong>${params.jobTitle}</strong>. Veja abaixo um resumo do seu perfil comportamental:</p>

        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin:16px 0;">
          <h3 style="margin:0 0 12px;font-size:15px;color:#111827;">DISC</h3>
          ${discRows}
        </div>

        ${params.eneagrama ? `
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin:16px 0;">
          <h3 style="margin:0 0 8px;font-size:15px;color:#111827;">Eneagrama</h3>
          <p style="font-size:28px;font-weight:bold;color:#4F46E5;margin:0;">${params.eneagrama.primaryType}</p>
          <p style="font-size:13px;color:#6B7280;margin:4px 0 0;">Tipo ${params.eneagrama.primaryType}</p>
        </div>
        ` : ""}

        ${params.personalities ? `
        <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin:16px 0;">
          <h3 style="margin:0 0 8px;font-size:15px;color:#111827;">16 Personalidades</h3>
          <p style="font-size:28px;font-weight:bold;color:#4F46E5;margin:0;">${params.personalities.type}</p>
        </div>
        ` : ""}

        <p style="color:#6B7280;font-size:13px;margin-top:24px;">
          A equipe de RH ir\xE1 analisar seu perfil e entrar\xE1 em contato com os pr\xF3ximos passos.<br/>
          Este e-mail foi gerado automaticamente \u2014 n\xE3o \xE9 necess\xE1rio responder.
        </p>
      </div>`
    });
  },
  async sendTestCompleted(params) {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [params.to],
      subject: `${params.candidateName} concluiu os testes \u2014 ${params.jobTitle}`,
      html: `${base}
        <h2>Testes psicom\xE9tricos conclu\xEDdos</h2>
        <p><strong>${params.candidateName}</strong> finalizou os testes para a vaga <strong>${params.jobTitle}</strong>.</p>
        <p style="color: #6B7280; font-size: 14px;">Acesse o painel para ver o relat\xF3rio completo e a an\xE1lise de fit.</p>
      </div>`
    });
  }
};

// src/services/ApplicationService.ts
var ApplicationService = class {
  async apply(data) {
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      select: { id: true, companyId: true, status: true }
    });
    if (!job) {
      throw new AppError("A vaga informada n\xE3o existe.", 404);
    }
    if (job.status !== "ABERTA") {
      throw new AppError("Esta vaga n\xE3o est\xE1 mais aceitando inscri\xE7\xF5es.", 400);
    }
    let candidate = await prisma.candidate.findUnique({
      where: { email: data.email }
    });
    if (!candidate) {
      candidate = await prisma.candidate.create({
        data: {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          curriculoUrl: data.curriculoUrl,
          linkedinUrl: data.linkedinUrl
        }
      });
    } else {
      candidate = await prisma.candidate.update({
        where: { email: data.email },
        data: {
          nome: data.nome,
          telefone: data.telefone ?? candidate.telefone,
          curriculoUrl: data.curriculoUrl ?? candidate.curriculoUrl,
          linkedinUrl: data.linkedinUrl ?? candidate.linkedinUrl
        }
      });
    }
    const alreadyApplied = await prisma.application.findFirst({
      where: {
        jobId: job.id,
        candidateId: candidate.id
      }
    });
    if (alreadyApplied) {
      throw new AppError("Voc\xEA j\xE1 se candidatou para esta vaga.", 409);
    }
    const application = await prisma.application.create({
      data: {
        jobId: job.id,
        candidateId: candidate.id,
        companyId: job.companyId
      },
      include: {
        candidate: true,
        job: { select: { titulo: true } }
      }
    });
    const hrUser = await prisma.user.findFirst({
      where: { companyId: job.companyId },
      select: { email: true }
    });
    if (hrUser) {
      await emailService.sendNewApplication({
        to: hrUser.email,
        candidateName: candidate.nome,
        candidateEmail: candidate.email,
        jobTitle: application.job.titulo
      });
    }
    return {
      ...application,
      createdAt: formatBR(application.createdAt),
      updatedAt: formatBR(application.updatedAt),
      candidate: {
        ...application.candidate,
        createdAt: formatBR(application.candidate.createdAt),
        updatedAt: formatBR(application.candidate.updatedAt)
      }
    };
  }
  async listByCompany(companyId) {
    const applications = await prisma.application.findMany({
      where: { companyId },
      include: {
        candidate: true,
        job: { select: { titulo: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return applications.map((a) => ({
      ...a,
      createdAt: formatBR(a.createdAt),
      updatedAt: formatBR(a.updatedAt),
      candidate: {
        ...a.candidate,
        createdAt: formatBR(a.candidate.createdAt),
        updatedAt: formatBR(a.candidate.updatedAt)
      }
    }));
  }
  async listByJob(jobId, companyId) {
    const applications = await prisma.application.findMany({
      where: { jobId, companyId },
      include: { candidate: true }
    });
    return applications.map((a) => ({
      ...a,
      createdAt: formatBR(a.createdAt),
      updatedAt: formatBR(a.updatedAt),
      candidate: {
        ...a.candidate,
        createdAt: formatBR(a.candidate.createdAt),
        updatedAt: formatBR(a.candidate.updatedAt)
      }
    }));
  }
  async updateStatus(id, companyId, status) {
    return await prisma.application.update({
      where: { id, companyId },
      data: { status }
    });
  }
};

// src/services/testService.ts
var import_uuid = require("uuid");

// src/logic/disc.ts
function calculateDisc(answers) {
  const counts = { D: 0, I: 0, S: 0, C: 0 };
  const total = Object.keys(answers).length;
  Object.values(answers).forEach((val) => {
    counts[val]++;
  });
  const result = {
    dominance: Math.round(counts.D / total * 100),
    influence: Math.round(counts.I / total * 100),
    steadiness: Math.round(counts.S / total * 100),
    conscientiousness: Math.round(counts.C / total * 100)
  };
  const primary = Object.entries(result).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  return { ...result, primary };
}

// src/logic/eneagrama.ts
function calculateEneagrama(answers) {
  const scores = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0
  };
  Object.values(answers).forEach((type) => {
    if (scores[type] !== void 0) {
      scores[type]++;
    }
  });
  const primaryType = Number(
    Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0]
  );
  return { scores, primaryType };
}

// src/logic/personalities.ts
function calculatePersonalities(answers) {
  const counts = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0
  };
  Object.values(answers).forEach((val) => {
    if (counts[val] !== void 0) counts[val]++;
  });
  const type = [
    counts.E >= counts.I ? "E" : "I",
    counts.S >= counts.N ? "S" : "N",
    counts.T >= counts.F ? "T" : "F",
    counts.J >= counts.P ? "J" : "P"
  ].join("");
  return {
    type,
    scores: counts
  };
}

// src/services/testService.ts
var TestService = class {
  //essa rota vai ser chamada no applicationController
  async createLink(applicationId) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        candidate: true,
        job: true
      }
    });
    if (!application) throw new AppError("Candidatura n\xE3o encontrada", 404);
    const token = (0, import_uuid.v4)();
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setDate(expiresAt.getDate() + 2);
    const testLink = await prisma.testLink.create({
      data: { token, applicationId, expiresAt }
    });
    const url = `${env.APP_URL}/teste/${token}`;
    const expiresAtFormatted = formatBR(testLink.expiresAt);
    await emailService.sendTestLink({
      to: application.candidate.email,
      candidateName: application.candidate.nome,
      jobTitle: application.job.titulo,
      testUrl: url,
      expiresAt: expiresAtFormatted
    });
    return { url, expiresAt: expiresAtFormatted };
  }
  //essa rota vai ser chamada no publicTestController
  async validateToken(token) {
    const link = await prisma.testLink.findUnique({
      where: { token },
      include: {
        application: {
          include: {
            candidate: true,
            job: { select: { titulo: true } }
          }
        }
      }
    });
    if (!link) throw new AppError("Link inv\xE1lido.", 404);
    if (/* @__PURE__ */ new Date() > link.expiresAt) throw new AppError("Este link de teste j\xE1 expirou.", 410);
    return link;
  }
  async submitAnswers(token, data) {
    const link = await this.validateToken(token);
    const testResults = {
      disc: data.disc ? calculateDisc(data.disc) : null,
      eneagrama: data.eneagrama ? calculateEneagrama(data.eneagrama) : null,
      personalities: data.personalities ? calculatePersonalities(data.personalities) : null
    };
    await prisma.candidate.update({
      where: { id: link.application.candidateId },
      data: {
        respostasJson: JSON.parse(JSON.stringify(testResults)),
        testCompletedAt: /* @__PURE__ */ new Date()
      }
    });
    await prisma.application.update({
      where: { id: link.applicationId },
      data: { status: "TESTE_PSICOMETRICO" }
    });
    await prisma.testLink.delete({ where: { id: link.id } });
    const hrUserPromise = prisma.user.findFirst({
      where: { companyId: link.application.companyId },
      select: { email: true }
    });
    const candidateEmailPromise = emailService.sendCandidateResults({
      to: link.application.candidate.email,
      candidateName: link.application.candidate.nome,
      jobTitle: link.application.job.titulo,
      disc: testResults.disc,
      eneagrama: testResults.eneagrama,
      personalities: testResults.personalities
    }).catch(() => null);
    const [hrUser] = await Promise.all([hrUserPromise, candidateEmailPromise]);
    if (hrUser) {
      await emailService.sendTestCompleted({
        to: hrUser.email,
        candidateName: link.application.candidate.nome,
        jobTitle: link.application.job.titulo
      });
    }
    return { ok: true, results: testResults };
  }
};

// src/controllers/ApplicationController.ts
var ApplicationController = class {
  constructor() {
    this.testService = new TestService();
    this.apply = async (req, reply) => {
      const result = await this.applicationService.apply(req.body);
      return reply.status(201).send({ ok: true, data: result });
    };
    //listar as aplicações de uma empresa
    this.listByCompany = async (req, reply) => {
      const { companyId } = req.user;
      const applications = await this.applicationService.listByCompany(companyId);
      return reply.send({
        ok: true,
        data: applications
      });
    };
    //update status
    this.updateStatus = async (req, reply) => {
      const data = await this.applicationService.updateStatus(req.params.id, req.user.companyId, req.body.status);
      return reply.send({ ok: true, data });
    };
    this.listByJob = async (req, reply) => {
      const applications = await this.applicationService.listByJob(req.params.jobId, req.user.companyId);
      return reply.send({ ok: true, data: applications });
    };
    this.createTestLink = async (req, reply) => {
      const data = await this.testService.createLink(req.params.id);
      return reply.status(201).send({ ok: true, data });
    };
    this.applicationService = new ApplicationService();
  }
};

// src/schemas/application.schema.ts
var import_zod4 = require("zod");
var applyJobSchema = import_zod4.z.object({
  jobId: import_zod4.z.string().uuid("ID da vaga inv\xE1lido"),
  nome: import_zod4.z.string().min(3, "Nome muito curto"),
  email: import_zod4.z.string().email("E-mail inv\xE1lido"),
  telefone: import_zod4.z.string().min(11, "Telefone inv\xE1lido").optional(),
  curriculoUrl: import_zod4.z.string().url("URL do curr\xEDculo inv\xE1lida").optional(),
  linkedinUrl: import_zod4.z.string().url("URL do LinkedIn inv\xE1lida").optional()
});

// src/Routes/application.routes.ts
async function applicationRoutes(app2) {
  const applicationController = new ApplicationController();
  app2.post(
    "/apply",
    {
      preHandler: [validateSchema(applyJobSchema)]
    },
    applicationController.apply
  );
  app2.get(
    "/company",
    {
      preHandler: [authMiddleware]
    },
    applicationController.listByCompany
  );
  app2.get(
    "/job/:jobId",
    { preHandler: [authMiddleware] },
    applicationController.listByJob
  );
  app2.patch(
    "/:id/status",
    { preHandler: [authMiddleware] },
    applicationController.updateStatus
  );
  app2.post(
    "/:id/test-link",
    { preHandler: [authMiddleware] },
    applicationController.createTestLink
  );
}

// src/services/CompanyService.ts
function mondayOf(date) {
  const d = new Date(date);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return d.toISOString().slice(0, 10);
}
var CompanyService = class {
  async getById(id) {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) throw new AppError("Empresa n\xE3o encontrada", 404);
    return company;
  }
  async update(id, data) {
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
        cep: data.cep,
        logradouro: data.logradouro,
        cidade: data.cidade,
        estado: data.estado,
        teamEmails: data.teamEmails
      }
    });
  }
  async sendTeamInvites(companyId, emails) {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new AppError("Empresa n\xE3o encontrada", 404);
    await prisma.company.update({
      where: { id: companyId },
      data: { teamEmails: emails }
    });
    const companyName = company.nome ?? company.razaoSocial;
    await Promise.allSettled(
      emails.map(
        (email) => emailService.sendTeamInvite({ to: email, companyName })
      )
    );
    return { sent: emails.length };
  }
  async updateStep(id, step) {
    return await prisma.company.update({
      where: { id },
      data: { onboardingStep: step }
    });
  }
  async getStats(companyId) {
    const now = /* @__PURE__ */ new Date();
    const ms7d = 7 * 24 * 60 * 60 * 1e3;
    const ms8w = 8 * 7 * 24 * 60 * 60 * 1e3;
    const ago8w = new Date(now.getTime() - ms8w);
    const aprovadas = await prisma.application.findMany({
      where: { companyId, status: "APROVADO" },
      select: { createdAt: true, updatedAt: true }
    });
    const tempoMedioContratacao = aprovadas.length > 0 ? Math.round(
      aprovadas.reduce(
        (sum, a) => sum + (a.updatedAt.getTime() - a.createdAt.getTime()) / 864e5,
        0
      ) / aprovadas.length
    ) : null;
    const byStatus = await prisma.application.groupBy({
      by: ["status"],
      where: { companyId },
      _count: { id: true }
    });
    const conversao = {};
    for (const row of byStatus) conversao[row.status] = row._count.id;
    const recentApps = await prisma.application.findMany({
      where: { companyId, createdAt: { gte: ago8w } },
      select: { createdAt: true }
    });
    const weekMap = /* @__PURE__ */ new Map();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1e3);
      weekMap.set(mondayOf(d), 0);
    }
    for (const a of recentApps) {
      const key = mondayOf(a.createdAt);
      if (weekMap.has(key)) weekMap.set(key, (weekMap.get(key) ?? 0) + 1);
    }
    const candidaturasPorSemana = [...weekMap.entries()].map(([semana, count]) => ({ semana, count }));
    const topRaw = await prisma.application.groupBy({
      by: ["jobId"],
      where: { companyId },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 3
    });
    const jobs = await prisma.job.findMany({
      where: { id: { in: topRaw.map((r) => r.jobId) } },
      select: { id: true, titulo: true }
    });
    const topVagas = topRaw.map((r) => ({
      id: r.jobId,
      titulo: jobs.find((j) => j.id === r.jobId)?.titulo ?? "\u2014",
      count: r._count.id
    }));
    const vagasAbertas = await prisma.job.findMany({
      where: { companyId, status: "ABERTA" },
      select: {
        id: true,
        titulo: true,
        createdAt: true,
        applications: { select: { createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 }
      }
    });
    const vagasSemCandidatos = vagasAbertas.map((v) => {
      const ref = v.applications[0]?.createdAt ?? v.createdAt;
      return { id: v.id, titulo: v.titulo, dias: Math.round((now.getTime() - ref.getTime()) / 864e5) };
    }).filter((v) => v.dias > 7).sort((a, b) => b.dias - a.dias);
    return { tempoMedioContratacao, conversao, candidaturasPorSemana, topVagas, vagasSemCandidatos };
  }
};

// src/controllers/CompanyController.ts
var CompanyController = class {
  constructor() {
    this.companyService = new CompanyService();
    this.get = async (req, reply) => {
      const data = await this.companyService.getById(req.user.companyId);
      return reply.send({ ok: true, data });
    };
    //update
    this.update = async (req, reply) => {
      const data = await this.companyService.update(req.user.companyId, req.body);
      return reply.send({ ok: true, data });
    };
    this.getStats = async (req, reply) => {
      const data = await this.companyService.getStats(req.user.companyId);
      return reply.send({ ok: true, data });
    };
    this.teamInvite = async (req, reply) => {
      const data = await this.companyService.sendTeamInvites(req.user.companyId, req.body.emails);
      return reply.send({ ok: true, data });
    };
    this.updateStep = async (req, reply) => {
      const step = Number(req.params.step);
      if (isNaN(step)) {
        throw new AppError("O passo do onboarding deve ser um n\xFAmero", 400);
      }
      const data = await this.companyService.updateStep(
        req.user.companyId,
        step
      );
      return reply.send({ ok: true, data });
    };
  }
};

// src/schemas/company.schema.ts
var import_zod5 = require("zod");
var updateCompanySchema = import_zod5.z.object({
  nome: import_zod5.z.string().min(3).optional(),
  razaoSocial: import_zod5.z.string().optional(),
  cnpj: import_zod5.z.string().optional(),
  contextoEmpresa: import_zod5.z.string().optional(),
  perfilRitmo: import_zod5.z.string().optional(),
  valores: import_zod5.z.array(import_zod5.z.string()).optional(),
  logoUrl: import_zod5.z.string().url().optional(),
  cep: import_zod5.z.string().optional(),
  logradouro: import_zod5.z.string().optional(),
  cidade: import_zod5.z.string().optional(),
  estado: import_zod5.z.string().optional(),
  teamEmails: import_zod5.z.array(import_zod5.z.string().email()).optional()
});
var teamInviteSchema = import_zod5.z.object({
  emails: import_zod5.z.array(import_zod5.z.string().email()).min(1, "Informe ao menos um e-mail")
});

// src/Routes/company.routes.ts
async function companyRoutes(app2) {
  const controller = new CompanyController();
  app2.addHook("preHandler", authMiddleware);
  app2.get("/", controller.get);
  app2.patch(
    "/",
    { preHandler: [validateSchema(updateCompanySchema)] },
    controller.update
  );
  app2.patch("/onboarding/:step", controller.updateStep);
  app2.post(
    "/team-invite",
    { preHandler: [validateSchema(teamInviteSchema)] },
    controller.teamInvite
  );
  app2.get("/stats", controller.getStats);
}

// src/services/OrganogramaService.ts
var OrganogramaService = class {
  //listar o organograma
  async executeList(companyId) {
    const nodes = await prisma.organogramaNode.findMany({
      where: { companyId },
      orderBy: { createdAt: "asc" }
    });
    return nodes.map((node) => ({
      ...node,
      createdAt: formatBR(node.createdAt),
      updatedAt: formatBR(node.updatedAt)
    }));
  }
  //criando o organograma
  async executeCreate(data, companyId) {
    const newNode = await prisma.organogramaNode.create({
      data: { ...data, companyId }
    });
    return {
      ...newNode,
      createdAt: formatBR(newNode.createdAt),
      updatedAt: formatBR(newNode.updatedAt)
    };
  }
  // atualizando um nó do organograma
  async executeUpdate(id, data, companyId) {
    const node = await prisma.organogramaNode.findFirst({ where: { id, companyId } });
    if (!node) throw new AppError("N\xF3 n\xE3o encontrado", 404);
    const updated = await prisma.organogramaNode.update({
      where: { id },
      data
    });
    return {
      ...updated,
      createdAt: formatBR(updated.createdAt),
      updatedAt: formatBR(updated.updatedAt)
    };
  }
  async executeDelete(id, companyId) {
    const node = await prisma.organogramaNode.findFirst({ where: { id, companyId } });
    if (!node) throw new AppError("N\xF3 n\xE3o encontrado", 404);
    try {
      await prisma.organogramaNode.delete({ where: { id } });
    } catch {
      throw new AppError("Erro ao deletar o n\xF3", 500);
    }
  }
};

// src/controllers/OrganogramaController.ts
var OrganogramaController = class {
  constructor() {
    this.organogramaService = new OrganogramaService();
    this.get = async (req, reply) => {
      const data = await this.organogramaService.executeList(req.user.companyId);
      return reply.send({ ok: true, data });
    };
    this.create = async (req, reply) => {
      const data = await this.organogramaService.executeCreate(req.body, req.user.companyId);
      return reply.status(201).send({ ok: true, data });
    };
    this.update = async (req, reply) => {
      const data = await this.organogramaService.executeUpdate(req.params.id, req.body, req.user.companyId);
      return reply.send({ ok: true, data });
    };
    this.delete = async (req, reply) => {
      await this.organogramaService.executeDelete(req.params.id, req.user.companyId);
      return reply.status(204).send({ ok: true, message: "N\xF3 removido com sucesso" });
    };
  }
};

// src/schemas/organograma.schema.ts
var import_zod6 = require("zod");
var organogramaSchema = import_zod6.z.object({
  nome: import_zod6.z.string().min(3, "O nome \xE9 obrigat\xF3rio"),
  cargo: import_zod6.z.string().min(2, "O cargo \xE9 obrigat\xF3rio"),
  parentId: import_zod6.z.string().uuid().optional().nullable()
});
var paramsIdDTO = import_zod6.z.object({
  id: import_zod6.z.string().uuid()
});

// src/Routes/organograma.routes.ts
async function organogramaRoutes(app2) {
  const organogramaController = new OrganogramaController();
  app2.addHook("preHandler", authMiddleware);
  app2.get("/", organogramaController.get);
  app2.post(
    "/",
    { preHandler: [validateSchema(organogramaSchema)] },
    organogramaController.create
  );
  app2.patch(
    "/:id",
    { preHandler: [validateSchema(paramsIdDTO, "params")] },
    organogramaController.update
  );
  app2.delete(
    "/:id",
    { preHandler: [validateSchema(paramsIdDTO, "params")] },
    organogramaController.delete
  );
}

// src/data/disc_questions.json
var disc_questions_default = [
  {
    id: "q1",
    text: "Em um ambiente de trabalho, voc\xEA se descreveria mais como:",
    options: [
      { value: "D", text: "Decidido e focado em resultados." },
      { value: "I", text: "Entusiasta e comunicativo." },
      { value: "S", text: "Paciente e bom ouvinte." },
      { value: "C", text: "Preciso e atento aos detalhes." }
    ]
  },
  {
    id: "q2",
    text: "Ao enfrentar um problema dif\xEDcil, sua tend\xEAncia \xE9:",
    options: [
      { value: "D", text: "Assumir o controle e agir r\xE1pido." },
      { value: "I", text: "Reunir as pessoas para trocar ideias." },
      { value: "S", text: "Manter a calma e buscar estabilidade." },
      { value: "C", text: "Analisar todos os fatos antes de decidir." }
    ]
  },
  {
    id: "q3",
    text: "Em reuni\xF5es de equipe, voc\xEA geralmente:",
    options: [
      { value: "D", text: "Lidera a discuss\xE3o e define o ritmo." },
      { value: "I", text: "Motiva o grupo e compartilha ideias livremente." },
      { value: "S", text: "Ouve atentamente e busca o consenso." },
      { value: "C", text: "Observa, organiza as informa\xE7\xF5es e cobra clareza." }
    ]
  },
  {
    id: "q4",
    text: "Quando recebe uma tarefa nova, sua primeira rea\xE7\xE3o \xE9:",
    options: [
      { value: "D", text: "Pensar em como fazer de forma r\xE1pida e eficiente." },
      { value: "I", text: "Ficar animado e querer compartilhar a novidade." },
      { value: "S", text: "Garantir que entende tudo para fazer corretamente." },
      { value: "C", text: "Verificar os detalhes e planejar cada etapa." }
    ]
  },
  {
    id: "q5",
    text: "Voc\xEA se sente mais confort\xE1vel quando:",
    options: [
      { value: "D", text: "Tem controle sobre a situa\xE7\xE3o e pode decidir sozinho." },
      { value: "I", text: "Est\xE1 rodeado de pessoas e interagindo com todos." },
      { value: "S", text: "Segue uma rotina previs\xEDvel e colabora com o grupo." },
      { value: "C", text: "Tem tempo para analisar tudo com calma e precis\xE3o." }
    ]
  },
  {
    id: "q6",
    text: "Ao lidar com prazos apertados, voc\xEA:",
    options: [
      { value: "D", text: "Foca no objetivo final e exige resultados." },
      { value: "I", text: "Mant\xE9m o \xE2nimo da equipe e busca solu\xE7\xF5es criativas." },
      { value: "S", text: "Trabalha de forma consistente e ajuda os colegas." },
      { value: "C", text: "Se preocupa com a qualidade e revisa tudo cuidadosamente." }
    ]
  },
  {
    id: "q7",
    text: "Em situa\xE7\xF5es de conflito, voc\xEA tende a:",
    options: [
      { value: "D", text: "Confrontar diretamente para resolver r\xE1pido." },
      { value: "I", text: "Usar o di\xE1logo para convencer e harmonizar." },
      { value: "S", text: "Mediar e garantir que todos se sintam ouvidos." },
      { value: "C", text: "Analisar os fatos para apontar a solu\xE7\xE3o l\xF3gica." }
    ]
  },
  {
    id: "q8",
    text: "Voc\xEA prefere trabalhar:",
    options: [
      { value: "D", text: "Sozinho, com autonomia total." },
      { value: "I", text: "Em equipe, com muita intera\xE7\xE3o." },
      { value: "S", text: "Em um time est\xE1vel e harmonioso." },
      { value: "C", text: "Com tempo para planejar e executar com qualidade." }
    ]
  },
  {
    id: "q9",
    text: "Sua maior for\xE7a no ambiente profissional \xE9:",
    options: [
      { value: "D", text: "Determina\xE7\xE3o e foco em resultados." },
      { value: "I", text: "Otimismo e capacidade de motivar." },
      { value: "S", text: "Paci\xEAncia e habilidade de ouvir." },
      { value: "C", text: "Precis\xE3o e aten\xE7\xE3o aos detalhes." }
    ]
  },
  {
    id: "q10",
    text: "Em um ambiente ca\xF3tico, voc\xEA:",
    options: [
      { value: "D", text: "Toma a frente para organizar." },
      { value: "I", text: "Tenta animar as pessoas e buscar solu\xE7\xF5es divertidas." },
      { value: "S", text: "Mant\xE9m a calma e ajuda a manter a estabilidade." },
      { value: "C", text: "Busca entender a causa raiz do problema." }
    ]
  }
];

// src/data/eneagrama_questions.json
var eneagrama_questions_default = [
  {
    id: "en1",
    text: "Em situa\xE7\xF5es de conflito, eu costumo:",
    options: [
      { value: 1, text: "Manter a calma e buscar a perfei\xE7\xE3o na solu\xE7\xE3o." },
      { value: 8, text: "Impor minha vontade e enfrentar o problema de frente." },
      { value: 9, text: "Evitar o embate para manter a harmonia do grupo." }
    ]
  },
  {
    id: "en2",
    text: "Eu me considero uma pessoa que:",
    options: [
      { value: 2, text: "Gosta de ajudar os outros e ser \xFAtil." },
      { value: 5, text: "Prefere observar e analisar as situa\xE7\xF5es." },
      { value: 7, text: "Busca novas experi\xEAncias e divers\xE3o." }
    ]
  },
  {
    id: "en3",
    text: "Quando recebo elogios, geralmente:",
    options: [
      { value: 3, text: "Me sinto realizado e confiante." },
      { value: 6, text: "Fico desconfiado e procuro entender o motivo." },
      { value: 9, text: "Fico feliz, mas tento n\xE3o demonstrar muito." }
    ]
  },
  {
    id: "en4",
    text: "Em meu tempo livre, gosto de:",
    options: [
      { value: 4, text: "Expressar minha criatividade e emo\xE7\xF5es." },
      { value: 7, text: "Explorar coisas novas e me divertir." },
      { value: 1, text: "Organizar e melhorar as coisas." }
    ]
  },
  {
    id: "en5",
    text: "Eu costumo guardar minhas emo\xE7\xF5es para:",
    options: [
      { value: 5, text: "Analisar com calma antes de agir." },
      { value: 8, text: "Guardar para mim mesmo, n\xE3o gosto de expor." },
      { value: 2, text: "Compartilhar com quem confio." }
    ]
  },
  {
    id: "en6",
    text: "Quando preciso tomar uma decis\xE3o importante:",
    options: [
      { value: 6, text: "Busco conselhos e avalio todos os riscos." },
      { value: 3, text: "Penso no que trar\xE1 mais sucesso." },
      { value: 9, text: "Tento evitar a responsabilidade." }
    ]
  },
  {
    id: "en7",
    text: "Eu me sinto vivo quando:",
    options: [
      { value: 7, text: "Estou planejando algo emocionante." },
      { value: 4, text: "Estou expressando minha individualidade." },
      { value: 1, text: "Estou corrigindo um erro ou melhorando algo." }
    ]
  },
  {
    id: "en8",
    text: "Em discuss\xF5es, eu geralmente:",
    options: [
      { value: 8, text: "Defendo meu ponto de vista com firmeza." },
      { value: 2, text: "Tento mediar e ajudar todos a se entenderem." },
      { value: 5, text: "Observo e s\xF3 falo se necess\xE1rio." }
    ]
  },
  {
    id: "en9",
    text: "Eu me preocupo muito com:",
    options: [
      { value: 9, text: "A paz e harmonia ao meu redor." },
      { value: 3, text: "Como os outros me veem profissionalmente." },
      { value: 6, text: "O que pode dar errado no futuro." }
    ]
  }
];

// src/data/personality_questions.json
var personality_questions_default = [
  {
    id: "p1",
    text: "Ap\xF3s uma semana cansativa, voc\xEA prefere:",
    options: [
      { value: "E", text: "Sair com amigos e conhecer gente nova." },
      { value: "I", text: "Ficar em casa relaxando com um bom livro ou filme." }
    ]
  },
  {
    id: "p2",
    text: "Ao tomar uma decis\xE3o importante, voc\xEA foca mais em:",
    options: [
      { value: "T", text: "L\xF3gica, fatos e crit\xE9rios objetivos." },
      { value: "F", text: "Valores pessoais e no impacto nas pessoas." }
    ]
  },
  {
    id: "p3",
    text: "Quando recebe uma tarefa, sua abordagem \xE9:",
    options: [
      { value: "J", text: "Planejar e organizar as etapas com anteced\xEAncia." },
      { value: "P", text: "Come\xE7ar logo e adaptar o caminho conforme surge." }
    ]
  },
  {
    id: "p4",
    text: "Em conversas, voc\xEA costuma:",
    options: [
      { value: "E", text: "Interagir bastante e se envolver na conversa." },
      { value: "I", text: "Ouvir mais e falar quando tem algo relevante a acrescentar." }
    ]
  },
  {
    id: "p5",
    text: "Ao enfrentar um problema complexo, voc\xEA prefere:",
    options: [
      { value: "N", text: "Buscar novas perspectivas e possibilidades." },
      { value: "S", text: "Focar em solu\xE7\xF5es pr\xE1ticas e testadas." }
    ]
  },
  {
    id: "p6",
    text: "Em situa\xE7\xF5es sociais, voc\xEA:",
    options: [
      { value: "F", text: "Busca criar conex\xE3o e bem-estar no grupo." },
      { value: "T", text: "Age de forma mais reservada e objetiva." }
    ]
  },
  {
    id: "p7",
    text: "Voc\xEA se sente mais motivado quando:",
    options: [
      { value: "S", text: "Segue uma rotina estabelecida e sabe o que esperar." },
      { value: "N", text: "Pode explorar novas ideias e possibilidades." }
    ]
  },
  {
    id: "p8",
    text: "Ao lidar com cr\xEDticas, voc\xEA:",
    options: [
      { value: "I", text: "Reflete por um tempo antes de responder." },
      { value: "E", text: "Responde de forma mais imediata e interativa." }
    ]
  },
  {
    id: "p9",
    text: "Em projetos, voc\xEA gosta mais de:",
    options: [
      { value: "P", text: "Explorar diferentes abordagens e improvisar." },
      { value: "J", text: "Definir um plano e segui-lo com consist\xEAncia." }
    ]
  },
  {
    id: "p10",
    text: "Em um trabalho em equipe, voc\xEA tende a:",
    options: [
      { value: "T", text: "Focar na tarefa e na efici\xEAncia da execu\xE7\xE3o." },
      { value: "F", text: "Se importar com o clima e o bem-estar do time." }
    ]
  },
  {
    id: "p11",
    text: "Voc\xEA se considera algu\xE9m que:",
    options: [
      { value: "E", text: "Ganha energia estando perto de pessoas." },
      { value: "I", text: "Recarrega as energias passando tempo sozinho." }
    ]
  },
  {
    id: "p12",
    text: "Ao analisar informa\xE7\xF5es, voc\xEA tende a:",
    options: [
      { value: "S", text: "Acreditar no que \xE9 concreto e factual." },
      { value: "N", text: "Pensar em teorias, padr\xF5es e possibilidades futuras." }
    ]
  }
];

// src/controllers/publicTestController.ts
var PublicTestController = class {
  constructor() {
    this.service = new TestService();
    this.getTest = async (req, reply) => {
      const link = await this.service.validateToken(req.params.token);
      return reply.send({
        ok: true,
        data: {
          candidate: link.application.candidate.nome,
          expiresAt: formatBR(link.expiresAt),
          questions: {
            disc: disc_questions_default,
            eneagrama: eneagrama_questions_default,
            personalities: personality_questions_default
          }
        }
      });
    };
    this.submit = async (req, reply) => {
      const result = await this.service.submitAnswers(req.params.token, req.body);
      return reply.send(result);
    };
  }
};

// src/schemas/testLink.schema.ts
var import_zod7 = require("zod");
var testTokenParamsSchema = import_zod7.z.object({
  token: import_zod7.z.string().uuid("Token inv\xE1lido")
});
var submitTestSchema = import_zod7.z.object({
  disc: import_zod7.z.record(import_zod7.z.string(), import_zod7.z.enum(["D", "I", "S", "C"])).optional(),
  eneagrama: import_zod7.z.record(import_zod7.z.string(), import_zod7.z.number().int().min(1).max(9)).optional(),
  personalities: import_zod7.z.record(import_zod7.z.string(), import_zod7.z.enum(["E", "I", "S", "N", "T", "F", "J", "P"])).optional()
});

// src/Routes/publicTest.routes.ts
async function publicTestRoutes(app2) {
  const controller = new PublicTestController();
  app2.get(
    "/:token",
    { preHandler: [validateSchema(testTokenParamsSchema, "params")] },
    controller.getTest
  );
  app2.post(
    "/:token/submit",
    {
      preHandler: [
        validateSchema(testTokenParamsSchema, "params"),
        validateSchema(submitTestSchema, "body")
      ]
    },
    controller.submit
  );
}

// src/Ai/openai.ts
var import_openai = require("@ai-sdk/openai");
var import_ai = require("ai");
var model = (0, import_openai.openai)("gpt-4o-mini");
var ai = {
  async generateText(prompt, system) {
    const { text } = await (0, import_ai.generateText)({
      model,
      system,
      prompt
    });
    return text;
  },
  async generateJson(schema, prompt, system) {
    const { text } = await (0, import_ai.generateText)({
      model,
      system: `${system ?? ""}

Responda APENAS com JSON v\xE1lido, sem markdown, sem explica\xE7\xF5es.`.trim(),
      prompt
    });
    return schema.parse(JSON.parse(text));
  },
  async streamText(prompt, system) {
    const result = (0, import_ai.streamText)({
      model,
      system,
      prompt
    });
    return result.textStream;
  }
};

// src/Ai/prompts/index.ts
var prompts = {
  jd: (title, requirements) => `
    Atue como um recrutador Tech senior. Escreva uma descri\xE7\xE3o de vaga (Job Description) profissional para o cargo: ${title}.
    Considere estes requisitos: ${requirements}.
    A sa\xEDda deve ter: Resumo, Responsabilidades, Requisitos (Hard/Soft Skills) e Diferenciais.
  `,
  match: (jobData, candidateData, companyContext) => `
Voc\xEA \xE9 um especialista em RH e psicologia organizacional. Analise a compatibilidade entre a vaga, o candidato e o contexto da empresa.

EMPRESA (contexto cultural):
${companyContext}

VAGA:
${jobData}

CANDIDATO:
${candidateData}

Retorne SOMENTE um objeto JSON v\xE1lido, sem texto extra, com exatamente esta estrutura:
{
  "matchScore": <n\xFAmero de 0 a 100>,
  "resumoExecutivo": "<par\xE1grafo curto explicando o fit geral>",
  "pontosFortes": [
    { "titulo": "<nome>", "descricao": "<detalhe>", "impactoNaFuncao": "<como isso ajuda na fun\xE7\xE3o>" }
  ],
  "pontosAtencao": [
    { "titulo": "<nome>", "descricao": "<detalhe>", "sugestaoDeDesenvolvimento": "<como desenvolver>" }
  ],
  "comoLiderarEsseCandidato": {
    "delegacao": "<orienta\xE7\xE3o>",
    "feedback": "<orienta\xE7\xE3o>",
    "motivacao": "<orienta\xE7\xE3o>"
  },
  "matchComCultura": {
    "onde": "<onde o candidato se alinha com a cultura>",
    "fricaoEsperada": "<onde pode haver atrito>"
  },
  "perguntasComplementares": ["<pergunta 1>", "<pergunta 2>", "<pergunta 3>"],
  "desafioPratico": {
    "titulo": "<nome do desafio>",
    "descricao": "<descri\xE7\xE3o detalhada>",
    "duracaoEstimada": "<ex: 3 horas>",
    "habilidadesAvaliadas": ["<habilidade 1>", "<habilidade 2>"]
  },
  "planoDevelopment": {
    "livros": [
      { "titulo": "<t\xEDtulo do livro>", "motivo": "<por que \xE9 relevante para este candidato>" }
    ],
    "cursos": [
      { "nome": "<nome do curso>", "plataforma": "<ex: Coursera, Udemy>", "motivo": "<por que \xE9 relevante>" }
    ],
    "evolucaoSalarial": "<proje\xE7\xE3o de evolu\xE7\xE3o salarial em 12-24 meses com este plano de desenvolvimento>"
  }
}
  `,
  perfilIdeal: (jobData, companyContext) => `
Voc\xEA \xE9 um especialista em recrutamento e psicologia organizacional. Com base na vaga e no contexto da empresa, gere:
1. Perguntas de triagem para o processo seletivo
2. O perfil psicom\xE9trico ideal para este cargo

EMPRESA:
${companyContext}

VAGA:
${jobData}

Retorne SOMENTE um objeto JSON v\xE1lido, sem texto extra, com exatamente esta estrutura:
{
  "perguntasTriagem": [
    "<pergunta de triagem 1>",
    "<pergunta de triagem 2>",
    "<pergunta de triagem 3>",
    "<pergunta de triagem 4>",
    "<pergunta de triagem 5>"
  ],
  "perfilPsicometricoIdeal": {
    "disc": "<perfil DISC ideal, ex: D - Domin\xE2ncia com tra\xE7os de C>",
    "eneagrama": "<tipo de eneagrama ideal, ex: Tipo 3 - Realizador>",
    "tracosPrincipais": ["<tra\xE7o 1>", "<tra\xE7o 2>", "<tra\xE7o 3>"]
  }
}
  `,
  chat: (context) => `
    Voc\xEA \xE9 um assistente especializado em RH e recrutamento. 
    Contexto atual da conversa: ${context}
  `
};

// src/schemas/ai.schema.ts
var import_zod8 = require("zod");
var aiJobParamsSchema = import_zod8.z.object({
  id: import_zod8.z.string().uuid("ID da vaga inv\xE1lido")
});
var matchBodySchema = import_zod8.z.object({
  candidateId: import_zod8.z.string().uuid("ID do candidato inv\xE1lido")
});
var aiMatchResultSchema = import_zod8.z.object({
  matchScore: import_zod8.z.number().min(0).max(100),
  resumoExecutivo: import_zod8.z.string(),
  pontosFortes: import_zod8.z.array(import_zod8.z.object({
    titulo: import_zod8.z.string(),
    descricao: import_zod8.z.string(),
    impactoNaFuncao: import_zod8.z.string()
  })),
  pontosAtencao: import_zod8.z.array(import_zod8.z.object({
    titulo: import_zod8.z.string(),
    descricao: import_zod8.z.string(),
    sugestaoDeDesenvolvimento: import_zod8.z.string()
  })),
  comoLiderarEsseCandidato: import_zod8.z.object({
    delegacao: import_zod8.z.string(),
    feedback: import_zod8.z.string(),
    motivacao: import_zod8.z.string()
  }),
  matchComCultura: import_zod8.z.object({
    onde: import_zod8.z.string(),
    fricaoEsperada: import_zod8.z.string()
  }),
  perguntasComplementares: import_zod8.z.array(import_zod8.z.string()),
  desafioPratico: import_zod8.z.object({
    titulo: import_zod8.z.string(),
    descricao: import_zod8.z.string(),
    duracaoEstimada: import_zod8.z.string(),
    habilidadesAvaliadas: import_zod8.z.array(import_zod8.z.string())
  }),
  planoDevelopment: import_zod8.z.object({
    livros: import_zod8.z.array(import_zod8.z.object({ titulo: import_zod8.z.string(), motivo: import_zod8.z.string() })),
    cursos: import_zod8.z.array(import_zod8.z.object({ nome: import_zod8.z.string(), plataforma: import_zod8.z.string(), motivo: import_zod8.z.string() })),
    evolucaoSalarial: import_zod8.z.string()
  })
});
var perfilIdealSchema = import_zod8.z.object({
  perguntasTriagem: import_zod8.z.array(import_zod8.z.string()),
  perfilPsicometricoIdeal: import_zod8.z.object({
    disc: import_zod8.z.string(),
    eneagrama: import_zod8.z.string(),
    tracosPrincipais: import_zod8.z.array(import_zod8.z.string())
  })
});

// src/services/matchService.ts
var MatchService = class {
  async generateJd(jobId) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new AppError("Vaga n\xE3o encontrada", 404);
    const description = await ai.generateText(
      prompts.jd(job.titulo, job.descricao || ""),
      "Voc\xEA \xE9 um especialista em recrutamento tech."
    );
    await prisma.job.update({
      where: { id: jobId },
      data: { jdGerada: description }
    });
    return description;
  }
  async generateMatch(jobId, candidateId) {
    const [job, candidate] = await Promise.all([
      prisma.job.findUnique({ where: { id: jobId }, include: { company: true } }),
      prisma.candidate.findUnique({ where: { id: candidateId } })
    ]);
    if (!job) throw new AppError("Vaga n\xE3o encontrada", 404);
    if (!candidate) throw new AppError("Candidato n\xE3o encontrado", 404);
    const application = await prisma.application.findFirst({
      where: { jobId, candidateId }
    });
    if (!application) throw new AppError("Candidatura n\xE3o encontrada para esta vaga e candidato", 404);
    const companyContext = JSON.stringify({
      contextoEmpresa: job.company.contextoEmpresa,
      perfilRitmo: job.company.perfilRitmo,
      valores: job.company.valores
    });
    const { company: _company, ...jobData } = job;
    const analysis = await ai.generateJson(
      aiMatchResultSchema,
      prompts.match(JSON.stringify(jobData), JSON.stringify(candidate), companyContext),
      "Voc\xEA \xE9 um sistema de triagem de RH de alta precis\xE3o."
    );
    await prisma.application.update({
      where: { id: application.id },
      data: {
        matchScore: analysis.matchScore,
        feedbackIA: analysis.resumoExecutivo,
        matchResultJson: JSON.parse(JSON.stringify(analysis))
      }
    });
    return analysis;
  }
  async generatePerfilIdeal(jobId) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true }
    });
    if (!job) throw new AppError("Vaga n\xE3o encontrada", 404);
    const companyContext = JSON.stringify({
      contextoEmpresa: job.company.contextoEmpresa,
      perfilRitmo: job.company.perfilRitmo,
      valores: job.company.valores
    });
    const { company: _company, ...jobData } = job;
    const perfil = await ai.generateJson(
      perfilIdealSchema,
      prompts.perfilIdeal(JSON.stringify(jobData), companyContext),
      "Voc\xEA \xE9 um especialista em recrutamento e psicologia organizacional."
    );
    await prisma.job.update({
      where: { id: jobId },
      data: { perfilIdealJson: JSON.parse(JSON.stringify(perfil)) }
    });
    return perfil;
  }
};

// src/controllers/AiController.ts
var AiController = class {
  constructor() {
    this.service = new MatchService();
    this.generateJd = async (req, reply) => {
      const data = await this.service.generateJd(req.params.id);
      return reply.send({ ok: true, data });
    };
    this.match = async (req, reply) => {
      const data = await this.service.generateMatch(req.params.id, req.body.candidateId);
      return reply.send({ ok: true, data });
    };
    this.generatePerfilIdeal = async (req, reply) => {
      const data = await this.service.generatePerfilIdeal(req.params.id);
      return reply.send({ ok: true, data });
    };
  }
};

// src/Routes/ai.routes.ts
async function aiRoutes(app2) {
  const aiController = new AiController();
  app2.addHook("preHandler", authMiddleware);
  app2.post(
    "/jobs/:id/generate-jd",
    { preHandler: [validateSchema(aiJobParamsSchema, "params")] },
    aiController.generateJd
  );
  app2.post(
    "/jobs/:id/match",
    {
      preHandler: [
        validateSchema(aiJobParamsSchema, "params"),
        validateSchema(matchBodySchema)
      ]
    },
    aiController.match
  );
  app2.post(
    "/jobs/:id/generate-perfil-ideal",
    { preHandler: [validateSchema(aiJobParamsSchema, "params")] },
    aiController.generatePerfilIdeal
  );
}

// src/Routes/chat.routes.ts
var import_zod9 = require("zod");

// src/services/chatService.ts
var ChatService = class {
  async stream(message, context) {
    const system = prompts.chat(context ?? "");
    return ai.streamText(message, system);
  }
};

// src/controllers/ChatController.ts
var ChatController = class {
  constructor() {
    this.service = new ChatService();
    this.stream = async (req, reply) => {
      const { message, context } = req.body;
      const origin = req.headers.origin;
      if (origin) {
        reply.raw.setHeader("Access-Control-Allow-Origin", origin);
        reply.raw.setHeader("Vary", "Origin");
      }
      reply.raw.setHeader("Content-Type", "text/event-stream");
      reply.raw.setHeader("Cache-Control", "no-cache");
      reply.raw.setHeader("Connection", "keep-alive");
      reply.raw.flushHeaders();
      try {
        const textStream = await this.service.stream(message, context);
        for await (const chunk of textStream) {
          reply.raw.write(`data: ${JSON.stringify({ text: chunk })}

`);
        }
        reply.raw.write("data: [DONE]\n\n");
      } catch (err) {
        req.log.error(err, "Chat stream error");
        reply.raw.write(`data: ${JSON.stringify({ text: "\n\n[Erro ao gerar resposta. Tente novamente.]" })}

`);
        reply.raw.write("data: [DONE]\n\n");
      } finally {
        reply.raw.end();
      }
    };
  }
};

// src/Routes/chat.routes.ts
var chatController = new ChatController();
var chatBodySchema = import_zod9.z.object({
  message: import_zod9.z.string().min(1),
  context: import_zod9.z.string().optional()
});
async function chatRoutes(fastify) {
  fastify.post("/", {
    preHandler: [authMiddleware],
    schema: {
      body: chatBodySchema
    },
    handler: chatController.stream
  });
}

// src/services/PublicJobService.ts
var PublicJobService = class {
  async getJobByPublicToken(publicToken) {
    const job = await prisma.job.findUnique({
      where: { publicToken },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        jdGerada: true,
        requisitos: true,
        salaryMin: true,
        salaryMax: true,
        status: true,
        company: {
          select: {
            nome: true,
            razaoSocial: true,
            logoUrl: true
          }
        }
      }
    });
    if (!job) throw new AppError("Vaga n\xE3o encontrada ou link inv\xE1lido.", 404);
    if (job.status === "FECHADA") {
      throw new AppError("Esta vaga foi encerrada e n\xE3o est\xE1 mais aceitando candidaturas.", 410);
    }
    return job;
  }
};

// src/controllers/PublicJobController.ts
var publicJobService = new PublicJobService();
var PublicJobController = class {
  async getJob(req, reply) {
    const { publicToken } = req.params;
    const job = await publicJobService.getJobByPublicToken(publicToken);
    return reply.send({ ok: true, data: job });
  }
};

// src/services/UploadService.ts
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_crypto2 = require("crypto");
var ALLOWED_TYPES = {
  "application/pdf": ".pdf",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg"
};
var REVERSE_TYPES = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};
var UploadService = class {
  async processUpload(file) {
    if (!file) throw new AppError("Nenhum arquivo enviado.", 400);
    const ext = ALLOWED_TYPES[file.mimetype];
    if (!ext) throw new AppError("Tipo n\xE3o suportado. Envie PDF, PNG, JPG, WebP ou SVG.", 400);
    const uploadsDir = import_path.default.join(process.cwd(), "uploads");
    if (!import_fs.default.existsSync(uploadsDir)) import_fs.default.mkdirSync(uploadsDir, { recursive: true });
    const filename = `${(0, import_crypto2.randomUUID)()}${ext}`;
    const buffer = await file.toBuffer();
    import_fs.default.writeFileSync(import_path.default.join(uploadsDir, filename), buffer);
    const baseUrl = process.env.BASE_URL ?? "http://localhost:3001";
    return { url: `${baseUrl}/api/public/uploads/${filename}` };
  }
  getFileStream(filename) {
    const safeFilename = import_path.default.basename(filename);
    const filePath = import_path.default.join(process.cwd(), "uploads", safeFilename);
    if (!import_fs.default.existsSync(filePath)) throw new AppError("Arquivo n\xE3o encontrado.", 404);
    const ext = import_path.default.extname(safeFilename).toLowerCase();
    const contentType = REVERSE_TYPES[ext] || "application/octet-stream";
    const stream = import_fs.default.createReadStream(filePath);
    return { stream, safeFilename, contentType };
  }
};

// src/controllers/UploadController.ts
var uploadService = new UploadService();
var UploadController = class {
  async upload(req, reply) {
    const file = await req.file();
    const result = await uploadService.processUpload(file);
    return reply.status(201).send({ ok: true, data: result });
  }
  async serveFile(req, reply) {
    const { filename } = req.params;
    const { stream, safeFilename, contentType } = uploadService.getFileStream(filename);
    reply.header("Content-Type", contentType);
    reply.header("Content-Disposition", `inline; filename="${safeFilename}"`);
    return reply.send(stream);
  }
};

// src/Routes/publicJob.routes.ts
var publicJobController = new PublicJobController();
var uploadController = new UploadController();
async function publicJobRoutes(app2) {
  app2.get(
    "/:publicToken",
    (req, reply) => publicJobController.getJob(req, reply)
  );
}
async function uploadRoutes(app2) {
  app2.post(
    "/upload",
    (req, reply) => uploadController.upload(req, reply)
  );
  app2.get(
    "/uploads/:filename",
    (req, reply) => uploadController.serveFile(req, reply)
  );
}

// src/Routes/index.ts
async function routes(fastify) {
  fastify.get("/health", async () => {
    return {
      status: "ok",
      message: "Servidor est\xE1 ativo e funcionando corretamente!"
    };
  });
  fastify.register(authRoutes);
  fastify.register(jobRoutes, { prefix: "/jobs" });
  fastify.register(applicationRoutes, { prefix: "/applications" });
  fastify.register(companyRoutes, { prefix: "/company" });
  fastify.register(organogramaRoutes, { prefix: "/organograma" });
  fastify.register(publicTestRoutes, { prefix: "/public/tests" });
  fastify.register(aiRoutes, { prefix: "/ai" });
  fastify.register(chatRoutes, { prefix: "/chat" });
  fastify.register(publicJobRoutes, { prefix: "/public/jobs" });
  fastify.register(uploadRoutes, { prefix: "/public" });
}
var Routes_default = routes;

// src/app.ts
var import_cors = __toESM(require("@fastify/cors"), 1);
var import_multipart = __toESM(require("@fastify/multipart"), 1);
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");
var import_zod10 = require("zod");
var app = (0, import_fastify.default)({
  logger: {
    level: env.NODE_ENV === "dev" ? "info" : "error"
  }
});
app.register(import_multipart.default, {
  limits: { fileSize: 5 * 1024 * 1024 }
  // 5 MB
});
app.register(import_cors.default, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Type"]
});
app.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
app.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
app.addContentTypeParser("application/json", { parseAs: "string" }, (req, body, done) => {
  if (!body || body === "") return done(null, {});
  try {
    done(null, JSON.parse(body));
  } catch (err) {
    done(err, void 0);
  }
});
app.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ ok: false, error: error.message });
  }
  if (error instanceof import_zod10.ZodError) {
    return reply.status(400).send({ ok: false, error: "Dados inv\xE1lidos", fieldErrors: error.flatten().fieldErrors });
  }
  request.log.error(error);
  return reply.status(500).send({ ok: false, error: "Erro interno do servidor" });
});
app.register(Routes_default, { prefix: "/api" });
var app_default = app;

// src/server.ts
var startServer = async () => {
  try {
    await prismaConnect();
    await app_default.listen({
      port: Number(process.env.PORT) || 3001,
      host: "0.0.0.0"
    });
    console.log(
      `\u{1F680} Servidor rodando na porta ${process.env.PORT || 3001}`
    );
  } catch (error) {
    console.error("\u274C Falha ao iniciar o servidor:", error);
    process.exit(1);
  }
};
startServer();
