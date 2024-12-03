import { Component, OnInit, ViewChild } from '@angular/core';
import { Game } from '../game.model';
import { BotComponent } from '../bot/bot.component';
import { TicTacToeService } from '../services/tic-tac-toe.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  game: Game = new Game();
  gameMode: 'bot' | 'player' = 'player';
  playAgainstBot: boolean = false;

  @ViewChild(BotComponent) bot!: BotComponent;
  isDraw: boolean = false
  isThinking = false;

  constructor(
    private ticTacToeService: TicTacToeService
  ) { }

  ngOnInit(): void { }

  selectMode(isBotMode: boolean): void {
    this.game.setMode(isBotMode);
    this.playAgainstBot = isBotMode;
  }

  selectGameMode(mode: 'bot' | 'player'): void {
    this.gameMode = mode;
    this.reset();
  }

  handleBotMove(move: { x: number; y: number }): void {
    if (this.game.board[move.x][move.y] || this.game.winner) {
      return;
    }

    this.game.makeMove(move.x, move.y);

    if (this.checkWinner()) {
      this.game.winner = this.game.currentPlayer;
      return;
    }

    this.game.currentPlayer = 'X'; // Voltar para o jogador
  }

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

  handleMove(rowIndex: number, colIndex: number): void {
    if (this.game.board[rowIndex][colIndex] || this.game.winner) {
      return;
    }

    this.game.board[rowIndex][colIndex] = this.game.currentPlayer;

    this.game.makeMove(rowIndex, colIndex);


    // Verificar vencedor após jogada
    if (this.checkWinner()) {
      this.game.winner = this.game.currentPlayer;
    } else if (this.game.board.flat().every(cell => cell !== '')) {
      this.isDraw = true;
      return;
    }

    // Trocar o jogador se estiver no modo dois jogadores
    if (this.gameMode === 'player') {
      this.game.currentPlayer = this.game.currentPlayer === 'X' ? 'O' : 'X';
      return;
    }

    // No modo contra o bot
    if (this.gameMode === 'bot' && this.game.currentPlayer === 'X') {
      this.game.currentPlayer = 'O'; // Passar para o bot


      // setTimeout(() => this.bot.requestBotMove(), 500);

      setTimeout(() => {
        this.bot.requestBotMove({
          player: this.game.currentPlayer,
          board: this.game.board,
        });
      }, 500);
    }
  }

  markWinningCells(cells: { x: number; y: number }[], direction: string): void {
    this.game.winningCells = cells;
    this.game.winningDirection = direction;
  }

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

  reset(): void {
    this.game.resetGame();
    this.isDraw = false;
  }
}