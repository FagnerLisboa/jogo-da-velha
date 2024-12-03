import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicTacToeService {
  private apiUrl = `https://${environment.apiHost}/move`;

  constructor(private http: HttpClient) {}

  // Envia a solicitação para obter a próxima jogada
  getNextMove(data: { player: string; board: string[][] }): Observable<any> {
    // Formata os dados no estilo 'x-www-form-urlencoded'
    const params = new HttpParams()
      .set('player', data.player)
      .appendAll(this.formatBoard(data.board));

    const headers = new HttpHeaders({
      'x-rapidapi-key': environment.apiKey,
      'x-rapidapi-host': environment.apiHost,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(this.apiUrl, params.toString(), { headers });
  }

  // Transforma o tabuleiro em um formato apropriado para a API
  private formatBoard(board: string[][]): { [key: string]: string } {
    const formatted: { [key: string]: string } = {};

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          formatted[`${rowIndex}-${colIndex}`] = cell;
        }
      });
    });

    return formatted;
  }
}
