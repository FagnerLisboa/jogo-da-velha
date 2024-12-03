import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicTacToeService } from '../services/tic-tac-toe.service';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss']
})
export class BotComponent implements OnInit {
  @Input() gameBoard: string[][] = [['', '', ''], ['', '', ''], ['', '', '']];
  @Input() currentPlayer: string = 'X';
  @Output() botMove = new EventEmitter<{ x: number; y: number }>();

  isThinking = false;

  constructor(
    private ticTacToeService: TicTacToeService
  ) { }

  public generateGameData(): string {
    const rows = this.gameBoard.map((row, i) =>
      row.map((cell, j) => `${i}-${j}=${cell || ''}`).join('&')
    );
    return `player=${this.currentPlayer}&${rows.join('&')}`;
  }

  ngOnInit(): void {
  }

  requestBotMove(data: { player: string; board: string[][] }): void {
    this.isThinking = true;
    setTimeout(() => {
      this.ticTacToeService.getNextMove(data).subscribe(
        (response) => {
          this.isThinking = false;
          this.botMove.emit(response);
        },
        (error) => {
          this.isThinking = false;
          console.error('Erro ao obter jogada do bot. Usando fallback:', error);
          const fallbackMove = this.fallbackMove(data.board);
          this.botMove.emit(fallbackMove);
        }
      );
    }, 500); // Simular um tempo de "pensamento"
  }
  

  private findWinningMove(board: string[][], player: string): { x: number; y: number } | null {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board[i][j]) { // Verificar apenas células vazias
          // Simular a jogada
          board[i][j] = player;

          // Verificar se esta jogada resulta em vitória
          if (this.isWinningMove(board, player)) {
            board[i][j] = ''; // Reverter a simulação
            return { x: i, y: j };
          }

          // Reverter a simulação
          board[i][j] = '';
        }
      }
    }
    return null; // Nenhuma jogada vencedora encontrada
  }

  private isWinningMove(board: string[][], player: string): boolean {
    // Verificar linhas
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
        return true;
      }
    }

    // Verificar colunas
    for (let j = 0; j < 3; j++) {
      if (board[0][j] === player && board[1][j] === player && board[2][j] === player) {
        return true;
      }
    }

    // Verificar diagonais
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
      return true;
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
      return true;
    }

    return false;
  }

  private fallbackMove(board: string[][]): { x: number; y: number } {
    // 1. Verificar se o bot pode ganhar
    const winningMove = this.findWinningMove(board, this.currentPlayer);
    if (winningMove) {
      return winningMove;
    }
  
    // 2. Verificar se o bot precisa bloquear o adversário
    const blockingMove = this.findWinningMove(board, this.currentPlayer === 'X' ? 'O' : 'X');
    if (blockingMove) {
      return blockingMove;
    }
  
    // 3. Tentar ocupar o centro
    if (!board[1][1]) {
      return { x: 1, y: 1 };
    }
  
    // 4. Tentar ocupar um canto disponível
    const corners = [
      { x: 0, y: 0 }, { x: 0, y: 2 },
      { x: 2, y: 0 }, { x: 2, y: 2 }
    ];
    for (const corner of corners) {
      if (!board[corner.x][corner.y]) {
        return corner;
      }
    }
  
    // 5. Tentar ocupar uma borda disponível
    const edges = [
      { x: 0, y: 1 }, { x: 1, y: 0 },
      { x: 1, y: 2 }, { x: 2, y: 1 }
    ];
    for (const edge of edges) {
      if (!board[edge.x][edge.y]) {
        return edge;
      }
    }
  
    // 6. Escolher qualquer célula vazia como último recurso
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j]) {
          return { x: i, y: j };
        }
      }
    }
  
    return { x: 0, y: 0 }; // Caso todas as células estejam preenchidas.
  }
}  