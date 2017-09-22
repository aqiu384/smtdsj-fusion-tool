function getEnumOrder(target: string[]): { [key: string]: number } {
    const result = {};
    for (let i = 0; i < target.length; i++) {
        result[target[i]] = i;
    }
    return result;
}

export const Races = [
    'Herald',
    'Megami',
    'Avian',
    'Tree',
    'Divine',
    'Flight',
    'Yoma',
    'Nymph',
    'Vile',
    'Raptor',
    'Wood',
    'Deity',
    'Avatar',
    'Holy',
    'Genma',
    'Fairy',
    'Beast',
    'Jirae',
    'Snake',
    'Reaper',
    'Wilder',
    'Jaki',
    'Vermin',
    'Fury',
    'Lady',
    'Dragon',
    'Kishin',
    'Fallen',
    'Brute',
    'Femme',
    'Night',
    'Tyrant',
    'Drake',
    'Spirit',
    'Foul',
    'Haunt',
    'Fiend',
    'Enigma',
    'UMA',
    'Zealot',
    'Geist',
    'Prime',
    'Mitama',
    'Fake'
];

export const PrimeElements = [
    'Erthys',
    'Aeros',
    'Aquans',
    'Flaemis',
    'Gnome',
    'Sylph',
    'Undine',
    'Salamander',
];

export const ResistanceElements = [
    'phy',
    'gun',
    'fir',
    'ice',
    'ele',
    'win',
    'exp',
    'cur'
];

export const SkillElements = ResistanceElements.concat(
    'ail',
    'rec',
    'alm',
    'sup',
    'pas'
);

export const InheritElements = [
    'spe',
    'fir',
    'ice',
    'ele',
    'win',
    'exp',
    'cur',
    'alm',
    'phy',
    'gun',
    'ail',
    'lif',
    'man',
    'sup',
    'rec'
];

export const Ailments = [
    'bom',
    'cha',
    'fea',
    'mut',
    'par',
    'poi',
    'sle',
    'sto',
    'str'
];

export const BaseStats = [
    'hp', 'mp', 'st', 'ma', 'vi', 'ag', 'lu'
];

export const ResistanceLevels = [
    'wk', 'no', 'st', 'nu', 'rf', 'dr'
];

export const FusionTypes = {
    Normal: 'normal',
    Special: 'special',
    Accident: 'accident',
    Password: 'password',
    Excluded: 'excluded'
};

export const RaceOrder = getEnumOrder(Races);
export const PrimeOrder = getEnumOrder(PrimeElements);
export const SkillElementOrder = getEnumOrder(SkillElements);
export const InheritElementOrder = getEnumOrder(InheritElements.concat('non'));
export const ResistanceOrder = getEnumOrder(ResistanceLevels);

export const FUSION_SETTINGS_KEY = 'smtdsj-fusion-calculator-settings';
export const FUSION_SETTINGS_VERSION = 1709211400;
export const APP_TITLE = 'Shin Megami Tensei: Strange Journey Redux - Fusion Tool';
