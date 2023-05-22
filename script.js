let data = [
  {
    x: [],
    y: [],
    type: 'scatter',
    name: 'Bushes'
  },
  {
    x: [],
    y: [],
    type: 'scatter',
    name: 'Prey'
  },
  {
    x: [],
    y: [],
    type: 'scatter',
    name: 'Predators'
  },

];

const layout = {
  title: 'Population',
  xaxis: {
    title: 'Time'
  },
  yaxis: {
    title: ''
  }
};


Plotly.newPlot('chart', data, layout);
updateChart()

function updateChart() {
  
  Plotly.newPlot('chart', data, layout);
  
}

function resetData() {
  data = [
    {
      x: [],
      y: [],
      type: 'scatter',
      name: 'Bushes'
    },
    {
      x: [],
      y: [],
      type: 'scatter',
      name: 'Prey'
    },
    {
      x: [],
      y: [],
      type: 'scatter',
      name: 'Predators'
    },
  
  ];
}

/*

Simulation basics

Both prey and predators have a trait that can change

- Predator
Dominant Trait: Better smell - has a higher chance of catching a prey
Recessive Trait: Worse smell - has a lower chance of catching a prey

- Prey
Dominant Trait: Better ears - has a higher chance of evading the predator
Recessive Trait: Worse ears - has a lower chance of evading the predator


How the math is calculated...
Each animal has a genotype of hh, Hh, or HH

The chance of being caught is calculated by: 
50% + pred_Chance - prey_Chance

Fake Scenario:

        Predator = Heterozygous 
        Prey = Homozygous Recessive

    Settings:

        predDomChance = 20
        preyRecChance = -5

    Math:

    50% + 20% - ( -5% ) = 75% of being caught

When animals breed with eachother, their offspring's genotype is calculated based on their parent's genotype 

*/




function startRunning() {
    let status = document.getElementById("runButton").disabled
    if (status) {
        return false;
    } else {
        document.getElementById("runButton").disabled = true;
        return true;
    }
}
function stopRunning() {
    document.getElementById("runButton").disabled = false;
}

async function main() {

if (!startRunning()) { return }


resetData()

const hetero = 1;
const homoRec = 2;
const homoDom = 3;
  
/*
const predHungerMax = document.getElementById("predHungerMax").value;
const preyHungerMax = document.getElementById("preyHungerMax").value;

const preyDomChance = document.getElementById("preyDomChance").value;
const preyRecChance = document.getElementById("preyRecChance").value;

const predDomChance = document.getElementById("predDomChance").value;
const predRecChance = document.getElementById("predRecChance").value;

const bushRegrowthTime = document.getElementById("bushRegrowthTime").value;

const PreyStart = document.getElementById("PreyStart").value
const PredStart = document.getElementById("PredStart").value;
const BushStart = document.getElementById("BushStart").value;

const updateSpeed = document.getElementById("updateSpeed").value;
const maxSteps = document.getElementById("maxSteps").value;
*/



const predHungerMax = JSON.parse(document.getElementById("predHungerMax").value)
const preyHungerMax = JSON.parse(document.getElementById("preyHungerMax").value)

const preyDomChance = JSON.parse(document.getElementById("preyDomChance").value)
const preyRecChance = JSON.parse(document.getElementById("preyRecChance").value)

const predDomChance = JSON.parse(document.getElementById("predDomChance").value)
const predRecChance = JSON.parse(document.getElementById("predRecChance").value)

const bushRegrowthTime = document.getElementById("bushRegrowthTime").value

const PreyStart = document.getElementById("PreyStart").value
const PredStart = document.getElementById("PredStart").value
const BushStart = document.getElementById("BushStart").value

const PredBreedCooldown = 1;
const PreyBreedCooldown = 1;

const PreyMutationChance = 10;
const PredMutationChance = 40;

const PreyGeneStrengthVarience = 10;
const PredGeneStrengthVarience = 10;

const updateSpeed = document.getElementById("updateSpeed").value;
const maxSteps = document.getElementById("maxSteps").value;
  
console.log("predHungerMax: ", predHungerMax);
console.log("preyHungerMax: ", preyHungerMax);
console.log("preyDomChance: ", preyDomChance);
console.log("preyRecChance: ", preyRecChance);
console.log("predDomChance: ", predDomChance);
console.log("predRecChance: ", predRecChance);
console.log("bushRegrowthTime: ", bushRegrowthTime);
console.log("PreyStart: ", PreyStart);
console.log("PredStart: ", PredStart);
console.log("BushStart: ", BushStart);
console.log("updateSpeed: ", updateSpeed);
console.log("maxSteps: ", maxSteps);


// Define Classes

class Prey {
  age = 0;
  health = 10.00;
  genotype = randomIntFromInterval(1, 3);
  hunger = preyHungerMax;
  breedCooldown = PreyBreedCooldown;
  ate = false;
  iterate() {
      this.age++;
      if (this.hunger <= 0) {
          return false;
      }
      this.hunger = this.hunger - 1;
      this.breedCooldown = this.breedCooldown - 1;
      if (this.breedCooldown < 0) {
        this.breedCooldown = 0;
      }
      return true;
  }
  canBreed() {
    return (this.breedCooldown == 0);
  }
  breed() {
    this.breedCooldown = PreyBreedCooldown;
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
  breedCooldown = PredBreedCooldown;
  ate = false;
  iterate() {
      this.age++;
      if (this.hunger <= 0) {
          return false;
      }
      this.hunger = this.hunger - 1;
      this.breedCooldown = this.breedCooldown - 1;
      if (this.breedCooldown < 0) {
        this.breedCooldown = 0;
      }
      return true;
  }
  canBreed() {
    return (this.breedCooldown == 0);
  }
  breed() {
    this.breedCooldown = PredBreedCooldown;
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

  constructor() {
      
  }
  pushData(stepNum, bushTotal, preyTotal, predTotal) {

      data[0].x.push(stepNum);
      data[0].y.push(bushTotal);

      data[1].x.push(stepNum);
      data[1].y.push(preyTotal);

      data[2].x.push(stepNum);
      data[2].y.push(predTotal);

      updateChart();
  }
}

const statSystem = new Stats()

class Ecosystem {
  preyStorage = [];
  predatorStorage = [];
  bushStorage = [];
  stepCount = 0;

  setup(numOfPrey, numOfPred, numOfBushes) {

      this.preyStorage = [];
      this.predatorStorage = [];
      this.bushStorage = [];

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

        console.log("Iterate Bushes")
      // Iterate bushes
      for (let i = 0; i < this.bushStorage.length; i++) {
          this.bushStorage[i].iterate();
          if (this.bushStorage[i].hasBerries) {
              avaliableBushes.push(i);
          }
      }


      let predDeathList = [];
      let avaliablePreds = [];
      console.log("Kill Predators")
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
      console.log("Predators Eat")
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
              if (this.predatorStorage[avaliablePreds[i]].canBreed()) {
                if (predSwitch) {
                    breedablePreds1.push(avaliablePreds[i]);
                    predSwitch = false;
                } else {
                    breedablePreds2.push(avaliablePreds[i]);
                    predSwitch = true;
                }
              }
              
          } else {
              // Prey is spared
          }
      }

      console.log("Predators Breed")
      // Preds breed
      for (let i = 0; i < breedablePreds1.length; i++) {
            this.predatorStorage.push(createPred(mutate(calcDNA(this.predatorStorage[breedablePreds1[i]].genotype, this.predatorStorage[breedablePreds2[i]].genotype), PredMutationChance)))
            this.predatorStorage[breedablePreds1[i]].breed();
            this.predatorStorage[breedablePreds2[i]].breed();
        }


      let breedablePreys1 = [];
      let breedablePreys2 = [];
      let preySwitch = false;

      let bushesEaten = 0;

      let starvedPreys = []
      console.log("Prey eat")
      // Prey eat
      for (let i = 0; i < this.preyStorage.length; i++) {

        const preyStatus = this.preyStorage[i].iterate()
        if (!preyStatus) {
            starvedPreys.push(i)
        } else {
            const chosenBushNum = randomIntFromInterval(0, avaliableBushes.length - 1);
            if (avaliableBushes.length == 0) { break; }
            //const chosenBush = this.bushStorage[avaliableBushes[chosenBushNum]];
            if (this.bushStorage[avaliableBushes[chosenBushNum]].hasBerries) {
                this.bushStorage[avaliableBushes[chosenBushNum]].eat();
                bushesEaten++;
                if (this.preyStorage[i].canBreed()) {
                    if (preySwitch) {
                        breedablePreys1.push(i);
                        preySwitch = false;
                    } else {
                        breedablePreys2.push(i)
                        preySwitch = true;
                    }
                }
            }
        }



      }

      console.log("Prey Breed")
      // Prey breed
      for (let i = 0; i < breedablePreys1.length; i++) {

            const baby = createPrey(mutate(calcDNA(this.preyStorage[breedablePreys1[i]].genotype, this.preyStorage[breedablePreys2[i]].genotype), PreyMutationChance))
            console.log(baby)
            this.preyStorage.push(baby)
            this.preyStorage[breedablePreys1[i]].breed();
            this.preyStorage[breedablePreys2[i]].breed();
       }

       console.log("Remove Dead Predators")
      // Remove dead preds
      for (let i = predDeathList.length - 1; i > -1; i--) {
        this.predatorStorage.splice(predDeathList[i], 1);
      }

      console.log("Remove Dead Prey")
    // Remove dead prey
    for (let i = starvedPreys.length - 1; i > -1; i--) {
        this.preyStorage.splice(starvedPreys[i], 1);
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
      console.log("Current:  ", this.predatorStorage.length, "    ", this.preyStorage.length, "    ", avaliableBushes.length);
      console.log("Killed:   ", predDeathList.length, "    ", preyKilled, "     ", bushesEaten)
      console.log("---------------------");

      statSystem.pushData(this.stepCount, avaliableBushes.length, this.preyStorage.length, this.predatorStorage.length)
      
      return this.stepCount;
  }


}

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
function mutate(genotype, mutationChance) {
    console.log("Mutating")
    let randomChance = randomIntFromInterval(0, 100);
    if (mutationChance > randomChance) {
        console.log("Mutated");
        let newGenotype = randomIntFromInterval(0, 100);
        if (newGenotype < 33) {
            return homoDom;
        }
        if (newGenotype < 66) {
            return homoRec;
        }
        return hetero;
    } else {
        return genotype;
    }
}


let ecosystem = new Ecosystem();
  ecosystem.setup(PreyStart, PredStart, BushStart)
  while (true) {
      let step = ecosystem.step();

    if (document.getElementById("continue").checked) {
        if (step > maxSteps) {
            data[0].x.splice(0, 1);
            data[0].y.splice(0, 1);
      
            data[1].x.splice(0, 1);
            data[1].y.splice(0, 1);
      
            data[2].x.splice(0, 1);
            data[2].y.splice(0, 1);
        }
    } else {
        if (step >= maxSteps) {
            break;
        }
    }


      await delay(updateSpeed);   
  }
  stopRunning()
}
