import * as TWEEN from '@tweenjs/tween.js';
import {Ticker} from 'pixi.js';

let tickerCallback: (() => void) | null = null;


export function initTweenBridge(): void {
    if (tickerCallback) return;
    tickerCallback = () => {
        TWEEN.update();
    };
    Ticker.shared.add(tickerCallback);
}

export function cleanupTweenBridge(): void {
    if (!tickerCallback) return;
    Ticker.shared.remove(tickerCallback);
    tickerCallback = null;
}
