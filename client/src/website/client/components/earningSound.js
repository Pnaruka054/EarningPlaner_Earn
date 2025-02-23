import success_sound from '../../../assets/success_earn.mp3'
import not_success_sound from '../../../assets/not_success_earn.mp3'

const earningSound = (track) => {
    if (track) {
        const audio = new Audio(success_sound);
        audio.play();
    } else {
        const audio = new Audio(not_success_sound);
        audio.play();
    }
};

export default earningSound