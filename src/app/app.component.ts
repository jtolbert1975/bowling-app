import { Component, OnInit } from '@angular/core';
import { ScoringService } from './scoring.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'bowling-app';
  buttonPath: string = '';
  buttonGroup = {
    start: '../assets/images/startButton.png',
    roll: '../assets/images/rollButton.png',
  };

  frameCount: any = [];
  rollCount = 0;
  showLanding: boolean = true;
  showStart: boolean = false;
  showButton: boolean = true;
  tenthFrameCount = 0;
  constructor(public scoring: ScoringService) {}

  ngOnInit() {
    this.buttonPath = this.buttonGroup.start;
  }

  onStart() {
    if (this.buttonPath == this.buttonGroup.start) {
      this.buttonPath = this.buttonGroup.roll;
      this.showLanding = false;
      this.showStart = true;
    } else {
      this.rollBall();
    }
  }

  rollBall(): any {
    let count = 0;

    if (this.scoring.strikeFrame.length > 0) {
      this.rollCount = 0;
      count = this.frameCount.length + 1;
    }

    if (this.frameCount.length <= 9) {
      if (this.rollCount === 0) {
        this.scoring.rollCalc(this.rollCount, count);
        this.rollCount += 1;
        if (this.scoring.strikeFrame.length > 0) {
          this.frameCount.push(this.frameCount.length + 1);
        }
        count = this.frameCount.length;

        //
      } else if (this.rollCount === 1) {
        this.frameCount.push(this.frameCount.length + 1);
        count = this.frameCount.length;
        this.scoring.rollCalc(this.rollCount, count);
        this.rollCount = 0;
      }
    } else {
      if (this.scoring.tenthFrameRollCt <= 2) {
        this.scoring.setTenthFrame(this.tenthFrameCount);
        this.rollCount += this.rollCount;
        this.tenthFrameCount++;
      } else {
        this.showButton = false;
      }
    }
  }

  onReset() {
    this.scoring.games = [];
    this.scoring.gameObj$.next(this.scoring.games);
    this.scoring.tenthFrame = [];
    this.scoring.lastFrame$.next(this.scoring.tenthFrame);
    this.showButton = true;
    this.showLanding = true;
    this.showStart = false;
    this.buttonPath = '';
    this.buttonPath = this.buttonGroup.start;
  }
}
