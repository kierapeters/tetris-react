import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage());
    const [rowsCleared, setRowsCleared] = useState(0);

    useEffect(() => {
        setRowsCleared(0);

        const sweepRows = newStage => 
            newStage.reduce((ack, row) => {
                // check if row contains only merged cells
                // find index returns -1 if it doesn't find match
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowsCleared(prev => prev + 1);
                    // unshift = add new value to array at beginning
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                // else just return regular row
                ack.push(row);
                return ack;
            }, [])


        const updateStage = prevStage => {
            // First flush the stage (clear from previous render)
            const newStage = prevStage.map(row => 
                // multidimensional array (could also do for loop)
                row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell)),
            );

            // then draw the tetronimo (in player state)
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`,
                        ];
                    }
                });
            });
            // check if we collided
            if (player.collided) {
                resetPlayer();
                return sweepRows(newStage);
            }

            return newStage;

        };

        setStage(prev => updateStage(prev));
    }, [player, resetPlayer]);

    return [stage, setStage, rowsCleared];
};