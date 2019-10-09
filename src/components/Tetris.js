import React, { useState } from 'react';
import { createStage, checkCollision } from '../gameHelpers';


// Styled Components
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

// Custom Hooks
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus } from '../hooks/useGameStatus';

// Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevels] = useGameStatus(rowsCleared);

    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0})) {
            updatePlayerPos({ x: dir, y: 0});
        }
    }

    const startGame = () => {
        // Reset everything
        setStage(createStage());
        setDropTime(1000); // 1 s
        // !!! add levels / difficulty
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevels(0);
    }

    const drop = () => {
        // increase level when player has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevels(prev => prev + 1);
            // increase speed of drop
            setDropTime(1000 / (level + 1) + 200);
        }
        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            // if we collide, we need to set collided to true
            // tetromino should be merged to the stage because it is at the bottom

            if (player.pos.y < 1) {
                // Game Over
                // colliding at top of screen
                console.log("GAME OVER");
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true});
        }
    }

    const keyUp = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 40) {
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    }

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    }

    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                // left arrow
                movePlayer(-1); // left = -1
            } else if (keyCode === 39) {
                // move player to right
                movePlayer(1);
            } else if (keyCode === 40) {
                // down arrow
                dropPlayer();
            } else if (keyCode === 38) {
                // up arrow
                // rotating clockwise (!!! could add key for counter-clockwise)
                playerRotate(stage, 1);
            } 

        }
    }

    useInterval(() => {
        drop(); // callback
    }, dropTime) // delay


    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
            <StyledTetris>
            <Stage stage={stage} />
            <aside>
                {gameOver ? (
                    <Display gameOver={gameOver} text="Game Over" />
                ) : (
                <div>
                    <Display text={`Score: ${score}`}/>
                    <Display text={`Rows: ${rows}`} />
                    <Display text={`Level: ${level}`} />
                </div>
                )}
                <StartButton callback={startGame} />
            </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
};

export default Tetris;