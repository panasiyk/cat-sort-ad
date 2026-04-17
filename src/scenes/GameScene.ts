import {Container, Sprite} from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';
import {CatColor, CatState} from '../types';
import {AssetLoader} from '../core/AssetLoader';
import {Shelf} from '../entity/Shelf';
import {Cat} from '../entity/Cat';
import {ShelfRow} from '../entity/ShelfRow';
import {
    BTN_BOTTOM_PAD,
    BTN_INTERVAL_MS,
    BTN_PULSE_DURATION_MS,
    BTN_PULSE_SCALE,
    BTN_SOURCE_H,
    BTN_SOURCE_W,
    BTN_WIDTH_RATIO,
    CANVAS_W,
    CAT_SIT_OFFSET_Y,
    CTA_INTERVAL_MS,
    CTA_PULSE_DURATION_MS,
    CTA_PULSE_SCALE,
    CTA_SOURCE_H,
    CTA_SOURCE_W,
    CTA_TOP_PAD,
    CTA_WIDTH_RATIO,
    GAME_CONTENT_BOT_Y,
    GAME_CONTENT_TOP_Y,
    GAME_MAX_SCALE,
    GAME_SIDE_PAD,
    GAME_VERT_GAP,
    INSTALL_URL,
    ROW_DEFS,
    SHELF_GAP,
    SHELF_LEFT_MARGIN,
    SHELF_ROW_START_Y,
    SHELF_ROW_STEP_Y,
    SHELF_TILE_W,
} from '../constants';

export class GameScene extends Container {
    private rows: ShelfRow[] = [];
    private allShelves: Shelf[] = [];
    private allCats: Cat[] = [];

    private shelfToCat = new Map<Shelf, Cat>();
    private catToShelf = new Map<Cat, Shelf>();

    private selectedCat: Cat | null = null;
    private completedRows = new Set<ShelfRow>();

    private gameContainer = new Container();
    private shelvesContainer = new Container();
    private catsContainer = new Container();

    private ctaSprite!: Sprite;
    private btnSprite!: Sprite;

    private stopCtaAnim: (() => void) | null = null;
    private stopBtnAnim: (() => void) | null = null;

    constructor(private loader: AssetLoader, private screenW: number, private screenH: number, private onWin: () => void) {
        super();
    }

    build(): void {
        this.addBackground();

        this.gameContainer.addChild(this.shelvesContainer);
        this.gameContainer.addChild(this.catsContainer);
        this.addChild(this.gameContainer);

        this.buildRows();
        this.spawnAndScrambleCats();
        this.addUI();
        this.layoutGameContainer();
        this.startPeriodicAnims();
    }

    stopPeriodicAnims(): void {
        this.stopCtaAnim?.();
        this.stopBtnAnim?.();
        this.stopCtaAnim = null;
        this.stopBtnAnim = null;
    }

    private addBackground(): void {
        const bg = new Sprite(this.loader.get('bg'));
        bg.anchor.set(0, 0);
        bg.width = this.screenW;
        bg.height = this.screenH;
        this.addChild(bg);
    }

    private buildRows(): void {
        const firstX = SHELF_LEFT_MARGIN + SHELF_TILE_W / 2;

        ROW_DEFS.forEach((def, rowIndex) => {
            const centerY = SHELF_ROW_START_Y + rowIndex * SHELF_ROW_STEP_Y;
            const shelves: Shelf[] = [];

            for (let col = 0; col < def.shelfCount; col++) {
                const shelf = new Shelf(def.color, rowIndex, col, this.loader);
                shelf.x = firstX + col * (SHELF_TILE_W + SHELF_GAP);
                shelf.y = centerY;
                shelves.push(shelf);
                this.allShelves.push(shelf);
                this.shelvesContainer.addChild(shelf);

                shelf.on('pointertap', (e) => {
                    e.stopPropagation();
                    this.handleShelfTap(shelf);
                });
            }

            this.rows.push(new ShelfRow(def, shelves));
        });
    }

    private spawnAndScrambleCats(): void {
        ROW_DEFS.forEach(def => {
            for (let i = 0; i < def.catCount; i++) {
                const cat = new Cat(def.color, this.loader);
                this.allCats.push(cat);
                this.catsContainer.addChild(cat);
                cat.on('pointertap', (e) => {
                    e.stopPropagation();
                    this.handleCatTap(cat);
                });
            }
        });

        const placementShelves: Shelf[] = [];
        this.rows.forEach((row, i) => {
            if (ROW_DEFS[i].color === CatColor.Orange) {
                const copy = [...row.shelves];
                const emptyIdx = Math.floor(Math.random() * copy.length);
                copy.splice(emptyIdx, 1);
                placementShelves.push(...copy);
            } else {
                placementShelves.push(...row.shelves);
            }
        });

        const cats = [...this.allCats];
        for (let i = cats.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cats[i], cats[j]] = [cats[j], cats[i]];
        }

        cats.forEach((cat, i) => {
            this.occupyShelf(cat, placementShelves[i]);
        });
    }

    private layoutGameContainer(): void {
        const sw = this.screenW;
        const sh = this.screenH;

        const ctaH = CTA_SOURCE_H * this.ctaSprite.scale.y;
        const ctaBottom = CTA_TOP_PAD + ctaH + GAME_VERT_GAP;

        const btnH = BTN_SOURCE_H * this.btnSprite.scale.y;
        const btnTop = sh - BTN_BOTTOM_PAD - btnH - GAME_VERT_GAP;

        const availW = sw - GAME_SIDE_PAD * 2;
        const availH = btnTop - ctaBottom;

        const gameNativeW = CANVAS_W;
        const gameNativeH = GAME_CONTENT_BOT_Y - GAME_CONTENT_TOP_Y;

        const scale = Math.min(availW / gameNativeW, availH / gameNativeH, GAME_MAX_SCALE);
        this.gameContainer.scale.set(scale);

        this.gameContainer.x = sw / 2 - (gameNativeW * scale) / 2;

        const centerY = ctaBottom + availH / 2;
        this.gameContainer.y = centerY - (GAME_CONTENT_TOP_Y + gameNativeH / 2) * scale;
    }

    private occupyShelf(cat: Cat, shelf: Shelf): void {
        shelf.occupied = true;
        this.shelfToCat.set(shelf, cat);
        this.catToShelf.set(cat, shelf);
        cat.setHome(shelf.x, shelf.y + CAT_SIT_OFFSET_Y);
    }

    private vacateShelf(shelf: Shelf): void {
        shelf.occupied = false;
        this.shelfToCat.delete(shelf);
    }

    private handleCatTap(cat: Cat): void {
        if (cat.state === CatState.Sleeping) return;

        if (this.selectedCat === cat) {
            cat.deselect();
            this.selectedCat = null;
            return;
        }

        this.selectedCat?.deselect();
        this.selectedCat = cat;
        this.catsContainer.addChild(cat);
        cat.select();
    }

    private handleShelfTap(shelf: Shelf): void {
        if (!this.selectedCat) return;

        if (shelf.occupied) {
            const occupant = this.shelfToCat.get(shelf);
            if (occupant && occupant !== this.selectedCat)
                this.handleCatTap(occupant);
            return;
        }

        const cat = this.selectedCat;
        this.selectedCat = null;

        const oldShelf = this.catToShelf.get(cat);
        if (oldShelf) this.vacateShelf(oldShelf);

        shelf.occupied = true;
        this.shelfToCat.set(shelf, cat);
        this.catToShelf.set(cat, shelf);

        cat.flyTo(shelf.x, shelf.y + CAT_SIT_OFFSET_Y, () => {
            this.checkRowCompletion();
        });
    }

    private checkRowCompletion(): void {
        for (const row of this.rows) {
            if (this.completedRows.has(row)) continue;

            if (this.isRowComplete(row)) {
                this.completedRows.add(row);
                row.shelves.forEach(shelf => {
                    const cat = this.shelfToCat.get(shelf);
                    if (cat && cat.color === row.color) cat.sleep();
                });
            }
        }

        if (this.completedRows.size === this.rows.length) {
            const delay = {_: 0};
            new TWEEN.Tween(delay)
                .to({_: 1}, 500)
                .onComplete(() => this.onWin())
                .start();
        }
    }

    private isRowComplete(row: ShelfRow): boolean {
        let count = 0;
        for (const shelf of row.shelves) {
            const cat = this.shelfToCat.get(shelf);
            if (cat && cat.color === row.color && cat.state !== CatState.Selected)
                count++;
        }
        return count >= row.requiredCatCount;
    }

    private addUI(): void {
        const sw = this.screenW;
        const sh = this.screenH;

        this.ctaSprite = new Sprite(this.loader.get('cta'));
        this.ctaSprite.anchor.set(0.5);
        this.ctaSprite.x = sw / 2;
        this.ctaSprite.scale.set((sw * CTA_WIDTH_RATIO) / CTA_SOURCE_W);
        this.ctaSprite.y = CTA_TOP_PAD + (CTA_SOURCE_H * this.ctaSprite.scale.y) / 2;
        this.addChild(this.ctaSprite);

        this.btnSprite = new Sprite(this.loader.get('button'));
        this.btnSprite.anchor.set(0.5);
        this.btnSprite.x = sw / 2;
        this.btnSprite.scale.set((sw * BTN_WIDTH_RATIO) / BTN_SOURCE_W);
        this.btnSprite.y = sh - BTN_BOTTOM_PAD - (BTN_SOURCE_H * this.btnSprite.scale.y) / 2;
        this.btnSprite.eventMode = 'static';
        this.btnSprite.cursor = 'pointer';
        this.btnSprite.on('pointertap', () => {
            window.open(INSTALL_URL, '_blank');
        });
        this.addChild(this.btnSprite);
    }

    private startPeriodicAnims(): void {
        this.stopCtaAnim = this.schedulePeriodicAnim(
            CTA_INTERVAL_MS,
            () => this.animatePulse(this.ctaSprite, CTA_PULSE_SCALE, CTA_PULSE_DURATION_MS),
        );
        this.stopBtnAnim = this.schedulePeriodicAnim(
            BTN_INTERVAL_MS,
            () => this.animatePulse(this.btnSprite, BTN_PULSE_SCALE, BTN_PULSE_DURATION_MS),
        );
    }

    private schedulePeriodicAnim(intervalMs: number, callback: () => void): () => void {
        let cancelled = false;

        const schedule = () => {
            if (cancelled) return;
            const dummy = {_: 0};
            new TWEEN.Tween(dummy)
                .to({_: 1}, intervalMs)
                .onComplete(() => {
                    callback();
                    schedule();
                })
                .start();
        };

        schedule();
        return () => {
            cancelled = true;
        };
    }

    private animatePulse(sprite: Sprite, factor: number, durationMs: number): void {
        const baseX = sprite.scale.x;
        const baseY = sprite.scale.y;
        const s = {v: 1};
        new TWEEN.Tween(s)
            .to({v: factor}, durationMs)
            .easing(TWEEN.Easing.Quadratic.Out)
            .yoyo(true)
            .repeat(3)
            .onUpdate(() => {
                sprite.scale.set(baseX * s.v, baseY * s.v);
            })
            .onComplete(() => {
                sprite.scale.set(baseX, baseY);
            })
            .start();
    }
}
