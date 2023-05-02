# NodeJs Natural Selection Sim


Website:
[Github Pages Link](https://chickennuggetsperson.github.io/NodeJs-Natural-Selection-Sim/)


This is a basic nodejs example of simulating natural selection in an enviroment.

The enviroment consists of three objects
1. Bushes
2. Prey
3. Predators

The prey eat the bushes and the predators eat the prey.

When an animal is able to eat during a cycle, it can breed with another animal.
<br><br><br>
Each animal also stores a single genotype for a survivaly allele. For the prey, it lowers the chance of it getting eaten, and for the predators, it affects the chance of them eating a prey during a cycle. The genotype is stored as either homozygous recessive/dominant or heterozygous. When two animals breed, their genotypes are taken in and a baby is produced with the corresponding genotype of the parents based on the odds. 

<br><br>

If an animal waits too long before eating, then it will die. This causes predators with weak hunting skills to die off and predators with better hunting alleles to live. In the start of the index.js file, you can define all varialbles, including if good survival is dependent on having a dominant or recessive genotype per animal.

<br><br>

I have yet to successfully find a configuration that results in a stable enviroment.  
