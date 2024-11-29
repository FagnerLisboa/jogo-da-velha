import { Component, OnInit } from '@angular/core';
import { Game } from '../game.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  game: Game = new Game();

  constructor() {}

  ngOnInit(): void {}

  getCellClasses(rowIndex: number, colIndex: number): { [key: string]: boolean } {
    const isWinning = this.isWinningCell(rowIndex, colIndex);
    const classes: { [key: string]: boolean } = {
      'winning-cell': isWinning,
      [this.game.winningDirection]: isWinning
    };
  
    if (isWinning) {
      classes[this.game.winningDirection] = true; // Adiciona a direção dinamicamente
    }
  
    return classes;
  }

  // Método para lidar com movimentos no tabuleiro
  handleMove(rowIndex: number, colIndex: number): void {
    // Ignorar se a célula já foi preenchida ou se o jogo acabou
    if (this.game.board[rowIndex][colIndex] || this.game.winner) {
      return;
    }

    // Preencher a célula com o símbolo do jogador atual
    this.game.board[rowIndex][colIndex] = this.game.currentPlayer;

    // Verificar se há um vencedor
    if (this.checkWinner()) {
      this.game.winner = this.game.currentPlayer;
    } else {
      // Trocar para o próximo jogador
      this.game.currentPlayer = this.game.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  // Método para destacar as células vencedoras e a direção
  markWinningCells(cells: { x: number; y: number }[], direction: string): void {
    this.game.winningCells = cells;
    this.game.winningDirection = direction; // Adicionar a direção
  }

  // Método para verificar o vencedor
  checkWinner(): boolean {
    const board = this.game.board;

    // Verificar linhas
    for (let row = 0; row < 3; row++) {
      if (board[row][0] && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        this.markWinningCells(
          [{ x: row, y: 0 }, { x: row, y: 1 }, { x: row, y: 2 }],
          'horizontal'
        );
        return true;
      }
    }

    // Verificar colunas
    for (let col = 0; col < 3; col++) {
      if (board[0][col] && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        this.markWinningCells(
          [{ x: 0, y: col }, { x: 1, y: col }, { x: 2, y: col }],
          'vertical'
        );
        return true;
      }
    }

    // Verificar diagonal principal
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      this.markWinningCells(
        [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
        'diagonal-left'
      );
      return true;
    }

    // Verificar diagonal inversa
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      this.markWinningCells(
        [{ x: 0, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 0 }],
        'diagonal-right'
      );
      return true;
    }

    return false;
  }

  // Método para verificar se uma célula é parte da combinação vencedora
  isWinningCell(x: number, y: number): boolean {
    return this.game.winningCells.some(cell => cell.x === x && cell.y === y);
  }

  // Método para reiniciar o jogo
  reset(): void {
    this.game.resetGame();
  }
}
