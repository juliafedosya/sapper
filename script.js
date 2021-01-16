'use strict';
(function() {
    const GAME_GRID_HEIGHT = 14;
    const GAME_GRID_WIDTH = 18;
    const BOMB_AMOUNT = 40;
    const ROOT_ELEMENT = document.getElementById('app');
    const BOMB_TYPE = 'BOMB'
    const NUMBER_TYPE = 'NUMBER'
    const EMPTY_TYPE = 'EMPTY'
    const Y_ATTRIBUTE = 'data-y';
    const X_ATTRIBUTE = 'data-x';
    const bombPositions = generateBombPositions(GAME_GRID_WIDTH, GAME_GRID_HEIGHT, BOMB_AMOUNT);
    const gridData = generateGridData(GAME_GRID_WIDTH, GAME_GRID_HEIGHT, bombPositions);
    const iteratedElements = [];
    let bombFound = false;

    function openCells(xCoord, yCoord) {
        console.log('yCoord, xCoord', yCoord, xCoord)
        openNeighbourCells(xCoord, yCoord);
    }

    function openNeighbourCells(xCoord, yCoord) {
        console.log('total iterated cells', iteratedElements);
        let currentGridData = gridData[yCoord][xCoord];
        iteratedElements.push([xCoord, yCoord]);
        if (!!currentGridData) {
            let currentElement = document.querySelector('div[data-x=' + '"' + xCoord + '"' + '][data-y=' + '"' + yCoord + '"]');
            if (currentGridData.type === NUMBER_TYPE) {
                displayNumber(currentElement, currentGridData.number);
            } else if (currentGridData.type === EMPTY_TYPE) {
                let currentIteratedCells = createNeighbourElements(xCoord, yCoord, iteratedElements);
                console.log('current iteration cells', currentIteratedCells);
                currentIteratedCells.forEach(tuple => {
                    if (tuple[0] < GAME_GRID_WIDTH && tuple[1] < GAME_GRID_HEIGHT && tuple[0] >= 0 && tuple[1] >= 0) {
                        openNeighbourCells(tuple[0], tuple[1]);
                    }
                });
                displayEmpty(currentElement);
            } else {
                return;
            }
        }
    }

    function createNeighbourElements(x, y, iteratedCells) {
        let cells = [
            [x - 1, y],
            [x, y - 1],
            [x - 1, y - 1],
            [x + 1, y + 1],
            [x, y + 1],
            [x + 1, y],
            [x - 1, y + 1],
            [x + 1, y - 1]
        ];
        if (iteratedCells.length === 0) {
            return cells;
        }
        console.log('filtered elements', cells.filter(cell => iteratedCells.find(iteratedCell => cell[0] !== iteratedCell[0] && cell[1] !== iteratedCell[1])));

        return cells.filter(cell => !iteratedCells.find(iteratedCell => cell[0] === iteratedCell[0] && cell[1] === iteratedCell[1]));
    }

    function createGameGridElements() {
        const rowGridElements = [];

        for (let i = 0; i < gridData.length; i++) {
            let rowElememnt = document.createElement('div');
            rowElememnt.className = 'grid-row';
            for (let j = 0; j < gridData[i].length; j++) {
                let cell = document.createElement('div');
                cell.className = 'grid-item';
                cell.setAttribute(X_ATTRIBUTE, j)
                cell.setAttribute(Y_ATTRIBUTE, i)
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

    function applyForEachGridElementWithType(cellType, processCell) {
        let gridItems = Array.from(document.getElementsByClassName('grid-item'));
        gridItems.forEach(elem => {
            let gridUnit = gridData[elem.getAttribute(Y_ATTRIBUTE)][elem.getAttribute(X_ATTRIBUTE)];
            if ((!!gridUnit) && gridUnit.type === cellType) {
                processCell(elem);
            }
        })
    }

    function displayBomb(elem) {
        if (!elem.classList.contains('flagged')) {
            elem.innerText = '*';
            elem.classList.add('grid-bomb-item');
        } else {
            console.log('flagged element', elem);
        }
    }

    function displayEmpty(elem) {
        removeIfFlagged(elem);
        if (!elem.classList.contains('grid-empty-item')) {
            elem.classList.add('grid-empty-item');
        }
    }

    function displayNumber(elem, number) {
        removeIfFlagged(elem);
        if (!elem.classList.contains('grid-number-item')) {
            elem.innerText = number;
            elem.classList.add('grid-number-item');
        }
    }

    function removeIfFlagged(elem) {
        if (elem.classList.contains('flagged')) {
            elem.classList.remove('flagged');
        }
    }

    function createHandleCellClick(event) {
        if (!bombFound) {
            const target = event.target
            if (target.classList.contains('grid-item')) {
                const xCoord = target.getAttribute(X_ATTRIBUTE);
                const yCoord = target.getAttribute(Y_ATTRIBUTE);
                let gridDataUnit = gridData[yCoord][xCoord];
                if (!!gridDataUnit) {
                    let gridDataUnitType = gridDataUnit.type;
                    if (gridDataUnitType === BOMB_TYPE) {
                        bombFound = true;
                        applyForEachGridElementWithType(BOMB_TYPE, displayBomb);
                    } else {
                        openCells(parseInt(xCoord), parseInt(yCoord));
                    }
                }
            }
        }
    }

    function handleRightClick(event) {
        const target = event.target
        if (target.classList.contains('grid-item') && !bombFound) {
            event.preventDefault();
            if (target.classList.contains('flagged')) {
                target.classList.remove('flagged');
            } else if (!target.classList.contains('grid-number-item') && !target.classList.contains('grid-empty-item')) {
                target.classList.add('flagged');
            }
        }

    }

    function initializeGameGrid() {
        const tempGameGrid = document.createElement('div');
        tempGameGrid.classList.add('game-grid');

        const rowGridElements = createGameGridElements();

        tempGameGrid.addEventListener('click', createHandleCellClick);
        tempGameGrid.addEventListener('contextmenu', handleRightClick);

        rowGridElements.forEach(gridElement => tempGameGrid.appendChild(gridElement));

        ROOT_ELEMENT.appendChild(tempGameGrid);
        console.log('grid data', gridData)

        //console.log(bombPositions);
    }

    console.log('begin initialize');
    initializeGameGrid();

})()