Chatbot no Telegram com Integração com Planilha Financeira e Google Agenda
Este projeto consiste em um chatbot no Telegram desenvolvido utilizando o NestJS e a biblioteca Telegraf. O objetivo principal do bot é fornecer uma maneira prática de acessar informações da minha planilha financeira e dos eventos agendados no Google Agenda, tudo via Telegram.

Funcionalidades
Consulta à planilha financeira: O bot é capaz de enviar informações atualizadas da planilha financeira diretamente para o usuário, proporcionando acesso rápido e eficiente aos dados financeiros.

Integração com o Google Agenda: O bot também puxa dados dos eventos programados no Google Agenda, oferecendo uma visão rápida dos compromissos futuros.

Autenticação OAuth2: Utiliza a autenticação OAuth2 para interagir com as APIs do Google de maneira segura, garantindo o acesso apenas aos dados autorizados.

Tecnologias Utilizadas
NestJS: Framework para o desenvolvimento do back-end, garantindo a estrutura e organização do código.

Telegraf: Biblioteca para a criação do bot no Telegram, facilitando a integração com a plataforma de mensagens.

Google APIs: Para integrar com o Google Agenda e acessar dados financeiros através da planilha.

OAuth2: Protocolo de autenticação utilizado para garantir a segurança no acesso às APIs do Google.

Como Funciona
O bot é iniciado através do Telegram, com a autenticação do usuário por meio do OAuth2.
O usuário pode solicitar informações sobre sua planilha financeira ou eventos agendados.
O bot responde com os dados mais recentes, retirados das fontes especificadas (planilha e Google Agenda).
O projeto utiliza integrações de APIs para garantir uma experiência fluida e interativa com os serviços de terceiros.
