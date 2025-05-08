export const questions = [
    //1 domanda
    {
    question: 'In che anno arriva la peste a Firenze?',
    options: ['1248', '1350', '1348', '1340'],
    answer: '1348'
  },
  //2 domanda 
  {
    question: 'Quale di queste tipologie di peste non esiste?',
    options: ['Peste nera', 'Peste setticemica', 'Peste neurologica', 'Peste bubbonica'],
    answer: 'Peste neurologica'
  },
  //3 domanda 
  {
    question: 'Qual è la città più popolata negli anni del XIV secolo?',
    options: ['Parigi', 'Venezia', 'Milano', 'Firenze'],
    answer: 'Parigi'
  },
  //4 domanda
  {
    question: 'Quanti sono realmente i giorni che i ragazzi del Decameron hanno passato nella villa?',
    options: ['10', '12', '14', '13'],
    answer: '14'
  },
  //5 domanda
  {
    question: 'Quanti morti ha causato la peste a Firenze?',
    options: ['5000', 'Circa il 50% della popolazione', 'Oltre 300.000', 'Meno di 1000'],
    answer: 'Circa il 50% della popolazione'
  },
  //6 domanda
  {
    question: 'Quanti sono i ragazzi nella villa del Decameron?',
    options: ['8', '10', '12', '9'],
    answer: '10'
  },
  //7 domanda
  {
    question: 'Boccaccio da piccolo in che città si stabilisce?',
    options: ['Firenze', 'Milano', 'Palermo', 'Napoli'],
    answer: 'Napoli'
  },
  //8 domanda
  {
    question: 'Le autorità che restrizione misero dopo l\'arrivo della peste?',
    options: ['Quarantena', 'Uscire solo di sera', 'Uscire solo di giorno', 'Flagellarsi per la città'],
    answer: 'Quarantena'
  },
  //9 domanda
  {
    question: 'Chi furono incolpati per la diffusione della peste?',
    options: ['Gli spagnoli', 'I napoletani', 'Gli ungheresi', 'Gli ebrei'],
    answer: 'Gli ebrei'
  },
  //10 domanda
  {
    question: 'Dove nasce Boccaccio?',
    options: ['Avignone', 'Napoli', 'Milano', 'Non è sicuro'],
    answer: 'Non è sicuro'
  }
]

const categories = [
    "cell",         // Cell effect
    "question",     // [SPECIAL] Question
    "death",        // [SPECIAL] Death
    "bonus",        // [SPECIAL] Bonus
]

const weights = [
    45,             // Weight for "cell"
    30,             // Weight for "questions"
    10,             // Weight for "death"
    15              // Weight for "bonus"
];

function weightedRandomCategory(categories, weights) {
    const totalWeight = weights.reduce((acc, val) => acc + val, 0);
    let r = Math.random() * totalWeight;
    for (let i = 0; i < categories.length; i++) {
        if (r < weights[i]) return i;
        r -= weights[i];
    }
    return categories.length - 1; // fallback
}

export function generateEffects(totalCells = 63)
{
//#region Global
    // Global Settings
    const alwaysExcludedCount = 2; // Cells that are always exluded (cell 1 and cell 63)
    const maxEffects = 35;

    // Global Vars
    let appliedQuestions = 0; // Number of used questions, it will clear when all (quests - minQuest) is <= 0
    let appliedEffects = 0; // Number of effects already applied
    const availableCells = totalCells - alwaysExcludedCount;
    const categoryCounts = [0, 0, 0, 0, 0]; // Track how many times each category is applied
    const excludedCells = new Set([1, totalCells]); // Excluded cells + already used cells
    const finalEffect = {};
//#endregion
    // Question effect Settings
    const minQuestions = 3, maxQuestions = 6;

    // Cell effect Settings
    const cellEffectRange = 6; // Max signed movement for cell effect


    for (let i = 1; i < totalCells; ++i) {
        finalEffect[i] = { type: "empty"};
    }

    finalEffect[0] = { type : "start"};
    finalEffect[totalCells + 1] = { type : "final"};

	// Question pool setup outside while loop (only once)
	let shuffledQuestions = [...questions].sort(() => 0.5 - Math.random());
	let questionIndex = 0;
	
    while (appliedEffects < maxEffects) // While we haven't already applied effects to all possible cells
    {

        // Choose weighted effect category
        const chosenEffectIndex = weightedRandomCategory(categories, weights);
        const chosenCategory = categories[chosenEffectIndex];

        const cell = Math.floor(Math.random() * (availableCells)) + 2;

        if (excludedCells.has(cell)) continue;

        if (chosenCategory === "cell") {
            const move = Math.floor(Math.random() * (cellEffectRange * 2 + 1)) - cellEffectRange;
            if (!move) continue;

            const target = cell + move;
            if (target < 1 || target >= totalCells) continue;

            finalEffect[cell] = { type: "cell", move };
        }
        else if (chosenCategory === "question") {
			const numQuestions = Math.floor(Math.random() * (maxQuestions - minQuestions + 1)) + minQuestions;
            const quests = {};
            // Iterate trough chosen question count
            for (let i = 0; i < numQuestions; ++i) {
				// If we exhausted the pool, reshuffle and reset
				if (questionIndex >= shuffledQuestions.length) {
					shuffledQuestions = [...questions].sort(() => 0.5 - Math.random());
					questionIndex = 0;
				}
		
				quests[i] = shuffledQuestions[questionIndex];
				questionIndex++;
				appliedQuestions++;
			}
		
			finalEffect[cell] = { type: "question", quests };
        }
        else if (chosenCategory === "death") {
            finalEffect[cell] = { type: "death"};
        }
        else if (chosenCategory === "bonus") {
            finalEffect[cell] = { type: "bonus"};
        }

        excludedCells.add(cell);
        categoryCounts[chosenEffectIndex]++;
        appliedEffects++;
    }

    return finalEffect;
}