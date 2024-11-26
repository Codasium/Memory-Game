// Lijst van emojis voor de achterkant van de kaarten
const emojis = ["🧐", "🤡", "💩", "👺", "👿", "🤠", "👽", "💀", "👻", "🎃", "🤖", "👾", "🤢", "👮", "🤑", "⚽️", "🏀", "😺", "🥶", "🤯", "🥵"];

// Allemaal html elementen nodig voor later
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const turnText = document.getElementById("turn");
const inputCards = document.getElementById('inputCards');
const timerButton = document.getElementById('timerButton');
const multiplayerButton = document.getElementById('multiplayerButton');

// Variables voor de flipkaart logica voor later het is te complex om voor elk een naam te geven dat erbij past
let var1, var2, var3, var4, var5;

// Nog een paar html elementen maar die nog niet zijn aangemaakt
let inputTimer1, inputTimer2;

// Variables die denk ik duidelijk zijn wat ze zijn voor. Eerste zijn nummers tweede zijn bools
let score = 0, blueScore = 0, redScore = 0, timeLimit = 0, turn = 0;
let timeOut = false, ongoingGame = false, multiplayer1 = false, timer = false, multiplayer2 = false;

// Hoeveel kaarten er gaan komen op de scherm
let howManyCards = 20;

// Functie om een array te schudden met behulp een algoritme
function Shuffle(array) {
    const shuffled = array.slice(); // Een kopie van de originele array maken

    for (let i = shuffled.length - 1; i > 0; i--) { // For loop van het array
        const j = Math.floor(Math.random() * (i + 1)); // Genereert een willekeurige nummer 
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Elementen verwisselen
    }
    return shuffled;
}

// Functie om een bepaald aantal willekeurige elementen uit een array te halen
function GetRandomElements(array, count) {
    // Schudt de array en retourneert de elementen tot en met "count"
    const shuffledArray = Shuffle(array);
    return shuffledArray.slice(0, count);
}

// Functie om twee kaarten te omdraaien
function FlipCards(card1, card2) {

    // Het doet dit door de class vn de element de hele tijd aan en uit te zetten
    card1.classList.toggle('flip');
    card2.classList.toggle('flip');

    // Een timeout geven zodat je niet nog een kaart omdraait terwijl deze kaart om zit te draaien
    timeOut = false;
}

// Functie om twee kaarten te verwijderen
function RemoveCards(flipCard1, flipCard2) {
    
    // Het doet dit door de elementen te vervangen met een empty div die hetzelfde grootte is
    let newDiv = document.createElement('div'); // Hier maakt het de empty div
        // Hier wijzigt het de class van de empty div zodat het in css het hetzelfde grootte kan maken als een kaart
        newDiv.className = 'empty-div';

    // Ik vervang de elementen en verwijder ze niet dit doe ik zodat de kaarten van plek niet veranderen
    // De empty div imiteert dan een kaart maar werkt niet als een kaart

    // Hier vervangt het de kaart met de empty div
    flipCard1.parentNode.replaceChild(newDiv, flipCard1);

    // Het doet alles nog een keer maar voor de tweede kaart
    newDiv = document.createElement('div');
        newDiv.className = 'empty-div';
    flipCard2.parentNode.replaceChild(newDiv, flipCard2);

    // Nog een timeout zodat je niet de kaarten kan omdraaien terwijl ze worden verwijdert
    timeOut = false;
}

// Functie om Multiplayer aan te zetten
function AddMultiplayer() {
    // Als multiplayer niet aan is dan gaat het het aan zetten anders zet het het uit
    if (!multiplayer2) {

        // Multiplayer gaat aan (Ik weet dat het een beetje verwarrend is dat er een twee bools zijn maar het moet zo anders werkt de logica niet)
        multiplayer2 = true;

        // Het laat zien dat multiplayer aan is
        multiplayerButton.textContent = "Multiplayer: Aan";

        // Code voor als je al in een spel zit dan wacht het totdat je klaar bent of een nieuwe spel begint zodat het multiplayer aan kan zetten want anders zet het multiplayer aan midden in de spel
        let interval = setInterval(() => {
            // Als er geen spel bezig is
            if (!ongoingGame) {
                // Zet het multiplayer aan
                multiplayer1 = true;
            
            // Daarna als je de spel begint voert het dit uit
            } else if (multiplayer1) {

                // Voert de tekst in
                scoreText.textContent = "Blauw Score: 0 Rood Score: 0";
                turnText.textContent = "Beurt: Blauw";

                // Verandert de kleur van elke flipcard
                let flipCardsFront = document.querySelectorAll('.flip-card-front');
                flipCardsFront.forEach(function(card) {
                    card.style.setProperty("background-color", "blue");
                });

                // Stopt met wachten totdat je een nieuwe spel begint
                clearInterval(interval);

            // Als je multiplayer heb uitgezet
            } else if (!multiplayer2) {
                // Stopt het met wachten
                clearInterval(interval);
            }
        }, 20);
    } else {
        // Als je multiplayer uit heb gezet zet het multiplayer uit
        multiplayer2 = false;
        multiplayer1 = false;

        // Laat het zien dat je multiplayer uit hebt
        multiplayerButton.textContent = "Multiplayer: Uit";
    }
}

// Functie om als je een timer wilt toevoegen
function AddTimer() {

    // Zelfde logica als multiplayer
    if (!timer) {
        timer = true;

        timerButton.textContent = "Timer: Aan";

        // Maakt de input boxen voor de minuten en seconden te aanpassen
        inputTimer1 = document.createElement('input');
        inputTimer2 = document.createElement('input');
    
        // Het id instellen
        inputTimer1.id = 'inputTimer';
        inputTimer2.id = 'inputTimer2';
    
        // Het 'placeholder' instellen
        inputTimer1.placeholder = 'Minuten';
        inputTimer2.placeholder = 'Seconden';

        // De container selecteren
        const container = document.querySelector('.container');
    
        // De input boxen in de container zetten
        container.appendChild(inputTimer1);
        container.appendChild(inputTimer2);

    } else {
        timer = false;
        
        timerButton.textContent = "Timer: Uit";

        // De input boxes weghalen want je hebt ze niet meer nodig
        inputTimer1.remove();
        inputTimer2.remove();
    }
}

// Functie om de game te beginnen
function BeginGame() {

    // Als er al een spel bezig is stopt het die en gaat het door met een nieuwe spel beginnen
    if (ongoingGame) {
        ongoingGame = false;

        // Settimeout is een functie om een ander functie uit te voeren na een aantal miliseconden
        setTimeout(BeginGame, 100)
        return;
    }

    // Krijgt hoeveel kaarten je hebt ingevoerd
    howManyCards = Number(inputCards.value);

    // Allemaal logica voor als je niet goed hebt ingevoerd
    if (inputCards.value == "") {
        alert("Je hebt geen nummer ingevuld bij hoeveel kaarten!");
        return;
    }

    if (timer) {
        if (inputTimer1.value == "" && inputTimer2.value == "") {
            alert("Je hebt geen nummer ingevuld bij de timer!")
            return;
        }

        timeLimit = 0;

        if (inputTimer1.value != "") {
            timeLimit += Number(inputTimer1.value);
        }
        if (inputTimer2.value != "") {
            timeLimit += Number(inputTimer2.value)/60;
        }

        // Check if the variable is a number
        if (typeof timeLimit == "number" && !isNaN(timeLimit)) {
            if (timeLimit <= 0) {
                alert("Dat is te weinig tijd!");
                return;
            }
        } else {
            alert("Dat is geen nummer bij de timer!")
            return;
        }
    }

    if (typeof howManyCards == "number" && !isNaN(howManyCards)) {
        if (!Number.isInteger(howManyCards)) {
            alert("Dat is geen hele nummer bij hoeveel kaarten!");
            return;
        } else if (howManyCards <= 0) {
            alert("Te weinig kaarten!");
            return;
        } else if (howManyCards % 2 !== 0) {
            alert("Dat is geen meervoud van 2 bij hoeveel kaarten!");
            return;
        } else if (emojis.length * 2 < howManyCards) {
            alert("Dat zijn teveel kaarten!");
            return;
        }
    } else {
        alert("Dat is geen nummer bij hoeveel kaarten!");
        return;
    }

    // Voegt eindelijk de flipkaarten in
    AddFlipCards(howManyCards);
}

// Main functie voor bijna alles
function AddFlipCards(kaarten) {

    // Het spel is bezig
    ongoingGame = true;
    
    if (timer) {
        // Stel de aftelduur in (in milliseconden)
        let countdownDuration = timeLimit * 60 * 1000;

        // Bereken de eindtijd door de duur op te tellen bij de huidige tijd
        let countdownEndTime = new Date().getTime() + countdownDuration + 1000;

        // Werk het aftellen elke 0.02 seconde bij
        let interval = setInterval(() => {

            // Krijgt de tijd nu
            let now = new Date().getTime();

            // Berekent de tijd tot het klaar is met aftellen
            let timeLeft = countdownEndTime - now;

            // Berekent minuten en seconden
            let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            // Het resultaat weergeven
            timerText.textContent = `Tijd over: ${minutes}m ${seconds}s`;

            // Als het aftellen voorbij is heb je verloren
            if ((timeLeft <= 0 || score >= howManyCards/2) || !ongoingGame) {
                if (timeLeft <= 0) {
                    // Zeker maken dat de timer niet in de min gaat
                    timerText.textContent = "Tijd over: 0m 0s";
                    if (multiplayer1) {
                        // Als je multiplayer speelt dan rekent het uit wie de meeste punten had en die heeft dan gewonnen
                        if (blueScore == redScore) {
                            setTimeout(() => {
                                alert("Het is gelijkspel.");
                            }, 500);
                        } else if (blueScore > redScore) {
                            setTimeout(() => {
                                alert("Blauw heeft gewonnen.");
                            }, 500);
                        } else {
                            setTimeout(() => {
                                alert("Rood heeft gewonnen.");
                            }, 500);
                        }
                    } else {
                        // Zet een timeout zodat je niet op de kaarten kan klikken terwijl je al af bent
                        timeOut = true;
                        setTimeout(() => {
                            alert("Je hebt verloren.");
                        }, 500);
                    }
                }
                clearInterval(interval);
            }
        }, 20);
    }

    // Krijgt de emojis die het gaat gebruiken
    let randomEmojis = GetRandomElements(emojis, kaarten/2);

    // Maak een nieuwe lijst die twee keer zo lang is door de oorspronkelijke lijst met zichzelf samen te voegen
    let doubleRandom = randomEmojis.concat(randomEmojis);

    // Schud nu de lijst om willekeurige emojis te krijgen
    let randomDouble = Shuffle(doubleRandom);

    // Krijgt alle flipkaarten en 'empty-divs'
    let flipCards = document.querySelectorAll('.flip-card');
    let empty_divs = document.querySelectorAll('.empty-div')

    // Verwijdert ze zodat elke van de vorige spel weg is
    flipCards.forEach(function(card) {
        card.remove();
    });
    empty_divs.forEach(function(leeg) {
        leeg.remove();
    });

    // Maakt alle flipkaarten
    for (let i = 0; i < howManyCards; i++) {

        // Maakt eerst de elementen
        const flipCard = document.createElement('div');
        const flipCardInner = document.createElement('div');
        const flipCardFront = document.createElement('div');
        const flipCardBack = document.createElement('div');

        // Daarna stellt het de class in
        flipCard.classname = 'flip-card';
        flipCardInner.classname = 'flip-card-inner';
        flipCardFront.classname = 'flip-card-front';
        flipCardBack.classname = 'flip-card-back';
        flipCard.classList.add('flip-card');
        flipCardInner.classList.add('flip-card-inner');
        flipCardFront.classList.add('flip-card-front');
        flipCardBack.classList.add('flip-card-back');

        // Voeg inhoud toe aan de achterkant van de kaart
        const content = document.createElement('h1');
        content.textContent = randomDouble[i];
        content.className = 'flip-card-text'
        flipCardBack.appendChild(content);

        // Zet de kaartstructuur in elkaar
        flipCardInner.appendChild(flipCardFront);
        flipCardInner.appendChild(flipCardBack);
        flipCard.appendChild(flipCardInner);

        // Voeg de flip-kaart toe aan de 'roster-grid'
        const rosterGrid = document.querySelector('.roster-grid');
        rosterGrid.appendChild(flipCard);
    }

    // Code voor later om alle elementen van die class te pakken
    let flipCardsFront = document.querySelectorAll('.flip-card-front');
    flipCards = document.querySelectorAll('.flip-card');

    // Stellt alles weer normaal als het verandert werdt in de vorige spel
    timeOut = false;
    score = 0;
    blueScore = 0;
    redScore = 0;
    turn = 0;
    
    // Stellt alle teksten normaal
    if (multiplayer1) {
        scoreText.textContent = "Blauw Score: 0 Rood Score: 0";
        turnText.textContent = "Beurt: Blauw";
        flipCardsFront.forEach(function(card) {
            card.style.setProperty("background-color", "blue");
        });
    } else {
        scoreText.textContent = "Score: 0";
        turnText.textContent = "";
    }
    timerText.textContent = "";
    
    // Voor elke flipkaart een eventlistener adden voor als je klikt
    for (let flipCard of flipCards) {
        flipCard.addEventListener('click', function() {
            // Als het niet getimed out is en als je klikt
            if (!timeOut) {
                // Als je niet hetzelfde kaart aanklikt
                var1 = this.querySelector('.flip-card-inner');
                if (var1 == var4) {
                    return;
                }

                // Dan gaat het de kaart omdraaien
                var1.classList.toggle('flip');
                var2 = var1.querySelector('.flip-card-back').querySelector('.flip-card-text').textContent;

                // Allemaal logica om te checken of als je twee juiste kaarten hebt aangeklikt
                if (var3 != null) {
                    if (var2 == var3) {
                        // Verwijdert beide kaarten
                        setTimeout(RemoveCards, 800, flipCard, var5)

                        // Zet een timeout zodat je niet ander kaarten klikt terwijl deze worden verwijdert
                        timeOut = true

                        // Als multiplayer aan is
                        if (multiplayer1) {

                            // Dit controleert wie zijn beurt het is en aan die speler de punt te geven
                            if (turn == 0) {
                                blueScore++;
                            } else {
                                redScore++;
                            }

                            // Laat het de scoreboard zien
                            scoreText.textContent = `Blauw Score: ${blueScore} Rood Score: ${redScore}`;
                            
                            // Als alle kaarten weg zijn controleert het wie meer punten heeft en speler heeft dan gewonnen
                            if (blueScore + redScore >= kaarten/2) {
                                if (blueScore == redScore) {
                                    setTimeout(() => {
                                        alert("Het is gelijkspel.");
                                    }, 500);
                                } else if (redScore > blueScore) {
                                    setTimeout(() => {
                                        alert("Rood heeft gewonnen.");
                                    }, 500);
                                } else {
                                    setTimeout(() => {
                                        alert("Blauw heeft gewonnen.");
                                    }, 500);
                                }

                                // Stopt het de spel
                                ongoingGame = false;
                            }
                        } else {

                            // Je een punt geven
                            score++;

                            // Laat het je de scoreboard zien
                            scoreText.textContent = "Score: " + score;

                            // Als je alles goed hebt heb je gewonnen
                            if (score >= kaarten/2) {
                                setTimeout(() => {
                                    alert("Je hebt gewonnen.");
                                }, 500);

                                // Stopt het de spel
                                ongoingGame = false;
                            }
                        }
                    }
                    else {
                        // Als je niet de goede kaarten hebt aangeklikt draait het dan weer om
                        setTimeout(FlipCards, 800, var1, var4)

                        // Als het multiplayer is dan verandert het de beurt
                        if (multiplayer1) {
                            if (turn == 0) {
                                turn = 1;
                                setTimeout(() => {
                                    // Laat zien wie aan het beurt is
                                    turnText.textContent = "Beurt: Rood";
                                    // Verandert de kleur door de eigenschappen in css van alle flipkaarten te veranderen
                                    flipCardsFront.forEach(function(card) {
                                        card.style.setProperty("background-color", "red");
                                    });
                                }, 1200);
                            } else {
                                turn = 0;
                                setTimeout(() => {
                                    // Hetzelfde maar verandert de kleur van de kaarten naar blauw
                                    turnText.textContent = "Beurt: Blauw";
                                    flipCardsFront.forEach(function(card) {
                                        card.style.setProperty("background-color", "blue");
                                    });
                                }, 1200);
                            }
                        }
                        // Een timeout geven zodat je niet andere kaarten omdraait terwijl deze kaarten nog omdraaien
                        timeOut = true;
                    }
                    // Logica variables instellen
                    var3 = null;
                    var4 = null;
                }
                else {
                    // Logica variables instellen
                    var3 = var2;
                    var4 = var1;
                }
                // Logica variable instellen
                var5 = flipCard;
            }
        });
    }
}

// In het begin 20 kaarten automatisch toevoegen
AddFlipCards(howManyCards);
