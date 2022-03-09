import { ProductTypes } from "./@types/productTypes";
import { PopulationTypes } from "./@types/populationTypes";
import { calculateFitness, createPopulation, crossover, mutation } from "./controle/functions";
import Storage from "./tmp/storage.json";

function Algorithm() {
    const products: ProductTypes[] = Storage.products;
    var population: PopulationTypes[] = createPopulation(products);
    population = calculateFitness(population, products);

    var best = population[0];
    var generation = 0;

    console.log("Calculando dados...");
    
    //repete
    for (let i = 0; i < 1; i++) {
        population = crossover(population);
        population = mutation(population);
        population = calculateFitness(population, products);

        // const bestFitness = best.fitness || 0;
        // const bestFitnessAtual = population[0].fitness || 0;
        // if (bestFitness < bestFitnessAtual) {
        //     best = population[0];
        //     generation = i + 1;
        // }
    }

    // console.log("\n---------------------------------------------------------------");
    // console.log(`Os melhores produtos foram: (Geração: ${generation}, individuo: ${Number(best.id) + 1})\n`);
    // for (let i = 0; i < best.individual.length; i++) {
    //     if (best.individual[i] === 1) {
    //         console.log(`${products[i].name} no valor de R$${products[i].value}`);
    //     }
    // }

    // const ocupation = Number(best.weight);
    // console.log("\n");
    // console.log(`Ocupou ${Number(ocupation / 1000).toFixed(2)}Kg de ${Number(Storage.config.max_capacity / 1000).toFixed(2)}Kg`);
    // console.log(`No total de R$${best.fitness}`);
    // console.log("---------------------------------------------------------------");
}

export default Algorithm;
