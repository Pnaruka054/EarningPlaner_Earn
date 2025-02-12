import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ expireTime }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const targetTime = new Date(expireTime).getTime();

        // Function to update the countdown every second
        const countdown = () => {
            const currentTime = new Date().getTime();
            const difference = targetTime - currentTime;

            if (difference <= 0) {
                clearInterval(intervalId);
                setTimeLeft(0); // Timer expired
            } else {
                setTimeLeft(difference);
            }
        };

        // Start the countdown immediately
        countdown();

        // Update countdown every 1000ms (1 second)
        const intervalId = setInterval(countdown, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);

    }, [expireTime]); // Only run when expireTime prop changes

    // Function to format the time remaining
    const formatTime = (time) => {
        const hours = Math.floor(time / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (<p>{formatTime(timeLeft)}</p>);
};

export default CountdownTimer;
