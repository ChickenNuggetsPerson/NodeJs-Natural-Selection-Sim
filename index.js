const fs = require("fs")


const hetero = 1;
const homoRec = 2;
const homoDom = 3;



/*

Simulation basics

Both prey and predators have a trait that can change

- Predator
Dom: Better smell - has a higher chance of catching a prey
Rec: Worse smell - has a lower chance of catching a prey

Predators need to eat an animal ever other day to survive
The more the prey there are, the higher the chance they can eat 


- Prey
Dom: 
Rec: 

*/


const predHungerMax = 4;
const preyHungerMax = 2;



const preyDomChance = 30;
const preyRecChance = 5;

const predDomChance = 20;
const predRecChance = 0;

const bushRegrowthTime = 3;

const PreyStart = 20
const PredStart = 10;
const BushStart = 50;

const updateSpeed = 750;


// Define Classes

class Prey {
    age = 0;
    health = 10.00;
    genotype = randomIntFromInterval(1, 3);
    hunger = preyHungerMax;
    ate = false;
    iterate() {
        this.age++;
        if (this.hunger == 0) {
            return false;
        }
        this.hunger = this.hunger - 1;
        return true;
    }
    eat() {
        this.hunger = preyHungerMax;
        this.ate = true;
    }
    constructor() {
        this.hunger = preyHungerMax;
    }

}

class Predator {
    age = 0;
    health = 10.00;
    genotype = randomIntFromInterval(1, 3);
    hunger = predHungerMax;
    ate = false;
    iterate() {
        this.age++;
        if (this.hunger == 0) {
            return false;
        }
        this.hunger = this.hunger - 1;
        return true;
    }
    eat() {
        this.hunger = predHungerMax;
        this.ate = true;
    }
    constructor() {
        this.hunger = predHungerMax;
    }
}



class Bush {
    hasBerries = true;
    regrowCooldown = 0;
    iterate() {
        if (!this.hasBerries && this.regrowCooldown == 0) {
            this.hasBerries = true;
        } 
        if (this.regrowCooldown != 0) {
            this.regrowCooldown--;
        }
    }
    eat() {
        this.hasBerries = false;
        this.regrowCooldown = bushRegrowthTime;
    }
}


class Stats {

    fullData = []

    constructor() {
        
    }
    pushData(stepNum, bushTotal, preyTotal, predTotal) {
        let tempData = {
            "step": stepNum,
            "bushTotal": bushTotal,
            "preyTotal": preyTotal,
            "predTotal": predTotal
        }
        this.fullData.push(tempData);
    }
    finished() {
        return this.fullData;
    }
}

const statSystem = new Stats()

class Ecosystem {
    preyStorage = [];
    predatorStorage = [];
    bushStorage = [];

    statStorage = [];

    stepCount = 0;

    setup(numOfPrey, numOfPred, numOfBushes) {
        for (let i = 0; i < numOfPrey; i++) {
            this.preyStorage.push(new Prey());
        }

        for (let i = 0; i < numOfPred; i++) {
            this.predatorStorage.push(new Predator());
        }

        for (let i = 0; i < numOfBushes; i++) {
            this.bushStorage.push(new Bush());
        }
    }

    step() {
        this.stepCount++;
        console.log("\n\n\n\n");
        console.log("Step #", this.stepCount);



        let avaliableBushes = [];

        // Iterate bushes
        for (let i = 0; i < this.bushStorage.length; i++) {
            this.bushStorage[i].iterate();
            if (this.bushStorage[i].hasBerries) {
                avaliableBushes.push(i);
            }
        }


        let predDeathList = [];
        let avaliablePreds = [];
        // Kill Preds
        for (let i = 0; i < this.predatorStorage.length; i++) {
            if(!this.predatorStorage[i].iterate()) {
                predDeathList.push(i);
            } else {
                avaliablePreds.push(i);
            }
        }


        let breedablePreds1 = [];
        let breedablePreds2 = [];
        let predSwitch = false;

        let preyKilled = 0;

        // Preds Eat
        for (let i = 0; i < avaliablePreds.length; i++) {
            const chosenPreyNum = randomIntFromInterval(0, this.preyStorage.length - 1);

            const chosenPrey = this.preyStorage[chosenPreyNum];


            if (this.preyStorage.length == 0 ) { break; }

            if (tryToCatch(this.predatorStorage[avaliablePreds[i]].genotype, chosenPrey.genotype)) {
                // Prey is eaten
                preyKilled++;
                this.preyStorage.splice(chosenPreyNum, 1);
                this.predatorStorage[avaliablePreds[i]].eat();
                if (predSwitch) {
                    breedablePreds1.push(avaliablePreds[i]);
                    predSwitch = false;
                } else {
                    breedablePreds2.push(avaliablePreds[i]);
                    predSwitch = true;
                }
            } else {
                // Prey is spared
            }
        }

        // Preds breed
        for (let i = 0; i < breedablePreds1.length; i++) {
            this.predatorStorage.push(createPred(calcDNA(this.predatorStorage[breedablePreds1[i]].genotype, this.predatorStorage[breedablePreds2[i]].genotype)))
        }


        let breedablePreys1 = [];
        let breedablePreys2 = [];
        let preySwitch = false;

        let bushesEaten = 0;

        // Prey eat
        for (let i = 0; i < this.preyStorage.length; i++) {
            const chosenBushNum = randomIntFromInterval(0, avaliableBushes.length - 1);
            if (avaliableBushes.length == 0) { break; }
            //const chosenBush = this.bushStorage[avaliableBushes[chosenBushNum]];
            if (this.bushStorage[avaliableBushes[chosenBushNum]].hasBerries) {
                this.bushStorage[avaliableBushes[chosenBushNum]].eat();
                bushesEaten++;
                if (preySwitch) {
                    breedablePreys1.push(i);
                    preySwitch = false;
                } else {
                    breedablePreys2.push(i)
                    preySwitch = true;
                }
            }

        }
        // Prey breed
        for (let i = 0; i < breedablePreys1.length; i++) {
            this.preyStorage.push(createPrey(calcDNA(this.preyStorage[breedablePreys1[i]].genotype, this.preyStorage[breedablePreys2[i]].genotype)))
        }

        // Remove dead preds
        for (let i = predDeathList.length - 1; i > -1; i--) {
            this.predatorStorage.splice(predDeathList[i], 1);
        }



        this.predatorStorage.forEach(pred => {
            pred.ate = false;
        });

        this.preyStorage.forEach(prey => {
            prey.ate = false;
        })

        // Calc Stats
        //console.log("---------------------");
        //console.log("Predators: ", this.predatorStorage.length, "   Killed: ", predDeathList.length)
        //console.log("Preys:     ", this.preyStorage.length, "  Killed: ", preyKilled)
        //console.log("Bushes:     ", this.bushStorage.length, "  Eaten: ", bushesEaten)
        //console.log("---------------------");

        console.log("---------------------");
        console.log("          Pred    Prey    Bushes");
        console.log("Current:  ", this.predatorStorage.length, "    ", this.preyStorage.length, "    ", this.bushStorage.length);
        console.log("Killed:   ", predDeathList.length, "    ", preyKilled, "     ", bushesEaten)
        console.log("---------------------");

        statSystem.pushData(this.stepCount, this.bushStorage.length, this.preyStorage.length, this.predatorStorage.length)
        
        return this.stepCount;
    }


}




async function main() {
    
    const ecosystem = new Ecosystem();
    ecosystem.setup(PreyStart, PredStart, BushStart);

    while (true) {
        let step = ecosystem.step();

        if (step == 100) {
            break;
        }

        await delay(updateSpeed);   
    }

    fs.writeFileSync("./data.json", JSON.stringify(statSystem.finished()));
}



main();



function createPrey(genotype) {
    let temp = new Prey();
    temp.genotype = genotype;
    return temp;
}
function createPred(genotype) {
    let temp = new Predator();
    temp.genotype = genotype;
    return temp;
}


function tryToCatch(predGeno, preyGeno) {
    let chance = 50;
    if (isDom(predGeno)) {
        if (isDom(preyGeno)) {
            chance = chance - preyDomChance + predDomChance;
        } else {
            chance = chance - preyRecChance + predDomChance;
        }
    } else {
        if (isDom(preyGeno)) {
            chance = chance - preyDomChance + predRecChance;
        } else {
            chance = chance - preyRecChance + predRecChance;
        }
    }

    let caughtChance = randomIntFromInterval(0, 100);
    return (caughtChance <= chance);
}

function isDom(genotype) {
    if (genotype == hetero) {
        return true;
    }
    if (genotype == homoDom) {
        return true;
    }
    return false;
}


function getName(genotype) {
    if (genotype == hetero) {
        return "heterozygous";
    }
    if (genotype == homoDom) {
        return "Homozygous Dom";
    }
    if (genotype == homoRec) {
        return "Homozygous Rec";
    }
}

function calcDNA(parent1, parent2) {
    if (parent1 == homoRec && parent2 == homoRec) {
        return homoRec
    }

    if (parent1 == homoDom && parent2 == homoDom) {
        return homoDom;
    }

    if (parent1 == hetero && parent2 == hetero) {
        const num = randomIntFromInterval(0, 100);
        if (num >= 0 && num <= 25) {
            return homoRec;
        }
        if (num >= 26 && num <= 50) {
            return homoDom;
        }
        return hetero;
    }

    if (parent1 == homoDom && parent2 == hetero) {
        const num = randomIntFromInterval(0, 100);
        if (num >= 0 && num <= 50) {
            return hetero;
        } else {
            return homoDom;
        }
    }

    if (parent1 == homoRec && parent2 == hetero) {
        const num = randomIntFromInterval(0, 100);
        if (num >= 0 && num <= 50) {
            return hetero;
        } else {
            return homoRec;
        }       
    }

    if (parent1 == homoDom && parent2 == homoRec) {
        const num = randomIntFromInterval(0, 100);
        if (num >= 0 && num <= 50) {
            return hetero;
        } else {
            return homoDom;
        }            
    }
    return calcDNA(parent2, parent1);
    
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
