import React from 'react';
import './App.css';
import { Stage, Sprite } from '@pixi/react';
import { useMapMovement, chests } from './utils/map'; // Import the custom hook

const App: React.FC = () => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const { mapPosition, collectedChests } = useMapMovement(centerX, centerY);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} options={{ backgroundColor: 0x13171c }}>
      {/* Background map sprite */}
      <Sprite
        image={"public/map.png"} // Adjust the URL for your map image
        x={mapPosition.x}
        y={mapPosition.y}
        scale={2}
      />
      {/* Character sprite fixed in the center */}
      <Sprite
        image={"public/char.png"} // Adjust the URL for your character image
        x={centerX}
        y={centerY}
        anchor={0.5}
        scale={1}
      />
      {/* Chests */}
      {chests.map((chest, index) => (
        !collectedChests.has(index) && (
          <Sprite
            key={index}
            image={"public/chest.png"} // Adjust the URL for your chest image
            x={mapPosition.x + chest.x}
            y={mapPosition.y + chest.y}
            width={chest.width}
            height={chest.height}
          />
        )
      ))}
    </Stage>
  );
};

export default App;
