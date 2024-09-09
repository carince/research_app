import { useEffect, useState, useRef } from 'react';
import { checkCollision } from './collisions';

const collisionBoxes = [
    { x: 50, y: 50, width: 200, height: 50 },
    { x: 300, y: 200, width: 100, height: 100 },
    // Add more boxes as needed
];

const CHEST_WIDTH = 50;
const CHEST_HEIGHT = 50;

export const chests = [
    { x: 300, y: 400, width: CHEST_WIDTH, height: CHEST_HEIGHT },
    { x: 550, y: 900, width: CHEST_WIDTH, height: CHEST_HEIGHT },
    { x: 200, y: 1000, width: CHEST_WIDTH, height: CHEST_HEIGHT },
    { x: 850, y: 800, width: CHEST_WIDTH, height: CHEST_HEIGHT },
    { x: 1650, y: 1000, width: CHEST_WIDTH, height: CHEST_HEIGHT },
    // Add more chests as needed
];

export function useMapMovement(initialX: number, initialY: number): { mapPosition: { x: number, y: number }, collectedChests: Set<number> } {
    const [mapPosition, setMapPosition] = useState<{ x: number, y: number }>({ x: initialX, y: initialY });
    const [collectedChests, setCollectedChests] = useState<Set<number>>(new Set());
    const keysPressed = useRef<{ [key: string]: boolean }>({});
    const animationFrameId = useRef<number>();
    const [isSprinting, setIsSprinting] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            keysPressed.current[event.key] = true;

            if (event.key === 'Shift') {
                setIsSprinting(true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            keysPressed.current[event.key] = false;

            if (event.key === 'Shift') {
                setIsSprinting(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        const moveMap = () => {
            setMapPosition((prev) => {
                const speed = isSprinting ? 10 : 5; // Increase speed when sprinting
                let newX = prev.x;
                let newY = prev.y;

                // Determine direction based on currently pressed keys
                let moveX = 0;
                let moveY = 0;

                if (keysPressed.current['s']) moveY -= speed; // Move up
                if (keysPressed.current['w']) moveY += speed; // Move down
                if (keysPressed.current['d']) moveX -= speed; // Move left
                if (keysPressed.current['a']) moveX += speed; // Move right

                // Ensure only one direction is processed at a time
                if (moveX !== 0 && moveY !== 0) {
                    // Prefer horizontal or vertical movement if both are pressed
                    moveX = 0;
                }

                newX += moveX;
                newY += moveY;

                const playerRect = {
                    x: window.innerWidth / 2 - CHEST_WIDTH / 2,
                    y: window.innerHeight / 2 - CHEST_HEIGHT / 2,
                    width: CHEST_WIDTH,
                    height: CHEST_HEIGHT,
                };

                const mapRect = {
                    x: newX,
                    y: newY,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };

                let validX = newX;
                let validY = newY;

                collisionBoxes.forEach((box) => {
                    if (checkCollision(mapRect, box)) {
                        if (newX < 0) validX = Math.max(newX, box.x - mapRect.width);
                        if (newX > window.innerWidth - mapRect.width) validX = Math.min(newX, box.x + box.width);
                        if (newY < 0) validY = Math.max(newY, box.y - mapRect.height);
                        if (newY > window.innerHeight - mapRect.height) validY = Math.min(newY, box.y + box.height);
                    }
                });

                chests.forEach((chest, index) => {
                    const chestRect = {
                        x: chest.x + validX,
                        y: chest.y + validY,
                        width: CHEST_WIDTH,
                        height: CHEST_HEIGHT,
                    };

                    if (checkCollision(playerRect, chestRect)) {
                        setCollectedChests((prev) => new Set(prev.add(index)));
                    }
                });

                return { x: validX, y: validY };
            });

            animationFrameId.current = requestAnimationFrame(moveMap);
        };

        animationFrameId.current = requestAnimationFrame(moveMap);

        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [isSprinting]);

    return { mapPosition, collectedChests };
}
