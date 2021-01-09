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
                cell.className = "grid-item";
                cell.setAttribute('data-x', j)
                cell.setAttribute('data-y', i)
                rowElememnt.appendChild(cell);
            }
            rowGridElements.push(rowElememnt);
        }

        return rowGridElements;
    };

    function generateBombPositions(maxX, maxY, size) {
        let bombPositions = [];
        for (let i = 0; i < size; i++) {
            let x;
            let y;
            do {
                x = Math.floor(Math.random() * Math.floor(maxX));
                y = Math.floor(Math.random() * Math.floor(maxY));
            }
            while (bombPositions.find(bp => bp.x === x && bp.y === y));
            bombPositions.push({ x, y });
        }
        return bombPositions;
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

        return bombAmount;
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

        const rowGridElements = createGameGridElements(gridData);

        const flatGridElements = rowGridElements.flatMap(el => el.children);

        tempGameGrid.addEventListener("click", (event) => {
            const target = event.target
            if (target.classList.contains("grid-item")) {
                console.log("target", target);
                const xCoord = target.getAttribute("data-x");
                const yCoord = target.getAttribute("data-y");
                let gridDataUnit = gridData[yCoord][xCoord];
                console.log("gridDataUnit", gridDataUnit);
                if (!!gridDataUnit) {
                    console.log("condition succeded");
                    let gridDataUnitType = gridDataUnit.type;
                    if (gridDataUnitType === BOMB_TYPE) {
                        target.innerText = "*";
                        target.classList.add("grid-bomb-item");
                    }
                    if (gridDataUnitType === NUMBER_TYPE) {
                        target.innerText = gridDataUnit.number;
                        target.classList.add("grid-number-item");
                    }
                    if (gridDataUnitType === EMPTY_TYPE) {
                        target.classList.add("grid-empty-item");
                    }
                }
            }
        })

        rowGridElements.forEach(gridElement => tempGameGrid.appendChild(gridElement));

        ROOT_ELEMENT.appendChild(tempGameGrid);
        //console.log(bombPositions);
    }

    console.log("begin initialize");
    initializeGameGrid();

})()