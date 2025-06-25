import React, { useRef, useState, useEffect } from 'react';
import './TicTacToe.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';

let data = ["", "", "", "", "", "", "", "", ""];

export const TicTacToe = () => {

  let [count, setCount] = useState(0);
  let [lock, setLock] = useState(false);
  let titleRef = useRef(null);
  const [board, setBoard] = useState([...data]);

  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  useEffect(() => {
    if (count % 2 !== 0 && !lock) {
      let best = bestMove([...board]);
      if (best !== -1) {
        let tempBoard = [...board];
        tempBoard[best] = "o";
        setBoard(tempBoard);
        data[best] = "o";
        document.querySelectorAll('.boxs')[best].innerHTML = `<img src=${circle_icon} />`;
        setCount(prev => prev + 1);
        checkWin(tempBoard);
      }
    }
  }, [count, lock]);

  const toggle = (e, num) => {
    if (lock || data[num] !== "") return;

    if (count % 2 === 0) {
      e.target.innerHTML = `<img src=${cross_icon} />`;
      data[num] = "x";
      let tempBoard = [...board];
      tempBoard[num] = "x";
      setBoard(tempBoard);
      setCount(count + 1);
      checkWin(tempBoard);
    }
  };

  const checkWin = (b) => {
    for (let pattern of winCombos) {
      const [a, b1, c] = pattern;
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        won(b[a]);
        return;
      }
    }

    if (!b.includes("")) {
      setLock(true);
      titleRef.current.innerHTML = `It's a Draw!`;
    }
  };

  const won = (winner) => {
    setLock(true);
    if (winner === 'x') {
      titleRef.current.innerHTML = `Congratulations: <img src=${cross_icon} />`;
    } else {
      titleRef.current.innerHTML = `AI Wins: <img src=${circle_icon} />`;
    }
  };

  const reset = () => {
    setLock(false);
    data = ["", "", "", "", "", "", "", "", ""];
    setBoard([...data]);
    setCount(0);
    titleRef.current.innerHTML = 'Tic Tac Toe Game In <span>React</span>';
    const boxes = document.querySelectorAll('.boxs');
    boxes.forEach((box) => box.innerHTML = "");
  };

  // --- Minimax Logic ---
  const bestMove = (b) => {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
      if (b[i] === "") {
        b[i] = "o";
        let score = minimax(b, 0, false);
        b[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (b, depth, isMax) => {
    const result = evaluate(b);
    if (result !== null) return result;

    if (isMax) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === "") {
          b[i] = "o";
          let score = minimax(b, depth + 1, false);
          b[i] = "";
          maxEval = Math.max(score, maxEval);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === "") {
          b[i] = "x";
          let score = minimax(b, depth + 1, true);
          b[i] = "";
          minEval = Math.min(score, minEval);
        }
      }
      return minEval;
    }
  };

  const evaluate = (b) => {
    for (let pattern of winCombos) {
      const [a, b1, c] = pattern;
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        if (b[a] === "o") return 10;
        if (b[a] === "x") return -10;
      }
    }
    if (!b.includes("")) return 0;
    return null;
  };
  

  return (
    <div className='container'>
      <h1 className='title' ref={titleRef}>Tic Tac Toe Game In <span>React</span></h1>
      <div className="board">
        <div className='row1'>
          <div className="boxs" onClick={(e) => toggle(e, 0)}></div>
          <div className="boxs" onClick={(e) => toggle(e, 1)}></div>
          <div className="boxs" onClick={(e) => toggle(e, 2)}></div>
        </div>
        <div className='row2'>
          <div className="boxs" onClick={(e) => toggle(e, 3)}></div>
          <div className="boxs" onClick={(e) => toggle(e, 4)}></div>
          <div className="boxs" onClick={(e) => toggle(e, 5)}></div>
        </div>
        <div className='row3'>
          <div className="boxs" onClick={(e) => toggle(e, 6)}></div>
          <div className="boxs" onClick={(e) => toggle(e, 7)}></div>
          <div className="boxs" onClick={(e) => toggle(e, 8)}></div>
        </div>
      </div>
      <button className='reset' onClick={reset}>Reset</button>
    </div>
  );
};
