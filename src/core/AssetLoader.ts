import {Assets, type Texture} from 'pixi.js';
import {CatColor} from '../types';

import bgUrl from '../../assets_png/back.png';
import overlayUrl from '../../assets_png/overlay.png';
import shelvesUrl from '../../assets_png/shelves.png';
import buttonUrl from '../../assets_png/Button.png';
import ctaUrl from '../../assets_png/Call to action.png';
import likeUrl from '../../assets_png/like.png';

import shelfWhiteUrl from '../../assets_png/shelves/shelve_white.png';
import shelfYellowUrl from '../../assets_png/shelves/shelve_yellow.png';
import shelfPinkUrl from '../../assets_png/shelves/shelve_pink.png';
import shelfBlueUrl from '../../assets_png/shelves/shelve_blue.png';
import shelfGreenUrl from '../../assets_png/shelves/shelve_green.png';
import shelfOrangeUrl from '../../assets_png/shelves/shelve_orange.png';

import catIdleWhiteUrl from '../../assets_png/cats idle/White_cat_idle.png';
import catIdleYellowUrl from '../../assets_png/cats idle/Yellow_cat_idle.png';
import catIdlePinkUrl from '../../assets_png/cats idle/Pink_cat_idle.png';
import catIdleBlueUrl from '../../assets_png/cats idle/Blue_cat_idle.png';
import catIdleGreenUrl from '../../assets_png/cats idle/Green_cat_idle.png';
import catIdleOrangeUrl from '../../assets_png/cats idle/Orange_Cat_idle.png';

import catSelectWhiteUrl from '../../assets_png/cats select/White_cat_select.png';
import catSelectYellowUrl from '../../assets_png/cats select/Yellow_cat_select.png';
import catSelectPinkUrl from '../../assets_png/cats select/Pink_Cat_select.png';
import catSelectBlueUrl from '../../assets_png/cats select/Blue_cat_select.png';
import catSelectGreenUrl from '../../assets_png/cats select/Green_Cat_select.png';
import catSelectOrangeUrl from '../../assets_png/cats select/Orange_cat_select.png';

import catSleepWhiteUrl from '../../assets_png/cats sllep/White_Cat_sleep.png';
import catSleepYellowUrl from '../../assets_png/cats sllep/Yellow_cat_sleep.png';
import catSleepPinkUrl from '../../assets_png/cats sllep/Pink_Cat_sleep.png';
import catSleepBlueUrl from '../../assets_png/cats sllep/Blue_cat_sleep.png';
import catSleepGreenUrl from '../../assets_png/cats sllep/Green_Cat_sleep.png';
import catSleepOrangeUrl from '../../assets_png/cats sllep/Orange_Cat_sleep.png';

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
