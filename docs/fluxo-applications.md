# Fluxo para testar Applications

Para `GET /api/applications/company` retornar dados, siga esta ordem:

---

## 1. Registrar e fazer login

**POST** `/api/register` → cria empresa + usuário
**POST** `/api/login` → copie o `token` da resposta

---

## 2. Criar uma vaga

**POST** `/api/jobs` — requer Bearer token
```json
{
  "titulo": "Desenvolvedor Full Stack",
  "descricao": "Descrição da vaga",
  "requisitos": "Node.js, React",
  "salaryMin": 5000,
  "salaryMax": 8000,
  "status": "ABERTA"
}
```
> Copie o `id` da vaga retornada. A vaga **precisa estar com status `ABERTA`**.

---

## 3. Candidato se inscrever

**POST** `/api/applications/apply` — sem token (rota pública)
```json
{
  "jobId": "<id da vaga>",
  "nome": "João Candidato",
  "email": "joao@email.com",
  "telefone": "11999999999",
  "curriculoUrl": "https://linkedin.com/in/joao"
}
```

---

## 4. Verificar candidaturas

**GET** `/api/applications/company` — requer Bearer token

Agora retorna a lista com os candidatos inscritos.
