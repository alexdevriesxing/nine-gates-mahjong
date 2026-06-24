import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { SolitaireGameScene } from './scenes/SolitaireGameScene';
import eventBus from './EventBus';

interface PhaserGameProps {
  mode?: string;
}

export default function PhaserGame({ mode = 'solitaire' }: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: any;

    if (containerRef.current && !gameRef.current) {
      // Delay initialization slightly to ensure the browser has completed layout reflow
      // and containerRef.current has a non-zero width/height.
      timer = setTimeout(() => {
        if (!containerRef.current || gameRef.current) return;

        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          parent: containerRef.current,
          width: 1200,
          height: 800,
          backgroundColor: 'transparent',
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
          },
          scene: [SolitaireGameScene]
        };

        gameRef.current = new Phaser.Game(config);

        gameRef.current.events.on('ready', () => {
          eventBus.emit('scene-awake');
        });
      }, 150);
    }

    return () => {
      clearTimeout(timer);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[800px] max-h-[80vh] rounded-2xl overflow-hidden border border-gold/20 shadow-2xl bg-ink-950/50 backdrop-blur-md" 
    />
  );
}
