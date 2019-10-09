export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

export const createStage = () => 
    Array.from(Array(STAGE_HEIGHT), () => 
        new Array(STAGE_WIDTH).fill([0, 'clear'])
    )

export const checkCollision = (player, stage, { x: moveX, y: moveY}) => {
    // looping through tetromino
    for (let y = 0; y < player.tetromino.length; y++) {
        for (let x = 0; x < player.tetromino[y].length; x++) {
            // check that we are not on an empty cell and on a tetromino
            if (player.tetromino[y][x] !== 0) {
                // check movement is inside of game area's height (stage y)
                // check tetromino is not moving outside of width
                // check that cell we are moving to is not set to clear (if set to clear, no collision)
                if (!stage[y + player.pos.y + moveY] || 
                    !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
                    stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear')
                    {
                    return true;
                }
            }

        }
    }
}