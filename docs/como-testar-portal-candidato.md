# Como testar o Portal do Candidato

O portal é acessado em `/teste/[token]` no frontend. O token é gerado pelo RH na página de detalhes de uma vaga.

---

## Pré-requisitos

- Backend rodando em `http://localhost:3001`
- Frontend rodando em `http://localhost:3000`
- Conta de RH criada (use o fluxo de cadastro `/register`)

---

## Passo a passo completo

### 1. Criar uma vaga

1. Faça login como RH em `http://localhost:3000/login`
2. Vá em **Vagas → Nova Vaga**
3. Escolha "Criar Manualmente" (mais rápido para testes)
4. Preencha ao menos o **Título** e salve
5. Você será redirecionado para a página de detalhes da vaga

### 2. Adicionar um candidato

Na página de detalhes da vaga, o formulário de candidatura manual está disponível.

Campos obrigatórios:

- **Nome**
- **E-mail**

Clique em **Salvar Vaga** com o candidato preenchido.

### 3. Gerar o link de teste

1. Na seção **Candidatos** da página de detalhes, localize o candidato
2. Clique em **Gerar link de teste** ao lado do candidato
3. O botão vai mudar para **Copiar link**
4. Clique em **Copiar link** — a URL `/teste/[token]` está na área de transferência

> O link tem validade de **2 dias**. Após envio das respostas, o token é invalidado.

### 4. Acessar o portal

Cole a URL no navegador (pode ser outra aba ou modo anônimo):

```
http://localhost:3000/teste/[token-gerado]
```

Você verá a tela de boas-vindas com o nome do candidato.

---

## Fluxo dos testes

```
/teste/[token]           → Boas-vindas + aceite LGPD
/teste/[token]/disc      → Teste DISC (escolha 1 opção por questão)
/teste/[token]/eneagrama → Eneagrama (escolha 1 opção por questão)
/teste/[token]/personalidades → 16 Personalidades (escolha binária)
/teste/[token]/concluido → Tela de conclusão
```

### DISC

- Cada questão tem 4 opções (D / I / S / C)
- Selecione a opção que **mais** descreve você
- 5 questões por página

### Eneagrama

- Cada questão tem 3 opções, cada uma representando um tipo (1–9)
- Selecione a opção que mais se aplica
- 8 questões por página

### 16 Personalidades

- Cada questão tem 2 opções (escolha binária)
- Selecione a que mais representa você
- 10 questões por página
- Na última página aparece o botão **Enviar Resultados**

---

## O que acontece ao enviar

O frontend envia para `POST /api/public/tests/:token/submit`:

```json
{
  "disc":         { "q1": "D", "q2": "I", ... },
  "eneagrama":    { "en1": 9, "en2": 2, ... },
  "personalities": { "p1": "I", "p2": "T", ... }
}
```

O backend:

1. Valida o token
2. Calcula os resultados (DISC, Eneagrama, 16P)
3. Salva em `Candidate.respostasJson`
4. Avança o status da candidatura para `TESTE_PSICOMETRICO`
5. Invalida o token (deleta o `TestLink`)

Após o envio você é redirecionado para `/teste/[token]/concluido`.

---

## Verificar resultado no painel de RH

1. Volte para `http://localhost:3000`
2. Acesse a vaga → aba de candidatos
3. O candidato agora aparece com status **TESTE_PSICOMETRICO**
4. Clique em **Gerar Análise com IA** para obter o MatchReport (requer API key configurada)

---

## Problemas comuns

| Sintoma                                            | Causa provável                                                        |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| "Link inválido ou expirado" na tela de boas-vindas | Token não existe ou já foi usado                                      |
| Botão "Próxima" desabilitado                       | Nem todas as questões da página foram respondidas                     |
| Erro ao enviar (toast vermelho)                    | Backend offline ou token expirado durante o teste                     |
| Concluído sem mostrar o nome                       | Cache do TanStack Query não encontrado (recarregue a página anterior) |
