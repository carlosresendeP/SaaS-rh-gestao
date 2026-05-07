# Timezone — Decisão de Arquitetura

## Regra

- **Backend / Banco de dados:** sempre UTC (padrão Prisma/PostgreSQL)
- **Frontend:** converte para o fuso do usuário na hora de exibir

---

## Por que UTC no backend?

SaaS com múltiplos usuários pode ter clientes em fusos diferentes.
Guardar UTC garante consistência — cada cliente vê no seu próprio horário.

---

## Como converter no Frontend

Instalar:
```bash
npm install dayjs
```

Configurar uma vez (ex: `src/lib/dayjs.ts`):
```ts
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import "dayjs/locale/pt-br"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale("pt-br")

export default dayjs
```

Usar nos componentes:
```ts
import dayjs from "@/lib/dayjs"

dayjs("2026-05-07T00:21:37.771Z").tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm")
// → "06/05/2026 21:21"
```

---

## Onde será usado

- Listagem de candidatos (`createdAt`)
- Listagem de vagas (`createdAt`)
- Histórico de status das candidaturas (`updatedAt`)
