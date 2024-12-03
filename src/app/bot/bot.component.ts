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

  // requestBotMove(): void {
  //   if (!this.gameBoard || this.gameBoard.length === 0) {
  //     console.error('Tabuleiro não inicializado!');
  //     return;
  //   }

  //   const availableMoves: { x: number; y: number }[] = [];

  //   // Identificar jogadas disponíveis
  //   for (let i = 0; i < 3; i++) {
  //     for (let j = 0; j < 3; j++) {
  //       if (this.gameBoard[i][j] === '') {
  //         availableMoves.push({ x: i, y: j });
  //       }
  //     }
  //   }

  //   if (availableMoves.length > 0) {
  //     const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  //     console.log('Bot escolheu:', move); // Log para depuração
  //     this.botMove.emit(move);
  //   } else {
  //     console.warn('Nenhuma jogada disponível para o bot.');
  //   }
  // }


  requestBotMove(data: { player: string; board: string[][] }): void {
    this.ticTacToeService.getNextMove(data).subscribe(
      (response: { x: number; y: number }) => {
        const { x, y } = response;
        this.botMove.emit({ x, y }); // Emitir a jogada recebida da API
      },
      (error: any) => {
        console.error('Erro ao obter jogada do bot. Usando fallback:', error);
        const fallbackMove = this.fallbackMove(data.board);
        this.botMove.emit(fallbackMove); // Emitir a jogada calculada localmente
      }
    );
  }
  

  private fallbackMove(board: string[][]): { x: number; y: number } {
    // Lógica simples para escolher a primeira célula vazia.
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
