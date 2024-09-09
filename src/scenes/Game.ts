import { Scene } from 'phaser';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    constructor() {
        super('Game');
    }

    preload() {
        // Load the character sprite
        this.load.spritesheet('character', 'assets/char/down.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        // Add character sprite to the scene
        this.character = this.physics.add.sprite(400, 300, 'character');

        // Define character animations
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Play animation
        this.character.play('walk');

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }

    update() {
        // Handle character movement (basic example)
        const cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left?.isDown) {
            this.character.setVelocityX(-100);
            this.character.anims.play('walk', true);
        } else if (cursors.right?.isDown) {
            this.character.setVelocityX(100);
            this.character.anims.play('walk', true);
        } else {
            this.character.setVelocityX(0);
            this.character.anims.stop();
        }
    }
}