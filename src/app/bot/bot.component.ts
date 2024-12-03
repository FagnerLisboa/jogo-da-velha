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

  constructor(private ticTacToeService: TicTacToeService) {}

  ngOnInit(): void {}

  requestBotMove(data: { player: string; board: string[][] }): void {
    this.isThinking = true;

    // Capturar estado atual para evitar conflitos durante jogadas assíncronas
    const boardSnapshot = JSON.parse(JSON.stringify(data.board));

    setTimeout(() => {
      this.ticTacToeService.getNextMove(data).subscribe(
        (response) => {
          this.isThinking = false;
          // Garantir que a jogada emitida corresponde ao estado mais recente
          if (this.isBoardUnchanged(boardSnapshot, this.gameBoard)) {
            this.botMove.emit(response);
          }
        },
        (error) => {
          this.isThinking = false;
          console.error('Erro ao obter jogada do bot. Usando fallback:', error);
          const fallbackMove = this.fallbackMove(this.gameBoard);
          this.botMove.emit(fallbackMove);
        }
      );
    }, 500); // Simular um tempo de "pensamento"
  }


  private findWinningMove(board: string[][], player: string): { x: number; y: number } | null {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!board[i][j]) {
          board[i][j] = player; // Simular jogada
          if (this.isWinningMove(board, player)) {
            board[i][j] = ''; // Reverter simulação
            return { x: i, y: j };
          }
          board[i][j] = ''; // Reverter simulação
        }
      }
    }
    return null;
  }

  private isWinningMove(board: string[][], player: string): boolean {
    // Verificar linhas, colunas e diagonais
    return (
      [0, 1, 2].some((i) =>
        // Verificar linhas e colunas
        (board[i][0] === player && board[i][1] === player && board[i][2] === player) ||
        (board[0][i] === player && board[1][i] === player && board[2][i] === player)
      ) ||
      // Verificar diagonais
      (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
      (board[0][2] === player && board[1][1] === player && board[2][0] === player)
    );
  }

  private fallbackMove(board: string[][]): { x: number; y: number } {
    const currentPlayer = this.currentPlayer;
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
  
    // 1. Verificar vitória ou bloqueio
    const move =
      this.findWinningMove(board, currentPlayer) ||
      this.findWinningMove(board, opponent) ||
  
      // 2. Priorizar centro
      (board[0][1] === '' ? { x: 0, y: 1 } : null) ||
      (board[1][1] === '' ? { x: 1, y: 1 } : null) ||
      (board[0][2] === '' ? { x: 0, y: 2 } : null) ||
  
      // 3. Priorizar cantos
      this.getFirstAvailableCell(board, [
        { x: 0, y: 0 }, { x: 0, y: 2 },
        { x: 2, y: 0 }, { x: 2, y: 2 }
      ]) ||
  
      // 4. Priorizar bordas
      this.getFirstAvailableCell(board, [
        { x: 0, y: 1 }, { x: 1, y: 0 },
        { x: 1, y: 2 }, { x: 2, y: 1 }
      ]);
  
    // 5. Último recurso
    return move || this.getFirstAvailableCell(board, [])!;
  }
  
  private checkWinner(board: string[][]): string | null {
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return board[i][0];
      if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return board[0][i];
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return board[0][0];
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return board[0][2];

    if (board.flat().every(cell => cell)) return 'tie';
    return null;
  }
  
  private getFirstAvailableCell(
    board: string[][],
    cells: { x: number; y: number }[] = []
  ): { x: number; y: number } | null {
    if (cells.length > 0) {
      for (const cell of cells) {
        if (!board[cell.x][cell.y]) return cell;
      }
    } else {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!board[i][j]) return { x: i, y: j };
        }
      }
    }
    return null;
  }

  private isBoardUnchanged(board1: string[][], board2: string[][]): boolean {
    return JSON.stringify(board1) === JSON.stringify(board2);
  }
}
