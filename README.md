# Jogo da Velha com Bot Inteligente

[Acesse o Jogo da Velha](https://fagnerlisboa.github.io/jogo-da-velha/)


Este projeto é uma implementação de um **Jogo da Velha (Tic-Tac-Toe)**, onde você pode desafiar um bot inteligente que utiliza estratégias bem definidas para decidir suas jogadas. Simples, intuitivo e divertido!

## 🛠️ Tecnologias Utilizadas

- **Angular**: Para construção da interface.
- **TypeScript**: Linguagem de desenvolvimento.
- **SCSS**: Para estilização e design responsivo.
- **RxJS**: Gerenciamento de assincronismo no Angular.

🎮 **Regras do Jogo**
O tabuleiro é uma grade 3x3.
Dois jogadores alternam turnos para marcar um espaço vazio.
O objetivo é alinhar 3 símbolos (horizontal, vertical ou diagonal).
Se nenhum jogador vencer e não houver mais espaços, o jogo termina empatado.
🤖 Estratégias do Bot
O bot foi desenvolvido para seguir estas etapas lógicas:

Priorizar vitória: O bot tentará vencer sempre que possível.
Bloquear o adversário: Ele identificará e bloqueará jogadas que levariam o jogador a vencer.
Escolher posições estratégicas: O bot dá preferência ao centro, seguido por cantos e bordas.
Movimento final: Caso não haja opções estratégicas, ele seleciona o próximo espaço vazio.
Nota: O algoritmo Minimax foi deliberadamente omitido para simplificar a lógica do bot, tornando o jogo mais acessível e divertido.

📈 **Melhorias Futuras**
Adicionar níveis de dificuldade.
Incluir animações e efeitos visuais mais sofisticados.
Disponibilizar suporte a dispositivos móveis (design responsivo).
Modo multiplayer online.

![Tela do Jogo da Velha](src/assets/Tic-Tac-Toe2.png.png)

[![Tela do Jogo da Velha](assets/Tic-Tac-Toe2.png.png)](https://fagnerlisboa.github.io/jogo-da-velha/)


