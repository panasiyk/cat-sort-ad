import {Assets, type Texture} from 'pixi.js';
import {CatColor} from '../types';

const MANIFEST: Record<string, string> = {
    bg: '/back.png',
    overlay: '/overlay.png',
    shelves: '/shelves.png',
    button: '/Button.png',
    cta: '/Call to action.png',
    like: '/like.png',

    shelf_white: '/shelves/shelve_white.png',
    shelf_yellow: '/shelves/shelve_yellow.png',
    shelf_pink: '/shelves/shelve_pink.png',
    shelf_blue: '/shelves/shelve_blue.png',
    shelf_green: '/shelves/shelve_green.png',
    shelf_orange: '/shelves/shelve_orange.png',

    cat_idle_white: '/cats_idle/White_cat_idle.png',
    cat_idle_yellow: '/cats_idle/Yellow_cat_idle.png',
    cat_idle_pink: '/cats_idle/Pink_cat_idle.png',
    cat_idle_blue: '/cats_idle/Blue_cat_idle.png',
    cat_idle_green: '/cats_idle/Green_cat_idle.png',
    cat_idle_orange: '/cats_idle/Orange_Cat_idle.png',

    cat_select_white: '/cats_select/White_cat_select.png',
    cat_select_yellow: '/cats_select/Yellow_cat_select.png',
    cat_select_pink: '/cats_select/Pink_Cat_select.png',
    cat_select_blue: '/cats_select/Blue_cat_select.png',
    cat_select_green: '/cats_select/Green_Cat_select.png',
    cat_select_orange: '/cats_select/Orange_cat_select.png',

    cat_sleep_white: '/cats_sllep/White_Cat_sleep.png',
    cat_sleep_yellow: '/cats_sllep/Yellow_cat_sleep.png',
    cat_sleep_pink: '/cats_sllep/Pink_Cat_sleep.png',
    cat_sleep_blue: '/cats_sllep/Blue_cat_sleep.png',
    cat_sleep_green: '/cats_sllep/Green_Cat_sleep.png',
    cat_sleep_orange: '/cats_sllep/Orange_Cat_sleep.png',
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
