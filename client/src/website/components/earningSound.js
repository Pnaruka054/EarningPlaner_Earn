import success_sound from '../../../assets/success_earn.mp3';
import not_success_sound from '../../../assets/not_success_earn.mp3';

// Preload audio files for instant playback
const successAudio = new Audio(success_sound);
const notSuccessAudio = new Audio(not_success_sound);

const earningSound = (isChecked_state, track) => {
    if (!isChecked_state) return; // Agar disabled hai to return kar do

    // Choose the right audio
    const audio = track ? successAudio : notSuccessAudio;
    
    // Reset audio to start instantly
    audio.currentTime = 0;
    
    // Play and handle any browser restrictions
    audio.play().catch(error => console.error("Audio play failed:", error));
};

export default earningSound;
