🧑‍💻 Chatbot no Telegram com Integração com Planilha Financeira e Google Agenda
Este projeto consiste em um chatbot no Telegram desenvolvido utilizando o NestJS e a biblioteca Telegraf. O objetivo principal do bot é fornecer uma maneira prática de acessar informações da minha planilha financeira e dos eventos agendados no Google Agenda, tudo via Telegram.

⚙️ Funcionalidades:

💰 Consulta à planilha financeira: O bot é capaz de enviar informações atualizadas da planilha financeira diretamente para o usuário, proporcionando acesso rápido e eficiente aos dados financeiros.

📅 Integração com o Google Agenda: O bot também puxa dados dos eventos programados no Google Agenda, oferecendo uma visão rápida dos compromissos futuros.

🔒 Autenticação OAuth2: Utiliza a autenticação OAuth2 para interagir com as APIs do Google de maneira segura, garantindo o acesso apenas aos dados autorizados.

🛠 Tecnologias Utilizadas:

NestJS 🚀: Framework para o desenvolvimento do back-end, garantindo a estrutura e organização do código.

Telegraf 🤖: Biblioteca para a criação do bot no Telegram, facilitando a integração com a plataforma de mensagens.

Google APIs 🌐: Para integrar com o Google Agenda e acessar dados financeiros através da planilha.

OAuth2 🔒: Protocolo de autenticação utilizado para garantir a segurança no acesso às APIs do Google.


🚀 Como Funciona
O bot é iniciado através do Telegram, com a autenticação do usuário por meio do OAuth2.
O usuário pode solicitar informações sobre sua planilha financeira ou eventos agendados.
O bot responde com os dados mais recentes, retirados das fontes especificadas (planilha e Google Agenda).
O projeto utiliza integrações de APIs para garantir uma experiência fluida e interativa com os serviços de terceiros.


# Como Baixar e Rodar a Aplicação

Siga os passos abaixo para clonar e rodar a aplicação NestJS localmente.

## 1. Clone o Repositório

Clone o repositório para a sua máquina local:

```bash
$ git clone https://github.com/Mayconyrp/Google_Assistente.git
```
## 2. Acesse o diretório
```bash
$ cd Google_Assistente
```
## 3. Instale as depedências
```bash
$ npm install
```
## 4. Configuração do Ambiente

Para rodar a aplicação corretamente, você precisará configurar as variáveis de ambiente no arquivo `.env` localizado na raiz do projeto. As credenciais necessárias dependem dos serviços que você está integrando (como Google APIs, OAuth2 e o bot do Telegram). Abaixo estão as variáveis principais que você deve configurar:

**Google API**: 
   - Você precisará de um **token de autenticação OAuth2** para acessar as APIs do Google (por exemplo, Google Calendar, Google Sheets, etc.). Para obter essas credenciais, siga as instruções da [documentação do Google APIs](https://developers.google.com/identity/protocols/oauth2).
   
**Bot do Telegram (BotFather)**:
   - Crie um bot no Telegram utilizando o [BotFather](https://core.telegram.org/bots#botfather) e obtenha o **Token do Bot**. Esse token será necessário para autenticar seu bot com a plataforma do Telegram.

**Telegraf**:
   - A biblioteca **Telegraf** é utilizada para interagir com a API do Telegram no seu bot. Certifique-se de adicionar o token do bot no arquivo `.env` para a configuração correta.

## 5. 
```bash
$ npm run start
```
