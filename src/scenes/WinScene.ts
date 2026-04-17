import {Container, Graphics, Sprite} from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import {AssetLoader} from '../core/AssetLoader';
import {
    INSTALL_URL,
    WIN_BOUNCE_MS,
    WIN_BTN_SLIDE_OFFSET,
    WIN_BTN_TARGET_Y_OFFSET,
    WIN_LIKE_BOUNCE_SCALE,
    WIN_LIKE_DISPLAY_H,
    WIN_LIKE_OVERSHOOT,
    WIN_LIKE_SOURCE_H,
} from '../constants';

export class WinScene extends Container {
    constructor(private loader: AssetLoader, private screenW: number, private screenH: number) {
        super();
        this.visible = false;
    }

    show(): void {
        this.visible = true;
        this.removeChildren();
        this.addBlocker();
        this.addOverlay();
        this.addLike();
        this.addButton();
    }

    private addBlocker(): void {
        const blocker = new Graphics();
        blocker.rect(0, 0, this.screenW, this.screenH).fill({color: 0x000000, alpha: 0});
        blocker.eventMode = 'static';
        this.addChild(blocker);
    }

    private addOverlay(): void {
        const overlay = new Sprite(this.loader.get('overlay'));
        overlay.anchor.set(0, 0);
        overlay.width = this.screenW;
        overlay.height = this.screenH;
        overlay.alpha = 0;
        this.addChild(overlay);

        const a = {v: 0};
        new TWEEN.Tween(a)
            .to({v: 1}, 400)
            .onUpdate(() => {
                overlay.alpha = a.v;
            })
            .start();
    }

    private addLike(): void {
        const like = new Sprite(this.loader.get('like'));
        like.anchor.set(0.5);
        like.x = this.screenW / 2;
        like.y = this.screenH / 2 - 60;

        const targetScale = WIN_LIKE_DISPLAY_H / WIN_LIKE_SOURCE_H;
        like.scale.set(0);
        like.alpha = 0;
        this.addChild(like);

        const intro = {s: 0, a: 0};
        new TWEEN.Tween(intro)
            .to({s: targetScale * WIN_LIKE_OVERSHOOT, a: 1}, 350)
            .delay(250)
            .easing(TWEEN.Easing.Back.Out)
            .onUpdate(() => {
                like.scale.set(intro.s);
                like.alpha = intro.a;
            })
            .onComplete(() => {
                like.scale.set(targetScale);
                like.alpha = 1;
                this.startLikeLoop(like, targetScale);
            })
            .start();
    }

    private startLikeLoop(like: Sprite, baseScale: number): void {
        const state = {s: baseScale};

        const up = new TWEEN.Tween(state)
            .to({s: baseScale * WIN_LIKE_BOUNCE_SCALE}, WIN_BOUNCE_MS / 2)
            .easing(TWEEN.Easing.Sinusoidal.Out);
        const down = new TWEEN.Tween(state)
            .to({s: baseScale}, WIN_BOUNCE_MS / 2)
            .easing(TWEEN.Easing.Sinusoidal.In);
        up.chain(down);
        down.chain(up);

        up.onUpdate(() => like.scale.set(state.s));
        down.onUpdate(() => like.scale.set(state.s));

        up.start();
    }

    private addButton(): void {
        const btn = new Sprite(this.loader.get('button'));
        btn.anchor.set(0.5);
        btn.x = this.screenW / 2;
        btn.scale.set(300 / 499);

        const targetY = this.screenH - WIN_BTN_TARGET_Y_OFFSET;
        btn.y = this.screenH + WIN_BTN_SLIDE_OFFSET;
        btn.alpha = 0;
        this.addChild(btn);

        const pos = {y: this.screenH + WIN_BTN_SLIDE_OFFSET, a: 0};
        new TWEEN.Tween(pos)
            .to({y: targetY, a: 1}, 500)
            .delay(450)
            .easing(TWEEN.Easing.Back.Out)
            .onUpdate(() => {
                btn.y = pos.y;
                btn.alpha = pos.a;
            })
            .start();

        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.on('pointertap', () => {
            window.open(INSTALL_URL, '_blank');
        });
    }
}
