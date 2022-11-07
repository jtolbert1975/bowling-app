import { Component, OnInit } from '@angular/core';
import { ScoringService } from '../scoring.service';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.scss'],
})
export class ScoreCardComponent implements OnInit {
  gameGrp?: any = [];
  showFrame10: boolean = false;
  frame10?: any = [];

  constructor(public scoring: ScoringService) {}

  ngOnInit(): void {
    this.scoring.gameObj$.subscribe((data) => {
      this.gameGrp = data;
    });

    this.scoring.lastFrame$.subscribe((data) => {
      this.frame10 = data;
      this.showFrame10 = this.frame10.length > 0 ? true : false;
    });
  }
}
