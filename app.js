document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('.grid-user');
    const computerGrid = document.querySelector('.grid-computer');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelectorAll('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const submarine = document.querySelector('.submarine-container');
    const cruiser = document.querySelector('.cruiser-container');
    const battleship = document.querySelector('.battleship-container');
    const carrier = document.querySelector('.carrier-container');
    const startButton = document.querySelector('#start');
    const rotateButton = document.querySelector('#rotate');
    const turnDisplay = document.querySelector('#whose-go');
    const infoDisplay = document.querySelector('#info');
    const userSquares = []
    const computerSquares = []
    let isHorizontal = true
    let isGameOver = false
    let currentPlayer = 'user'

    const width = 10;

    //create board
    function createBoard(grid, squares) {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.dataset.id = i;
            grid.appendChild(square);
            squares.push(square)
        }
    }

    createBoard(userGrid, userSquares)
    createBoard(computerGrid, computerSquares)


    // Ships
    const shipArray = [{
        name: 'destroyer',
        directions: [
            [0, 1],
            [0, width]
        ]
    }, {
        name: 'submarine',
        directions: [
            [0, 1, 2],
            [0, width, 2 * width]
        ]
    }, {
        name: 'cruiser',
        directions: [
            [0, 1, 2],
            [0, width, 2 * width]
        ]
    }, {
        name: 'battleship',
        directions: [
            [0, 1, 2, 3],
            [0, width, 2 * width, 3 * width]
        ]
    }, {
        name: 'carrier',
        directions: [
            [0, 1, 2, 3, 4],
            [0, width, 2 * width, 3 * width, 4 * width]
        ]
    }];

    // Draw the ships in random loc
    function generate(ship) {
        let randomDir = Math.floor(Math.random() * ship.directions.length);
        let current = ship.directions[randomDir]
        if (randomDir === 0) direction = 1
        if (randomDir === 1) direction = 10;
        let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)));

        const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'));
        const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
        const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

        if (!isTaken && !isAtLeftEdge && !isAtRightEdge) {
            current.forEach(index => {
                computerSquares[randomStart + index].classList.add('taken', ship.name)
            });
        } else {
            generate(ship)
        }
    }

    generate(shipArray[0])
    generate(shipArray[1])
    generate(shipArray[2])
    generate(shipArray[3])
    generate(shipArray[4])

    // rotate thy ships
    function rotate() {
        destroyer.classList.toggle('destroyer-container-vertical');
        submarine.classList.toggle('submarine-container-vertical');
        cruiser.classList.toggle('cruiser-container-vertical');
        battleship.classList.toggle('battleship-container-vertical');
        carrier.classList.toggle('carrier-container-vertical');
        isHorizontal = !isHorizontal
    }

    rotateButton.addEventListener('click', rotate);

    // move around user grid
    ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
    userSquares.forEach(square => square.addEventListener('dragover', dragOver))
    userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
    userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
    userSquares.forEach(square => square.addEventListener('drop', dragDrop))
    userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

    let selectedShipNameWithIndex;
    let draggedShip;
    let draggedShipLength;

    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectedShipNameWithIndex = e.target.id;
        console.log(selectedShipNameWithIndex)
    }))

    function dragStart() {
        draggedShip = this;
        draggedShipLength = draggedShip.children.length;
        console.log(draggedShip)
        console.log(draggedShipLength)
    }

    function dragOver(e) {
        e.preventDefault();

    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave(e) {
        e.preventDefault();
    }

    function dragDrop() {
        let shipNameWithLastId = draggedShip.lastElementChild.id;
        let shipClass = shipNameWithLastId.slice(0, -2);
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
        let shipLastId = lastShipIndex + parseInt(this.dataset.id);
        console.log(shipLastId)
        const notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 43, 53, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93]
        const notAllowedVertical = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]
        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
        let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);

        let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

        shipLastId = shipLastId - selectedShipIndex;
        console.log(shipLastId)
        if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {
                userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass)
            }
        } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {
                userSquares[parseInt(this.dataset.id) + width * i - selectedShipIndex].classList.add('taken', shipClass)
            }
        } else {
            return
        }

        displayGrid.removeChild(draggedShip)
    }

    function dragEnd() {
        console.log('dragend')
    }

    //game logic
    function playGame() {
        if (isGameOver) return
        if (currentPlayer === 'user') {
            turnDisplay.innerHTML = 'Your Go'
            computerSquares.forEach(square => square.addEventListener('click', function(e) {
                revealSquare(square)
            }))
        } else if (currentPlayer === 'computer') {
            turnDisplay.innerHTML = 'Computer Go';
            setTimeout(computerGo, 1000)
        }
    }

    startButton.addEventListener('click', playGame)
    let destroyerCount = 0;
    let submarineCount = 0;
    let cruiserCount = 0;
    let battleshipCount = 0;
    let carrierCount = 0;

    function revealSquare(square) {
        if (!square.classList.contains('boom')) {
            if (square.classList.contains('destroyer')) destroyerCount++;
            if (square.classList.contains('submarine')) submarineCount++;
            if (square.classList.contains('cruiser')) cruiserCount++;
            if (square.classList.contains('battleship')) battleshipCount++;
            if (square.classList.contains('carrier')) carrierCount++;
            checkForWins()
        }

        if (square.classList.contains('taken')) {
            square.classList.add('boom')
        } else {
            square.classList.add('miss')
        }
        currentPlayer = 'computer'
        playGame()
    }

    let cpudestroyerCount = 0;
    let cpusubmarineCount = 0;
    let cpucruiserCount = 0;
    let cpubattleshipCount = 0;
    let cpucarrierCount = 0;

    function computerGo() {
        let random = Math.floor(Math.random() * userSquares.length);
        if (!userSquares[random].classList.contains('boom')) {
            userSquares[random].classList.add('boom')
            if (userSquares[random].classList.contains('destroyer')) cpudestroyerCount++;
            if (userSquares[random].classList.contains('submarine')) cpusubmarineCount++;
            if (userSquares[random].classList.contains('cruiser')) cpucruiserCount++;
            if (userSquares[random].classList.contains('battleship')) cpubattleshipCount++;
            if (userSquares[random].classList.contains('carrier')) cpucarrierCount++;
            checkForWins()
        } else computerGo()
        currentPlayer = 'user'
    }

    function checkForWins() {
        if (destroyerCount === 2) {
            infoDisplay.innerHTML = "computer's destroyer done";
            destroyerCount = 10
        }
        if (submarineCount === 3) {
            infoDisplay.innerHTML = "computer's submarine done";
            submarineCount = 10
        }
        if (cruiserCount === 3) {
            infoDisplay.innerHTML = "computer's cruiser done";
            cruiserCount = 10
        }
        if (battleshipCount === 4) {
            infoDisplay.innerHTML = "computer's battleship done";
            battleshipCount = 10
        }
        if (carrierCount === 5) {
            infoDisplay.innerHTML = "computer's carrier done";
            carrierCount = 10
        }
        if (cpudestroyerCount === 2) {
            infoDisplay.innerHTML = "user's destroyer done";
            cpudestroyerCount = 10
        }
        if (cpusubmarineCount === 3) {
            infoDisplay.innerHTML = "user's submarine done";
            cpusubmarineCount = 10
        }
        if (cpucruiserCount === 3) {
            infoDisplay.innerHTML = "user's cruiser done";
            cpucruiserCount = 10
        }
        if (cpubattleshipCount === 4) {
            infoDisplay.innerHTML = "user's battleship done";
            cpubattleshipCount = 10
        }
        if (cpucarrierCount === 5) {
            infoDisplay.innerHTML = "user's carrier done";
            cpucarrierCount = 10
        }
        if (destroyerCount + submarineCount + cruiserCount + carrierCount + battleshipCount === 50) {
            turnDisplay.innerHTML = "You Win"
            gameOver()
        }
        if (cpudestroyerCount + cpusubmarineCount + cpucruiserCount + cpucarrierCount + cpubattleshipCount === 50) {
            turnDisplay.innerHTML = "Computer Wins"
            gameOver()
        }

        function gameOver() {
            isGameOver = true
            startButton.removeEventListener('click', playGame)
        }

    }


})