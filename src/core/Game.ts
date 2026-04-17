import {Application} from 'pixi.js';
import {AssetLoader} from './AssetLoader';
import {GameScene} from '../scenes/GameScene';
import {WinScene} from '../scenes/WinScene';
import {cleanupTweenBridge, initTweenBridge} from '../utils/TweenBridge';

export class Game {
    private app!: Application;
    private gameScene!: GameScene;
    private winScene!: WinScene;

    async init(container: HTMLElement): Promise<void> {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        this.app = new Application();
        await this.app.init({
            width: screenW,
            height: screenH,
            backgroundColor: 0x1a1a2e,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        container.appendChild(this.app.canvas);

        initTweenBridge();

        const loader = new AssetLoader();
        await loader.load();

        this.winScene = new WinScene(loader, screenW, screenH);

        this.gameScene = new GameScene(loader, screenW, screenH, () => {
            this.gameScene.eventMode = 'none';
            this.gameScene.stopPeriodicAnims();
            this.winScene.show();
        });
        this.gameScene.build();

        this.app.stage.addChild(this.gameScene);
        this.app.stage.addChild(this.winScene);
    }

    destroy(): void {
        cleanupTweenBridge();
        this.app?.destroy(true);
    }
}
