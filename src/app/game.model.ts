export class Game {
    currentPlayer: string = 'X';
    board: string[][] = [['', '', ''], ['', '', ''], ['', '', '']];
    winner: string | null = null;
    winningCells: { x: number; y: number }[] = [];
    winningDirection: string = '';
    isAgainstBot: boolean = false; // Define o modo do jogo
    score: { player: number; bot: number } = { player: 0, bot: 0 }; // Placar
  
    // Realiza um movimento
    makeMove(x: number, y: number): void {
      if (this.board[x][y] === '' && !this.winner) {
        this.board[x][y] = this.currentPlayer;
        if (this.checkWinner()) {
          this.winner = this.currentPlayer;
          this.updateScore(this.currentPlayer);
        } else {
          this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
      }
    }
  
    // Verifica se há vencedor
    checkWinner(): boolean {
      const winPatterns = [
        // Linhas
        [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
        [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
        [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
        // Colunas
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
        [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
        // Diagonais
        [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
        [{ x: 0, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 0 }],
      ];
  
      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
          this.board[a.x][a.y] === this.currentPlayer &&
          this.board[b.x][b.y] === this.currentPlayer &&
          this.board[c.x][c.y] === this.currentPlayer
        ) {
          this.winningCells = [a, b, c];
          return true;
        }
      }
  
      return false;
    }
  
    // Atualiza o placar
    updateScore(player: string): void {
      if (player === 'X') {
        this.score.player++;
      } else {
        this.score.bot++;
      }
    }
  
    // Reinicia o jogo
    resetGame(): void {
      this.board = [['', '', ''], ['', '', ''], ['', '', '']];
      this.currentPlayer = 'X';
      this.winner = null;
      this.winningCells = [];
      this.winningDirection = '';
    }
  }
  