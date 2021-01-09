"use strict";
(function() {
    const GAME_GRID_HEIGHT = 14;
    const GAME_GRID_WIDTH = 18;
    const BOMB_AMOUNT = 40;
    const ROOT_ELEMENT = document.getElementById("app");

    let gameGrid = null;

    function createGameGridElements(rows, cols) {
        const rowGridElements = [];

        for (let i = 0; i < rows; i++) {
            let rowElememnt = document.createElement("div");
            rowElememnt.className = "grid-row";
            for (let j = 0; j < cols; j++) {
                let cell = document.createElement("div");
                cell.className = "grid-item";
                rowElememnt.appendChild(cell);
            }
            rowGridElements.push(rowElememnt);
        }

        return rowGridElements;
    };

    function generateBombPositions(maxX, maxY, size) {
        return Array.from((new Array(size))).map(() => ({
            x: Math.floor(Math.random() * Math.floor(maxX)),
            y: Math.floor(Math.random() * Math.floor(maxY)),
        }));
    }

    function initializeGameGrid() {
        const tempGameGrid = document.createElement("div");
        tempGameGrid.classList.add("game-grid");

        const gridElements = createGameGridElements(GAME_GRID_HEIGHT, GAME_GRID_WIDTH);

        gridElements.forEach(gridElement => tempGameGrid.appendChild(gridElement));
        ROOT_ELEMENT.appendChild(tempGameGrid);

    }

    console.log("begin initialize");
    initializeGameGrid();

})()