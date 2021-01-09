"use strict";
(function() {
    const GAME_GRID_HEIGHT = 14;
    const GAME_GRID_WIDTH = 18;
    const BOMB_AMOUNT = 40;
    const ROOT_ELEMENT = document.getElementById("app");
    const BOMB_TYPE = 'BOMB'
    const NUMBER_TYPE = 'NUMBER'
    const EMPTY_TYPE = 'EMPTY'

    function createGameGridElements(gridData) {
        const rowGridElements = [];

        for (let i = 0; i < gridData.length; i++) {
            let rowElememnt = document.createElement("div");
            rowElememnt.className = "grid-row";
            for (let j = 0; j < gridData[i].length; j++) {
                let cell = document.createElement("div");
                if (gridData[i][j].type === BOMB_TYPE) {
                    cell.innerText = "*";
                }
                if (gridData[i][j].type === NUMBER_TYPE) {
                    cell.innerText = gridData[i][j].number;
                }
                cell.className = "grid-item";
                rowElememnt.appendChild(cell);
            }
            rowGridElements.push(rowElememnt);
        }

        return rowGridElements;
    };

    function generateBombPositions(maxX, maxY, size) {
        bombPositions = [];

        return Array.from((new Array(size))).map(() => ({
            x: Math.floor(Math.random() * Math.floor(maxX)),
            y: Math.floor(Math.random() * Math.floor(maxY)),
        }));
    }

    function countBombsAround(x, y, bombPositions) {
        let xMoreThanZero = (x > 0);
        let yMoreThanZero = (y > 0);
        let xLessThanWidth = (x !== GAME_GRID_WIDTH - 1);
        let yLessThanHeight = (y !== GAME_GRID_HEIGHT - 1);
        let bombAmount = 0;

        if (xMoreThanZero && bombPositions.find(bp => bp.x === x - 1 && bp.y === y)) {
            bombAmount++;
        }

        if (yMoreThanZero && bombPositions.find(bp => bp.x === x && bp.y === y - 1)) {
            bombAmount++;
        }

        if (xLessThanWidth && bombPositions.find(bp => bp.x === x + 1 && bp.y === y)) {
            bombAmount++;
        }

        if (yLessThanHeight && bombPositions.find(bp => bp.x === x && bp.y === y + 1)) {
            bombAmount++;
        }

        if (xMoreThanZero && yMoreThanZero && bombPositions.find(bp => bp.x === x - 1 && bp.y === y - 1)) {
            bombAmount++;
        }

        if (xLessThanWidth && yLessThanHeight && bombPositions.find(bp => bp.x === x + 1 && bp.y === y + 1)) {
            bombAmount++;
        }

        if (xMoreThanZero && yLessThanHeight && bombPositions.find(bp => bp.x === x - 1 && bp.y === y + 1)) {
            bombAmount++;
        }

        if (xLessThanWidth && yMoreThanZero && bombPositions.find(bp => bp.x === x + 1 && bp.y === y - 1)) {
            bombAmount++;
        }

        return bombAmount
    }

    function generateGridData(maxX, maxY, bombPositions) {
        const gridData = [];

        for (let i = 0; i < maxY; i++) {
            if (!gridData[i]) {
                gridData.push([]);
            }
            for (let j = 0; j < maxX; j++) {
                const isBomb = bombPositions.find((bp) => bp.x === j && bp.y === i)

                if (isBomb) {
                    gridData[i].push({ type: BOMB_TYPE })
                } else {
                    const bombsAround = countBombsAround(j, i, bombPositions)
                    gridData[i].push(bombsAround > 0 ? { type: NUMBER_TYPE, number: bombsAround } : { type: EMPTY_TYPE })
                }
            }
        }

        return gridData;
    }

    function initializeGameGrid() {
        const bombPositions = generateBombPositions(GAME_GRID_WIDTH, GAME_GRID_HEIGHT, BOMB_AMOUNT);
        const gridData = generateGridData(GAME_GRID_WIDTH, GAME_GRID_HEIGHT, bombPositions);
        // console.log('gridData', gridData)

        const tempGameGrid = document.createElement("div");
        tempGameGrid.classList.add("game-grid");

        const gridElements = createGameGridElements(gridData);

        gridElements.forEach(gridElement => tempGameGrid.appendChild(gridElement));
        ROOT_ELEMENT.appendChild(tempGameGrid);
        //console.log(bombPositions);
    }

    console.log("begin initialize");
    initializeGameGrid();

})()