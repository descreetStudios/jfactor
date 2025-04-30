export const questions = [
    {
        question: 'Qual è la capitale della Francia?',
        options: ['Parigi', 'Roma', 'Madrid', 'Berlino'],
        answer: 'Parigi',
    },
    {
        question: 'Quanto fa 5 + 3?',
        options: ['6', '7', '8', '9'],
        answer: '8',
    },
    {
        question: 'In che continente si trova il Brasile?',
        options: ['Africa', 'Asia', 'America del Sud', 'Europa'],
        answer: 'America del Sud',
    },
]

const categories = [
    "cell",         // Cell effect
    "question",     // [SPECIAL] Question
    "challenge",    // [SPECIAL] Challenge
    "death",        // [SPECIAL] Death
    "bonus",        // [SPECIAL] Bonus
]

const weights = [
    30,             // Weight for "cell"
    21,             // Weight for "questions"
    20,             // Weight for "challenge"
    7,              // Weight for "death"
    7               // Weight for "bonus"
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
    const maxEffects = 40;

    // Global Vars
    let appliedEffects = 0; // Number of effects already applied
    const availableCells = totalCells - alwaysExcludedCount;
    const categoryCounts = [0, 0, 0, 0, 0]; // Track how many times each category is applied
    const excludedCells = new Set([1, totalCells]); // Excluded cells + already used cells
    const finalEffect = {};
//#endregion
    // Question effect Settings
    const minQuestions = 3, maxQuestions = 6;

    // Question effect Vars
    const usedQuestions = new Set(); // TODO: Already used questions

    // Cell effect Settings
    const cellEffectRange = 6; // Max signed movement for cell effect

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
                // Generate random question and fill array
                quests[i] = questions[Math.floor(Math.random() * questions.length)];
            }

            finalEffect[cell] = { type: "question", quests };
        }

        excludedCells.add(cell);
        categoryCounts[chosenEffectIndex]++;
        appliedEffects++;
    }

    return finalEffect;
}