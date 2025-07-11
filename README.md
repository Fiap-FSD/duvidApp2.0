# DuvidApp2.0

Bem-vindo ao DuvidApp, uma plataforma de perguntas e respostas estilo Stack Overflow, projetada para estudantes e professores. Este projeto permite que usuários postem dúvidas, respondam a perguntas, curtam conteúdo e busquem informações relevantes.

## 🚀 Tecnologias Utilizadas

-   **Next.js 14 (App Router):** Framework React para aplicações web.
-   **React:** Biblioteca JavaScript para construção de interfaces de usuário.
-   **TypeScript:** Superset de JavaScript que adiciona tipagem estática.
-   **Tailwind CSS:** Framework CSS utilitário para estilização rápida e responsiva.
-   **shadcn/ui:** Componentes de UI reutilizáveis e acessíveis.
-   **DuvidApp API:** Backend para persistência de dados (perguntas, respostas, usuários).

## 📦 Instalação do Projeto

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

Certifique-se de ter o Node.js (versão 18 ou superior) e o npm (ou yarn/pnpm) instalados em sua máquina.

### 1. Clonar o Repositório

\`\`\`bash
git clone <URL_DO_SEU_REPOSITORIO>
cd stackoverflow-academico
\`\`\`

### 2. Instalar Dependências

Utilize seu gerenciador de pacotes preferido para instalar as dependências do projeto:

\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

### 3. Configurar Variáveis de Ambiente

O projeto se conecta à API DuvidApp. Embora a URL base da API esteja hardcoded no `services/api.ts`, em um ambiente de produção, você normalmente usaria uma variável de ambiente. Para este projeto, a URL da API é:

`https://duvidapp.onrender.com`

Não é necessário criar um arquivo `.env` para esta configuração específica, pois a URL já está definida no código.

### 4. Rodar o Servidor de Desenvolvimento

Após a instalação das dependências, você pode iniciar o servidor de desenvolvimento:

\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

O aplicativo estará disponível em `http://localhost:3000`.

## 💡 Como Usar o Aplicativo

1.  **Registro/Login:** Ao acessar a aplicação, você será direcionado para a tela de login/cadastro. Crie uma nova conta (como "Aluno" ou "Professor") ou faça login se já tiver uma.
2.  **Visualizar Perguntas:** Após o login, você verá a lista de perguntas existentes. Você pode filtrar por tags, status (resolvidas/não resolvidas) e ordenar por mais recentes, mais curtidas ou mais respostas.
3.  **Buscar Perguntas:** Utilize a barra de busca para encontrar perguntas por título ou conteúdo.
4.  **Nova Pergunta:** Clique no botão "Nova Pergunta" para abrir um modal e postar sua dúvida. Preencha o título, a descrição detalhada e adicione tags relevantes.
5.  **Detalhes da Pergunta:** Clique no título de uma pergunta na lista para ver seus detalhes, incluindo o conteúdo completo e as respostas.
6.  **Responder a Perguntas:** Na página de detalhes da pergunta, você pode enviar sua própria resposta.
7.  **Curtir/Votar:** Curta perguntas e vote em respostas para mostrar sua apreciação.
8.  **Sair:** Use o botão "Sair" no cabeçalho para encerrar sua sessão.

---

Este README fornece uma visão geral do projeto e instruções básicas para começar.
