import {Container, Sprite} from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import {CatColor, CatState} from '../types';
import {assetKey, AssetLoader} from '../core/AssetLoader';
import {CAT_FLOAT_EXTRA_Y, CAT_SCALE, FLY_DURATION_MS, SELECT_ANIM_MS} from '../constants';

export class Cat extends Container {
    readonly color: CatColor;

    private _state: CatState = CatState.Idle;
    private sprite: Sprite;
    private loader: AssetLoader;

    private cancelActiveTween: (() => void) | null = null;

    private homeX = 0;
    private homeY = 0;

    constructor(color: CatColor, loader: AssetLoader) {
        super();
        this.color = color;
        this.loader = loader;

        this.sprite = new Sprite(loader.get(assetKey('cat_idle', color)));
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(CAT_SCALE);
        this.addChild(this.sprite);

        this.eventMode = 'static';
        this.cursor = 'pointer';
    }

    get state(): CatState {
        return this._state;
    }

    setHome(x: number, y: number): void {
        this.homeX = x;
        this.homeY = y;
        this.x = x;
        this.y = y;
    }

    select(): void {
        if (this._state === CatState.Sleeping) return;
        this._state = CatState.Selected;
        this.sprite.texture = this.loader.get(assetKey('cat_select', this.color));

        this.stopTween();
        const pos = {x: this.x, y: this.y};
        const tween = new TWEEN.Tween(pos)
            .to({y: this.homeY + CAT_FLOAT_EXTRA_Y}, SELECT_ANIM_MS)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.x = pos.x;
                this.y = pos.y;
            })
            .start();
        this.cancelActiveTween = () => tween.stop();
    }

    deselect(): void {
        if (this._state === CatState.Sleeping) return;
        this._state = CatState.Idle;
        this.sprite.texture = this.loader.get(assetKey('cat_idle', this.color));

        this.stopTween();
        const pos = {x: this.x, y: this.y};
        const tween = new TWEEN.Tween(pos)
            .to({x: this.homeX, y: this.homeY}, SELECT_ANIM_MS)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(() => {
                this.x = pos.x;
                this.y = pos.y;
            })
            .start();
        this.cancelActiveTween = () => tween.stop();
    }

    flyTo(targetX: number, targetY: number, onComplete: () => void): void {
        this._state = CatState.Idle;
        this.sprite.texture = this.loader.get(assetKey('cat_idle', this.color));

        const startX = this.x;
        const startY = this.y;
        const midX = (startX + targetX) / 2;
        const arcApexY = Math.min(startY, targetY) - 90;

        this.stopTween();
        const p = {t: 0};
        const tween = new TWEEN.Tween(p)
            .to({t: 1}, FLY_DURATION_MS)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(() => {
                const t = p.t;
                const inv = 1 - t;
                this.x = inv * inv * startX + 2 * inv * t * midX + t * t * targetX;
                this.y = inv * inv * startY + 2 * inv * t * arcApexY + t * t * targetY;
            })
            .onComplete(() => {
                this.x = targetX;
                this.y = targetY;
                this.homeX = targetX;
                this.homeY = targetY;
                onComplete();
            })
            .start();
        this.cancelActiveTween = () => tween.stop();
    }

    sleep(): void {
        this.stopTween();
        this._state = CatState.Sleeping;
        this.sprite.texture = this.loader.get(assetKey('cat_sleep', this.color));
        this.x = this.homeX;
        this.y = this.homeY;
        this.eventMode = 'none';
        this.cursor = 'default';
    }

    private stopTween(): void {
        this.cancelActiveTween?.();
        this.cancelActiveTween = null;
    }
}
