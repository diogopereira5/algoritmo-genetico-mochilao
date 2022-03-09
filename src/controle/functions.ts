import Storage from "../tmp/storage.json";
import { ProductTypes } from "../@types/productTypes";
import { PopulationTypes } from "../@types/populationTypes";

export function createPopulation(products: ProductTypes[], size = Storage.config.population_size) {

    var population: PopulationTypes[] = [];

    for (let i = 0; i < size; i++) {
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

    const sizeIndividuo = population[0].individual.length;

    //remove individuos com fitness == 0
    for (let i = population.length; i >= 0; i--) {
        if (population[i]?.fitness == 0) {
            population.pop();
        }
    }

    if (population.length === 0) {
        console.log("Nenhum individuo bom nesta geração!");
    }

    //escolhe em mode roleta 2 individuos para cruzamento
    const index1 = rollete(population);
    const index2 = rollete(population, index1);

    //ponto de corte
    const cutoff = randomIntFromInterval(0, (sizeIndividuo - 1));

    var newIndividuo1 = [];
    var newIndividuo2 = [];

    for (let i = 0; i < sizeIndividuo; i++) {
        if (i < cutoff) {
            newIndividuo1.push(population[index1].individual[i])
            newIndividuo2.push(population[index2].individual[i])
        } else {
            newIndividuo1.push(population[index2].individual[i])
            newIndividuo2.push(population[index1].individual[i])
        }
    }

    //criar dois novos filhos
    data.push({
        id: 1,
        individual: newIndividuo1
    })
    data.push({
        id: 2,
        individual: newIndividuo2
    })

    //mantem os melhores
    data.push(...population)

    //se populacao for maior que capacidade total, remove os ultimos individuos
    if (Storage.config.population_size < data.length) {
        do {
            data.pop();
        } while (data.length > Storage.config.population_size)
    }

    //add o restante aleaotiramente
    if (Storage.config.population_size > data.length) {
        const newPopulation = createPopulation(Storage.products, (Storage.config.population_size - data.length))
        data.push(...newPopulation);
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

function rollete(population: PopulationTypes[], differentNumber = -1) {

    //pegar soma total do fitness
    const fitnessTotal = sumFitness(population);
    //gerar numero aleatorio dando preferencias para os maiores fitness
    const random = randomIntFromInterval(0, fitnessTotal);

    var index = 0;
    var sum = 0;

    if (population.length === 0) {
        return index;
    }

    // [11111111111111|2222222|333|4]
    //Roleta fica responsavel para pegar o index do elemento cujo valor do fitness escolhido aleatoriamente
    do {
        sum += Number(population[index].fitness);
        if (sum < random) {
            index++;
        }
    } while (sum < random)

    //valida se numero é repetido
    if (index == differentNumber) {
        if (index === 0) {
            index++;
        } else {
            index--;
        }
    }

    //retorna o index
    return index;
}

function sumFitness(population: PopulationTypes[]) {
    var sum = 0;
    for (let item of population) {
        sum += Number(item.fitness);
    }
    return sum;
}