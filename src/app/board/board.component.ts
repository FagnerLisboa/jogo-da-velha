import { Component, OnInit } from '@angular/core';
import { Game } from '../game.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  game: Game = new Game();

  constructor() {}

  ngOnInit(): void {}

  // Lida com movimentos no tabuleiro
  handleMove(rowIndex: number, colIndex: number): void {
    if (this.game.board[rowIndex][colIndex] || this.game.winner) return;

    this.game.makeMove(rowIndex, colIndex);

    if (this.game.isAgainstBot && !this.game.winner && this.game.currentPlayer === 'O') {
      setTimeout(() => this.botMove(), 500); // Movimento do bot com pequeno atraso
    }
  }

  // Movimento do bot
  botMove(): void {
    const availableCells: { x: number; y: number }[] = [];
    this.game.board.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (!cell) availableCells.push({ x, y });
      });
    });

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const choice = availableCells[randomIndex];

    if (choice) {
      this.game.makeMove(choice.x, choice.y);
    }
  }

  // Verifica se uma célula é vencedora
  isWinningCell(x: number, y: number): boolean {
    return this.game.winningCells.some((cell) => cell.x === x && cell.y === y);
  }

  // Reinicia o jogo
  reset(isAgainstBot: boolean = false): void {
    this.game.resetGame();
    this.game.isAgainstBot = isAgainstBot;
  }
}
