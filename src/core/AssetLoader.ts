import {Assets, type Texture} from 'pixi.js';
import {CatColor} from '../types';

import bgUrl from '/back.png';
import overlayUrl from '/overlay.png';
import shelvesUrl from '/shelves.png';
import buttonUrl from '/Button.png';
import ctaUrl from '/Call to action.png';
import likeUrl from '/like.png';

import shelfWhiteUrl from '/shelves/shelve_white.png';
import shelfYellowUrl from '/shelves/shelve_yellow.png';
import shelfPinkUrl from '/shelves/shelve_pink.png';
import shelfBlueUrl from '/shelves/shelve_blue.png';
import shelfGreenUrl from '/shelves/shelve_green.png';
import shelfOrangeUrl from '/shelves/shelve_orange.png';

import catIdleWhiteUrl from '/cats_idle/White_cat_idle.png';
import catIdleYellowUrl from '/cats_idle/Yellow_cat_idle.png';
import catIdlePinkUrl from '/cats_idle/Pink_cat_idle.png';
import catIdleBlueUrl from '/cats_idle/Blue_cat_idle.png';
import catIdleGreenUrl from '/cats_idle/Green_cat_idle.png';
import catIdleOrangeUrl from '/cats_idle/Orange_Cat_idle.png';

import catSelectWhiteUrl from '/cats_select/White_cat_select.png';
import catSelectYellowUrl from '/cats_select/Yellow_cat_select.png';
import catSelectPinkUrl from '/cats_select/Pink_Cat_select.png';
import catSelectBlueUrl from '/cats_select/Blue_cat_select.png';
import catSelectGreenUrl from '/cats_select/Green_Cat_select.png';
import catSelectOrangeUrl from '/cats_select/Orange_cat_select.png';

import catSleepWhiteUrl from '/cats_sllep/White_Cat_sleep.png';
import catSleepYellowUrl from '/cats_sllep/Yellow_cat_sleep.png';
import catSleepPinkUrl from '/cats_sllep/Pink_Cat_sleep.png';
import catSleepBlueUrl from '/cats_sllep/Blue_cat_sleep.png';
import catSleepGreenUrl from '/cats_sllep/Green_Cat_sleep.png';
import catSleepOrangeUrl from '/cats_sllep/Orange_Cat_sleep.png';

const MANIFEST: Record<string, string> = {
    bg: bgUrl,
    overlay: overlayUrl,
    shelves: shelvesUrl,
    button: buttonUrl,
    cta: ctaUrl,
    like: likeUrl,

    shelf_white: shelfWhiteUrl,
    shelf_yellow: shelfYellowUrl,
    shelf_pink: shelfPinkUrl,
    shelf_blue: shelfBlueUrl,
    shelf_green: shelfGreenUrl,
    shelf_orange: shelfOrangeUrl,

    cat_idle_white: catIdleWhiteUrl,
    cat_idle_yellow: catIdleYellowUrl,
    cat_idle_pink: catIdlePinkUrl,
    cat_idle_blue: catIdleBlueUrl,
    cat_idle_green: catIdleGreenUrl,
    cat_idle_orange: catIdleOrangeUrl,

    cat_select_white: catSelectWhiteUrl,
    cat_select_yellow: catSelectYellowUrl,
    cat_select_pink: catSelectPinkUrl,
    cat_select_blue: catSelectBlueUrl,
    cat_select_green: catSelectGreenUrl,
    cat_select_orange: catSelectOrangeUrl,

    cat_sleep_white: catSleepWhiteUrl,
    cat_sleep_yellow: catSleepYellowUrl,
    cat_sleep_pink: catSleepPinkUrl,
    cat_sleep_blue: catSleepBlueUrl,
    cat_sleep_green: catSleepGreenUrl,
    cat_sleep_orange: catSleepOrangeUrl,
};


type AssetPrefix = 'shelf' | 'cat_idle' | 'cat_select' | 'cat_sleep';

export function assetKey(prefix: AssetPrefix, color: CatColor): string {
    return `${prefix}_${color}`;
}


export class AssetLoader {
    async load(): Promise<void> {
        const bundle = Object.entries(MANIFEST).map(([alias, src]) => ({alias, src}));
        await Assets.load(bundle);
    }

    get(key: string): Texture {
        const tex = Assets.get<Texture>(key);
        if (!tex) throw new Error(`[AssetLoader] Texture not loaded: "${key}"`);
        return tex;
    }
}
