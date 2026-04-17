import {Container, Sprite} from 'pixi.js';
import {CatColor} from '../types';
import {assetKey, AssetLoader} from '../core/AssetLoader';
import {SHELF_TILE_SCALE} from '../constants';

export class Shelf extends Container {
    readonly color: CatColor;
    readonly row: number;
    readonly col: number;

    occupied = false;

    constructor(color: CatColor, row: number, col: number, loader: AssetLoader) {
        super();
        this.color = color;
        this.row = row;
        this.col = col;

        const sprite = new Sprite(loader.get(assetKey('shelf', color)));
        sprite.anchor.set(0.5);
        sprite.scale.set(SHELF_TILE_SCALE);
        this.addChild(sprite);

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }
}
