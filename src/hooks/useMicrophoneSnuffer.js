// useMicrophoneSnuffer.js aggiornato
import { useEffect, useRef, useState } from "react";

export default function useMicrophoneSnuffer(onSnuff, threshold = 0.25) {
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256; // Piccola dimensione per performance

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const checkVolume = () => {
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calcola il volume medio
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length / 255; // Normalizzato 0-1

        if (average > threshold) {
          onSnuff();
          stopListening();
        } else {
          animationFrameRef.current = requestAnimationFrame(checkVolume);
        }
      };

      setIsListening(true);
      checkVolume();
    } catch (err) {
      console.error("Errore microfono:", err);
    }
  };

  const stopListening = () => {
    // Controlla che il contesto esista e sia aperto prima di provare a chiuderlo
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
        analyserRef.current = null;
        setIsListening(false);
      });
    }
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  return { isListening, startListening, stopListening };
}
