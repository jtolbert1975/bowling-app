import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Frame } from './frame.model';

@Injectable({
  providedIn: 'root',
})
export class ScoringService {
  roll1Pins: any = 0;
  roll2Pins: any = 0;
  roll3Pins: any = '';
  currentFrame = 0;
  roll1$ = new Subject();
  gameObj$ = new Subject();
  lastFrame$ = new Subject();
  frame?: Frame;
  games: Array<Frame> = [];
  tenthFrame: Array<Frame> = [];
  totalScore: number = 0;
  strikeFrame: Array<Frame> = [];
  isBonusRoll: boolean = false;
  tenthFrameRollCt = 0;
  spareFrame: Array<Frame> = [];

  constructor() {}

  rollCalc(rollCount: number, frameCount: number) {
    let frameCt = frameCount !== 0 ? frameCount : 1;

    if (frameCount <= 9) {
      if (rollCount === 0) {
        this.roll1Pins = this.setPins();
        this.roll1$.next(this.roll1Pins);
        if (this.roll1Pins === 'X') {
          this.createStrikeFrame(frameCt, rollCount);
        } else if (this.spareFrame.length > 0) {
          this.addSpareScore(this.roll1Pins);
        } else {
          this.totalScore += this.roll1Pins;
          this.createFrame(frameCt, rollCount);
        }
      }
      if (rollCount === 1) {
        this.roll2Pins = this.setPins();
        if (this.roll2Pins === 'X') {
          this.createStrikeFrame(frameCt, rollCount);
        } else {
          this.totalScore += this.roll2Pins;
          this.createFrame(frameCt, rollCount);
        }
      }
    } else {
      this.setTenthFrame(rollCount);
    }

    this.currentFrame = frameCt;
  }

  setPins() {
    let min = Math.ceil(0);
    let max =
      this.roll1Pins > 0 ? Math.floor(10 - this.roll1Pins) : Math.floor(10);
    let result: any = Math.floor(Math.random() * (max - min)) + min;
    result = result === 10 ? 'X' : result;
    return result;
  }

  createFrame(frame: number, rollCount: number) {
    let frameScore = 0;
    this.frame = {
      frame: frame,
      roll1: this.roll1Pins,
      roll2: this.roll2Pins,
      roll3: this.roll3Pins,
      score: this.totalScore,
    };

    if (rollCount === 1) {
      frameScore = this.roll1Pins + this.roll2Pins;
      if (frameScore === 10) {
        this.createSpare(this.frame);
      } else {
        this.games.push(this.frame);
        this.gameObj$.next(this.games);
      }
    }
  }

  setTenthFrame(rollCount: number) {
    this.tenthFrameRollCt++;
    let frame = 10;
    if (rollCount == 0) {
      this.roll1Pins = this.setPins();
      this.totalScore += this.roll1Pins;
      this.isBonusRoll = this.roll1Pins === 'X' ? true : false;
    }
    if (rollCount === 1) {
      this.roll2Pins = this.setPins();
      this.totalScore += this.roll2Pins;
      this.isBonusRoll = this.roll2Pins === 'X' ? true : false;
      this.tenthFrameRollCt =
        this.isBonusRoll === true ? 3 : this.tenthFrameRollCt;
    }

    if (rollCount === 2 && this.isBonusRoll) {
      this.roll3Pins = this.setPins();
      this.totalScore += this.roll3Pins;
      this.frame = {
        frame: frame,
        roll1: this.roll1Pins,
        roll2: this.roll2Pins,
        roll3: this.roll3Pins,
        score: this.totalScore,
      };
      this.tenthFrameRollCt =
        this.isBonusRoll === true ? 3 : this.tenthFrameRollCt;

      this.tenthFrame.push(this.frame);
      this.lastFrame$.next(this.tenthFrame);
    } else {
      this.frame = {
        frame: frame,
        roll1: this.roll1Pins,
        roll2: this.roll2Pins,
        roll3: 0,
        score: this.totalScore,
      };
      this.tenthFrame.push(this.frame);
      this.lastFrame$.next(this.tenthFrame);
      this.tenthFrameRollCt = 3;
    }
  }

  createStrikeFrame(frameCt: number, rollCount: number) {
    this.frame = {
      frame: frameCt,
      roll1: '',
      roll2: '',
      roll3: '',
      score: 0,
    };
    if (rollCount === 0) {
      this.frame = {
        frame: frameCt,
        roll1: this.roll1Pins,
        roll2: '',
        roll3: '',
        score: 0,
      };
    } else if (rollCount === 1) {
      this.frame = {
        frame: frameCt,
        roll1: this.roll1Pins,
        roll2: this.roll2Pins,
        roll3: '',
        score: 0,
      };
    } else if (rollCount === 2) {
      this.frame = {
        frame: frameCt,
        roll1: this.roll1Pins,
        roll2: this.roll2Pins,
        roll3: this.roll2Pins,
        score: 0,
      };
    }

    if (this.strikeFrame.length > 0) {
      this.addStrikeTotal();
      this.strikeFrame.push(this.frame);
      this.games.push(this.frame);
    } else {
      this.strikeFrame.push(this.frame);
      this.games.push(this.frame);
    }

    this.gameObj$.next(this.games);
  }

  addStrikeTotal() {
    let i = this.games.length - 1;
    this.games[i].score =
      this.games[i].roll1 === 'X' ? 10 + 10 : 10 + this.games[i].roll1;

    if (this.games[i - 1]) {
      this.games[i].score = this.games[i].score + this.games[i - 1].score;
    }

    this.totalScore += this.games[i].score;
  }

  createSpare(frameObj: Frame) {
    this.frame = {
      frame: frameObj.frame,
      roll1: this.roll1Pins,
      roll2: '/',
      roll3: this.roll3Pins,
      score: '',
    };
    this.spareFrame.push(this.frame);
    this.games.push(this.frame);
    this.gameObj$.next(this.games);
  }

  addSpareScore(roll1Pins: any) {
    let previousFrame = this.games.length - 1;
    let previousScore = 10 + roll1Pins;
    this.games[previousFrame].score = previousScore;
    this.spareFrame = [];
    this.gameObj$.next(this.games);
  }
}
