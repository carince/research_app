// src/useMapMovement.ts
import { useEffect, useState, useRef } from 'react';

// Define the type for the map position
interface Position {
    x: number;
    y: number;
}

// Custom hook for map movement
export function useMapMovement(initialX: number, initialY: number): Position {
    const [mapPosition, setMapPosition] = useState<Position>({ x: initialX, y: initialY });
    const keysPressed = useRef<{ [key: string]: boolean }>({});
    const animationFrameId = useRef<number>();

    // Event handler for keyboard input
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            keysPressed.current[event.key] = true;
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            keysPressed.current[event.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Smooth movement with requestAnimationFrame and border detection
    useEffect(() => {
        const moveMap = () => {
            setMapPosition((prev) => {
                const speed = 10;
                let newX = prev.x;
                let newY = prev.y;

                console.log(keysPressed.current)

                // Move left and check if still within map boundaries
                if (keysPressed.current['a']) newX += speed;
                // Move right and check if still within map boundaries
                if (keysPressed.current['d']) newX -= speed;
                // Move up and check if still within map boundaries
                if (keysPressed.current['w']) newY += speed;
                // Move down and check if still within map boundaries
                if (keysPressed.current['s']) newY -= speed;

                return { x: newX, y: newY };
            });

            // Call moveMap again on the next frame
            animationFrameId.current = requestAnimationFrame(moveMap);
        };

        // Start the animation loop
        animationFrameId.current = requestAnimationFrame(moveMap);

        return () => {
            // Cancel the animation frame on component unmount
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, []);

    return mapPosition;
}
