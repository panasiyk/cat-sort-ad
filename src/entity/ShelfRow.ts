import {Container} from 'pixi.js';
import {CatColor, type RowDef} from '../types';
import {Shelf} from './Shelf';

export class ShelfRow extends Container {
    readonly color: CatColor;
    readonly shelves: Shelf[];
    readonly requiredCatCount: number;

    constructor(def: RowDef, shelves: Shelf[]) {
        super();
        this.color = def.color;
        this.requiredCatCount = def.catCount;
        this.shelves = shelves;
    }
}
