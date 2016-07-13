import { Exception, isWinner, minimax, score, findMoves } from '../../src/utility/functions';
import { expect } from 'chai';

describe('functions', () => {
  describe('isWinner', () => {
    it('throws an error if the input is not an array of arrays', () => {
      const game1 = 1;
      expect(() => isWinner(game1)).to.throw(new Exception('The input game must be a square array of arrays'));

      const game2 = ['', '', ''];
      expect(() => isWinner(game2)).to.throw(new Exception('The input game must be a square array of arrays'));
    });

    it('throws an error if the input is not square', () => {
      const game1 = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];
      expect(() => isWinner(game1)).to.throw(new Exception('The input game was not a square board'));

      const game2 = [
        ['', '', ''],
        ['', '', ''],
      ];
      expect(() => isWinner(game2)).to.throw(new Exception('The input game was not a square board'));
    });


    it('Returns false if there is no winner', () => {
      const game1 = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];
      expect(isWinner(game1)).to.equal(false);

      const game2 = [
        ['X', 'X', ''],
        ['', 'X', ''],
        ['', '', ''],
      ];
      expect(isWinner(game2)).to.equal(false);

      const game3 = [
        ['X', 'X', ''],
        ['X', 'X', ''],
        ['', '', ''],
      ];
      expect(isWinner(game3)).to.equal(false);

      const game4 = [
        ['X', 'O', 'X'],
        ['O', '', 'O'],
        ['X', 'O', 'X'],
      ];
      expect(isWinner(game4)).to.equal(false);
    });

    it('Returns the winning player if the game is won', () => {
      const game1 = [
        ['X', 'X', 'X'],
        ['', '', ''],
        ['', '', ''],
      ];
      expect(isWinner(game1)).to.equal('X');

      const game2 = [
        ['X', '', ''],
        ['', 'X', ''],
        ['', '', 'X'],
      ];
      expect(isWinner(game2)).to.equal('X');

      const game3 = [
        ['', 'X', ''],
        ['', 'X', ''],
        ['', 'X', ''],
      ];
      expect(isWinner(game3)).to.equal('X');

      const game4 = [
        ['', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', ''],
      ];
      expect(isWinner(game4)).to.equal('X');
    });

    it('supports games of any size', () => {
      // build games with first row filled out as X's
      for (let size = 2; size < 10; size++) {
        const game = [];
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
          const row = [];
          for (let colIndex = 0; colIndex < size; colIndex++) {
            if (rowIndex === 0) {
              row.push('X');
            } else {
              row.push('');
            }
          }
          game.push(row);
        }
        expect(isWinner(game)).to.equal('X');
      }
    });
  });


  describe('minimax', () => {
    it('returns the correct weighted value', () => {
      const game1 = [
        ['X', 'O', ''],
        ['X', 'X', 'O'],
        ['', '', 'O'],
      ];
      expect(minimax(game1, 'X', 'X', 0)).to.equal(9);

      const game2 = [
        ['', 'O', ''],
        ['', '', ''],
        ['X', '', ''],
      ];
      expect(minimax(game2, 'X', 'X', 0)).to.equal(5);

      const game3 = [
        ['X', 'X', 'O'],
        ['', 'O', ''],
        ['', '', ''],
      ];
      expect(minimax(game3, 'X', 'X', 0)).to.equal(0);
    });
  });

  describe('score', () => {
    it('returns 0 when there is no winner', () => {
      const game1 = [
        ['X', 'O', ''],
        ['X', 'X', 'O'],
        ['', '', 'O'],
      ];
      expect(score(game1, 0, 'X')).to.equal(0);
    });

    it('returns a positive number when computer wins', () => {
      const game1 = [
        ['X', 'O', ''],
        ['X', 'X', 'O'],
        ['X', '', 'O'],
      ];
      expect(score(game1, 0, 'X')).to.be.above(0);
    });

    it('returns a negative number when the player wins', () => {
      const game1 = [
        ['X', 'O', 'O'],
        ['X', 'X', 'O'],
        ['', '', 'O'],
      ];
      expect(score(game1, 0, 'X')).to.be.below(0);
    });
  });

  describe('findMoves', () => {
    it('returns the correct number of open spaces', () => {
      const game1 = [
        ['O', 'O', 'X'],
        ['', 'X', ''],
        ['', '', ''],
      ];
      expect(findMoves(game1).length).to.equal(5);

      const game2 = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ];
      expect(findMoves(game2).length).to.equal(9);
    });

    it('correctly identifies the open space by coordinates', () => {
      const game1 = [
        ['X', 'O', 'X'],
        ['X', 'X', 'O'],
        ['O', '', 'O'],
      ];
      expect(findMoves(game1).length).to.equal(1);
      expect(findMoves(game1)[0][0]).to.equal(2);
      expect(findMoves(game1)[0][1]).to.equal(1);      

      const game2 = [
        ['O', 'O', 'X'],
        ['', 'X', ''],
        ['', '', ''],
      ];
      expect(JSON.stringify(findMoves(game2))).to.equal('[[1,0],[1,2],[2,0],[2,1],[2,2]]');
    });
  });
});
