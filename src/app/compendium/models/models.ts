export interface Demon {
    name: string;
    race: string;
    lvl: number;
    align: string;
    stats: number[];
    resists: string[];
    affinities?: number[];
    ailments?: number[];
    skills: string[];
    source: string[];
    inherits: string[];
    fusion: string;
    password: string[];
}

export interface Skill {
    element: string;
    name: string;
    power: number;
    accuracy: number;
    cost: number;
    inherit: string;
    rank: number;
    effect: string;
    learnedBy: string[];
    dsource: string[];
}

export interface FusionRecipe {
    name1: string;
    name2: string;
}

export interface FusionTableHeaders {
    left: string;
    right: string;
}

export interface FusionRow {
    race1: string;
    lvl1: number;
    name1: string;
    race2: string;
    lvl2: number;
    name2: string;
    notes?: string;
}
