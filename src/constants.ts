import {CatColor, type RowDef} from './types';

export const CANVAS_W = 390;

export const ROW_DEFS: RowDef[] = [
    {color: CatColor.White, shelfCount: 1, catCount: 1},
    {color: CatColor.Yellow, shelfCount: 2, catCount: 2},
    {color: CatColor.Pink, shelfCount: 3, catCount: 3},
    {color: CatColor.Blue, shelfCount: 4, catCount: 4},
    {color: CatColor.Green, shelfCount: 5, catCount: 5},
    {color: CatColor.Orange, shelfCount: 6, catCount: 5},
];

export const SHELF_TILE_SCALE = 0.386;
export const SHELF_TILE_W = Math.round(140 * SHELF_TILE_SCALE);
export const SHELF_TILE_H = Math.round(175 * SHELF_TILE_SCALE);
export const SHELF_GAP = 4;
export const SHELF_LEFT_MARGIN = 10;
export const SHELF_ROW_START_Y = 155;
export const SHELF_ROW_STEP_Y = 76;

export const CAT_SIT_OFFSET_Y = SHELF_TILE_H * 0.25;
export const CAT_FLOAT_EXTRA_Y = 0;
export const CAT_SCALE = 0.214;

export const FLY_DURATION_MS = 480;
export const SELECT_ANIM_MS = 180;
export const WIN_BOUNCE_MS = 550;

export const CTA_INTERVAL_MS = 5000;
export const CTA_PULSE_SCALE = 1.08;
export const CTA_PULSE_DURATION_MS = 140;

export const BTN_INTERVAL_MS = 3000;
export const BTN_PULSE_SCALE = 1.10;
export const BTN_PULSE_DURATION_MS = 110;

export const CTA_WIDTH_RATIO = 0.765;
export const BTN_WIDTH_RATIO = 0.45;

export const WIN_LIKE_DISPLAY_H = 190;
export const WIN_LIKE_SOURCE_H = 705;
export const WIN_LIKE_OVERSHOOT = 1.15;
export const WIN_LIKE_BOUNCE_SCALE = 1.12;
export const WIN_BTN_SLIDE_OFFSET = 100;
export const WIN_BTN_TARGET_Y_OFFSET = 90;

export const INSTALL_URL = 'https://smartproject.com/';

export const CTA_SOURCE_W = 872;
export const CTA_SOURCE_H = 144;
export const BTN_SOURCE_W = 499;
export const BTN_SOURCE_H = 189;

export const GAME_CONTENT_TOP_Y = SHELF_ROW_START_Y - SHELF_TILE_H / 2 - 8;
export const GAME_CONTENT_BOT_Y = SHELF_ROW_START_Y + 5 * SHELF_ROW_STEP_Y + SHELF_TILE_H / 2 + 8;

export const GAME_MAX_SCALE = 2.0;
export const GAME_SIDE_PAD = 12;
export const GAME_VERT_GAP = 8;
export const CTA_TOP_PAD = 55;
export const BTN_BOTTOM_PAD = 50;
