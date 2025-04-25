document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let gameActive = false;
    let currentPlayer = '';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let scores = {
        player1: 0,
        player2: 0,
        draws: 0
    };
    
    // Player selections
    let player1Character = 'Grisha';
    let player2Character = 'Nunuka';
    
    // Character information with emojis
   const characters = {
        'Grisha': {
            name: 'Grisha',
            color: '#FF69B4',
        },
        'Shagu': {
            name: 'Shagu',
            color: '#FF69B4',
           
        },
        'Merabi': {
            name: 'Merabi',
            color: '#FF69B4',   
        },
        'Cotne': {
            name: 'Cotne',
            color: '#FF69B4',
        },
        'Nunuka': {
            name: 'Nunuka',
            color: '#FF69B4',
        },
        'Dochi':{
            name: 'Dochi',
            color: '#FF69B4',
        },
        'Chika': {
            name: 'Chika',
            color: '#FF69B4',

        },
        'Tika':{
            name: 'Tika',
            color: '#FF69B4',
        }
    };
    
    // Winning conditions
    const winningConditions = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal top-left to bottom-right
        [2, 4, 6]  // Diagonal top-right to bottom-left
    ];
    
    // HTML elements
    const characterSelection = document.getElementById('character-selection');
    const gameContainer = document.getElementById('game-container');
    const statusDisplay = document.getElementById('status');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.getElementById('restart');
    const startGameButton = document.getElementById('start-game');
    const changeCharactersButton = document.getElementById('change-characters');
    const player1Options = document.querySelectorAll('.player-select:first-child .character-option');
    const player2Options = document.querySelectorAll('.player-select:last-child .character-option');
    const player1Avatar = document.getElementById('player1-avatar');
    const player2Avatar = document.getElementById('player2-avatar');
    const player1NameDisplay = document.getElementById('player1-name');
    const player2NameDisplay = document.getElementById('player2-name');
    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');
    const drawsDisplay = document.getElementById('draws');
    
    // Status messages with character-specific emojis
    const winMessage = () => {
        const character = currentPlayer === player1Character ? characters[player1Character] : characters[player2Character];
        return `${character.name} wins!`;
    };
    
    const drawMessage = () => `✨ Friendship wins! It's a draw! ✨`;
    
    const currentPlayerTurn = () => {
        const character = currentPlayer === player1Character ? characters[player1Character] : characters[player2Character];
        return `${character.name}'s turn`;
    };
    
    // Initialize the character selection events
    function initCharacterSelection() {
        player1Options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                player1Options.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                option.classList.add('selected');
                // Update player1Character
                player1Character = option.getAttribute('data-character');
                
                // If both players selected the same character, select a different one for player 2
                if (player1Character === player2Character) {
                    // Find an available character
                    const availableCharacters = Array.from(player2Options)
                        .filter(opt => opt.getAttribute('data-character') !== player1Character);
                    
                    if (availableCharacters.length > 0) {
                        player2Options.forEach(opt => opt.classList.remove('selected'));
                        availableCharacters[0].classList.add('selected');
                        player2Character = availableCharacters[0].getAttribute('data-character');
                    }
                }
            });
        });
        
        player2Options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                player2Options.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                option.classList.add('selected');
                // Update player2Character
                player2Character = option.getAttribute('data-character');
                
                // If both players selected the same character, select a different one for player 1
                if (player1Character === player2Character) {
                    // Find an available character
                    const availableCharacters = Array.from(player1Options)
                        .filter(opt => opt.getAttribute('data-character') !== player2Character);
                    
                    if (availableCharacters.length > 0) {
                        player1Options.forEach(opt => opt.classList.remove('selected'));
                        availableCharacters[0].classList.add('selected');
                        player1Character = availableCharacters[0].getAttribute('data-character');
                    }
                }
            });
        });
        
        startGameButton.addEventListener('click', startGame);
        changeCharactersButton.addEventListener('click', showCharacterSelection);
    }
    
    // Start the game with the selected characters
    function startGame() {
        // Reset scores if changing characters
        if (gameContainer.style.display === 'none') {
            scores = {
                player1: 0,
                player2: 0,
                draws: 0
            };
            updateScoreDisplay();
        }
        
        // Hide character selection
        characterSelection.style.display = 'none';
        // Show game container
        gameContainer.style.display = 'block';
        
        // Initialize game state
        gameActive = true;
        currentPlayer = player1Character;
        gameState = ['', '', '', '', '', '', '', '', ''];
        
        // Update status display
        statusDisplay.textContent = currentPlayerTurn();
        statusDisplay.style.borderColor = characters[currentPlayer].color;
        statusDisplay.style.color = characters[currentPlayer].color;
        
        // Update player avatars
        player1Avatar.style.backgroundImage = `url('${player1Character.toLowerCase()}.jpg')`;
        player2Avatar.style.backgroundImage = `url('${player2Character.toLowerCase()}.jpg')`;
        
        // Update player names in scoreboard
        player1NameDisplay.textContent = characters[player1Character].name;
        player2NameDisplay.textContent = characters[player2Character].name;
        
        // Reset cells
        cells.forEach(cell => {
            cell.className = 'cell';
            cell.style.animation = 'none';
        });
        
        // Add a little bounce to the board
        document.querySelector('.board').style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            document.querySelector('.board').style.animation = 'none';
        }, 500);
    }
    
    // Update the score display
    function updateScoreDisplay() {
        player1ScoreDisplay.textContent = scores.player1;
        player2ScoreDisplay.textContent = scores.player2;
        drawsDisplay.textContent = scores.draws;
    }
    
    // Show character selection screen
    function showCharacterSelection() {
        gameContainer.style.display = 'none';
        characterSelection.style.display = 'block';
    }
    
    // Handle cell click
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
        
        // Check if cell already played or game inactive
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Update game state and UI
        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }
    
    function handleCellPlayed(clickedCell, clickedCellIndex) {
        // Update game state
        gameState[clickedCellIndex] = currentPlayer;
        
        // Update UI with our character
        clickedCell.classList.add(currentPlayer);
    }
    
    function handleResultValidation() {
        let roundWon = false;
        let winningCells = [];
        
        // Check all winning conditions
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const conditionMet = 
                gameState[a] !== '' && 
                gameState[a] === gameState[b] && 
                gameState[b] === gameState[c];
            
            if (conditionMet) {
                roundWon = true;
                winningCells = [a, b, c];
                
                // Highlight winning cells with animation
                setTimeout(() => {
                    document.querySelector(`[data-cell-index="${a}"]`).classList.add('winner-cell');
                    document.querySelector(`[data-cell-index="${b}"]`).classList.add('winner-cell');
                    document.querySelector(`[data-cell-index="${c}"]`).classList.add('winner-cell');
                }, 100);
                
                break;
            }
        }
        
        // Handle win
        if (roundWon) {
            statusDisplay.textContent = winMessage();
            gameActive = false;
            
            // Add celebration animation to the status
            statusDisplay.style.animation = "celebrate 0.5s ease-in-out infinite alternate";
            
            // Apply character color to status
            const winnerColor = characters[currentPlayer].color;
            statusDisplay.style.borderColor = winnerColor;
            statusDisplay.style.color = winnerColor;
            
            // Update scores
            if (currentPlayer === player1Character) {
                scores.player1++;
            } else {
                scores.player2++;
            }
            updateScoreDisplay();
            
            // Highlight winner avatar
            if (currentPlayer === player1Character) {
                player1Avatar.classList.add('pulse');
                setTimeout(() => {
                    player1Avatar.classList.remove('pulse');
                }, 2000);
            } else {
                player2Avatar.classList.add('pulse');
                setTimeout(() => {
                    player2Avatar.classList.remove('pulse');
                }, 2000);
            }
            
            return;
        }
        
        // Handle draw
        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.textContent = drawMessage();
            gameActive = false;
            statusDisplay.style.borderColor = '#ff85b9';
            statusDisplay.style.color = '#ff69b4';
            scores.draws++;
            updateScoreDisplay();
            return;
        }
        
        // Change player
        handlePlayerChange();
    }
    
    function handlePlayerChange() {
        currentPlayer = currentPlayer === player1Character ? player2Character : player1Character;
        statusDisplay.textContent = currentPlayerTurn();
        
        // Update status color based on current player
        const playerColor = characters[currentPlayer].color;
        statusDisplay.style.borderColor = playerColor;
        statusDisplay.style.color = playerColor;
        
        // Indicate current player's turn with a subtle pulse
        if (currentPlayer === player1Character) {
            player1Avatar.classList.add('pulse');
            player2Avatar.classList.remove('pulse');
        } else {
            player2Avatar.classList.add('pulse');
            player1Avatar.classList.remove('pulse');
        }
    }
    
        function handleRestartGame() {
            gameActive = true;
            currentPlayer = player1Character;
            gameState = ['', '', '', '', '', '', '', '', ''];
            
            // Reset status display
            statusDisplay.textContent = currentPlayerTurn();
            statusDisplay.style.animation = "none";
            statusDisplay.style.borderColor = characters[player1Character].color;
            statusDisplay.style.color = characters[player1Character].color;
            
            // Reset pulse animations
            player1Avatar.classList.add('pulse');
            player2Avatar.classList.remove('pulse');
            
            // Reset UI
            cells.forEach(cell => {
                cell.className = 'cell';
                cell.style.animation = "none";
            });
            
            // Add a little bounce to the board
            document.querySelector('.board').style.animation = "bounce 0.5s ease";
            setTimeout(() => {
                document.querySelector('.board').style.animation = "none";
            }, 500);
        }
        
        // Event listeners
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
        
        restartButton.addEventListener('click', handleRestartGame);
        
        // Initialize the game
        initCharacterSelection();
    });
