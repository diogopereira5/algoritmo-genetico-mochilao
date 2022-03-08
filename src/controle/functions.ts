import Storage from "../tmp/storage.json";
import { ProductTypes } from "../@types/productTypes";
import { PopulationTypes } from "../@types/populationTypes";

export function createPopulation(products: ProductTypes[]) {

    var population: PopulationTypes[] = [];

    for (let i = 0; i < Storage.config.population_size; i++) {
        var data: Number[] = [];
        for (let itens of products) {
            const value = Math.random() < 0.5 ? 0 : 1; //gera numero aleaotiro entre 1 e 0 (tem - não tem)
            data.push(value)
        }
        population.push({ id: i, individual: data });
    }

    return population;
}

export function calculateFitness(population: PopulationTypes[], products: ProductTypes[]) {

    //retorna em ordem crescente os melhores individuos
    var data: PopulationTypes[] = [];

    //varre toda população
    for (let individual of population) {

        var sumWeight = 0;
        var sumValue = 0;
        var count = 0;

        //valida o peso e valor (valida na lista de produtos o peso e valor)
        for (let item of individual.individual) {
            if (item === 1) {
                sumWeight = Number(sumWeight) + Number(products[count].weight)
                sumValue = Number(sumValue) + Number(products[count].value);
            }
            count++;
        }

        sumWeight = sumWeight <= Storage.config.max_capacity ? sumWeight : -1; // retorna -1 caso indivudol estrapole o valor maximo

        //add fitness para individuo
        data.push({
            id: individual.id,
            individual: individual.individual,
            fitness: sumWeight > 0 ? sumValue : 0, // se a soma for maior que a capacidade max, ele retorna 0
            weight: sumWeight
        })
    }

    //orderna pelo maior fitness
    data = data.sort(function (a, b) {
        if (Number(a.fitness) < Number(b.fitness)) {
            return 1
        }
        if (Number(a.fitness) > Number(b.fitness)) {
            return -1
        } else {
            return 0;
        }
    });

    return data;
}

export function crossover(population: PopulationTypes[]) {

    var data: PopulationTypes[] = [];
    //pegar 2 melhores individuos e faz a reprodução
    for (let i = 0; i < Storage.config.population_size; i++) {
        const individuo1 = population[0].individual;
        const individuo2 = population[1].individual;

        const size = individuo1.length; //tamanho do cromossomo

        const newIndividual: Number[] = [];

        //gera um novo individuo com metade de cada individuo
        for (let j = 0; j < size; j++) {
            if (j < (size / 2)) {
                newIndividual.push(individuo1[j])
            } else {
                newIndividual.push(individuo2[j])
            }
        }

        //add ao array de nova população
        data.push({
            id: population[i].id,
            individual: newIndividual
        });

    }

    return data
}

export function mutation(population: PopulationTypes[]) {

    //cria a mutação na população
    var data: PopulationTypes[] = [];

    for (let item of population) {

        const value = randomIntFromInterval(0, (item.individual.length - 1)); //pegar um cromossomo para mutacao
        item.individual[value] = item.individual[value] === 1 ? 0 : 1; //se valor for 1 troca para 0, e virse-versa

        data.push({
            id: item.id,
            individual: item.individual,
            fitness: item.fitness
        })
    }

    return data;
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Number(Math.floor(Math.random() * (max - min + 1)) + min)
}