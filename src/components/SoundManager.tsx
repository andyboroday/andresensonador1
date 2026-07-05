import { useEffect } from "react";

export default function SoundManager() {
  useEffect(() => {
    const audio = new Audio("/audio/ae_sound.mp3");

    audio.loop = true;
    audio.volume = 0.3;

    const startAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("pointerdown", startAudio);
    };

    window.addEventListener("pointerdown", startAudio);

    return () => {
      window.removeEventListener("pointerdown", startAudio);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return null;
}