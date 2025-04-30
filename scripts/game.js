const categories = [
    "cell",         // Cell effect
    "questions",    // [SPECIAL] Questions 
    "challenge",    // [SPECIAL] Challenge
    "death",        // [SPECIAL] Death
    "bonus",        // [SPECIAL] Bonus
]

const weights = [
    45,             // Weight for "cell"
    20.5,           // Weight for "questions"
    20.5,           // Weight for "challenge"
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
    const availableCells = totalCells - alwaysExcludedCount;
    const excluded = new Set([1, totalCells]); // Excluded cells + already used cells
    const finalEffect = {};
//#endregion

    // Cell effect Settings
    const cellEffectRange = 6; // Max signed movement for cell effect

    for (let appliedEffects = 0; appliedEffects < maxEffects; ++appliedEffects) // While we haven't already applied effects to all possible cells
    {
        const chosenEffectIndex = weightedRandomCategory(categories, weights);
        const chosenCategory = categories[chosenEffectIndex];

        const cell = Math.floor(Math.random() * (availableCells)) + 2;
        if (excluded.has(cell)) continue;
    
        if (chosenCategory === "cell")
        {   
            const move = Math.floor(Math.random() * (cellEffectRange * 2 + 1)) - cellEffectRange;
            if (!move) continue;

            const target = cell + move;
            if (target < 1 || target >= totalCells) continue;
            
            finalEffect[cell] = move;
        }

        excluded.add(cell);
    }

    return finalEffect;
}