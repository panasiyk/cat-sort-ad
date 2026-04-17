export enum CatColor {
    White = 'white',
    Yellow = 'yellow',
    Pink = 'pink',
    Blue = 'blue',
    Green = 'green',
    Orange = 'orange',
}

export enum CatState {
    Idle = 'idle',
    Selected = 'selected',
    Sleeping = 'sleeping',
}

export interface RowDef {
    color: CatColor;
    shelfCount: number;
    catCount: number;
}
