import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* A tic-tac-toe game that:
1. Lets you play tic-tac-toe,
2. Indicates when a player has won the game,
3. Stores a game’s history as a game progresses,
4. Allows players to review a game’s history and see previous versions of a game’s board. 

How to improve upon current design: 
1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw. */



// Example Of Making An Interactive Component
// Square is a react component class that renders a single "square" button element
// The Square components are "controlled components"
function Square(props) {
    return ( // onClick={function() { console.log('click'); }}>
        <button 
        className="square" 
        onClick={props.onClick}>
            {props.value}
        </button> 
    );
    }


// Example of 'Passing A Prop' From a Parent Component to a Child Component
// Board is a react component class that renders a 3 x 3 board
// Board has full control over the Square components
class Board extends React.Component {
    renderSquare(i) {
        return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}/> // 'value'  and 'onClick' are props
        );
    }

render() {
    return (
        <div>
            <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div>
            <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>
            <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}

// Game is a react component class that renders a board with placeholder values
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        // ignoring a click if someone has won the game or if a Square is already filled
        if (calculateWinner(squares) || squares[i])
            return;
        
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat ([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
        /* As we iterate through history array, step variable refers to the current history element value, and move refers to the current history element index. We are only interested in move here, hence step is not getting assigned to anything. */
            const desc = move ?
            'Go to move #' + move :
            'Go to game start';
            return (
            /*  Keys tell React about the identity of each component which allows React to maintain state between re-renders. */
                <li key={move}>
                    <button onClick ={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });


        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }


        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>   
                </div>
            </div>
        );
    }
}

// ================RENDER THE DOCUMENT ========================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

// Given an array of 9 squares, this function will check for a winner and return 'X', 'O', or null as appropriate.
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6], 
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        } 
    }

    return null;
}