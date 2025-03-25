import React, { useEffect, useRef, useState } from 'react';

const WebStatistics = () => {
    const stats = [
        { icon: "👥", target: 15942, text: "Registered Users", fixed: true },
        { icon: "✅", target: 1446214, text: "User Completed Tasks" }, // Updated text
        { icon: "📊", target: 63531163, text: "Visits This Month" },
        { icon: "💰", target: 79711 * 70, text: "Total Withdrawal (₹)" },
    ];

    const [counts, setCounts] = useState(stats.map(stat => (stat.fixed ? stat.target : 0)));
    const [stats_state, setStats_state] = useState(stats);
    const [isVisible, setIsVisible] = useState(false);

    const fetchUserStatistics = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/userRoute/userWebstatisticsGet`);
            if (response.ok) {
                const data = await response.json();
                const updatedCounts = stats.map(stat => {
                    if (stat.fixed) {
                        return { ...stat, target: data.users };
                    } else if (stat.text === "Total Withdrawal (₹)") {
                        return { ...stat, target: data.totalWithdrawalAmount };
                    }
                    return stat;
                });

                setStats_state(updatedCounts);
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const statsRef = useRef(null);
    useEffect(() => {
        fetchUserStatistics()
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let maxDuration = 2000; // Animation duration in ms
        let steps = 50; // Number of steps to reach the target
        let intervalTime = maxDuration / steps;

        let finalCounts = stats_state.map(stat => stat.target);
        let increments = finalCounts.map(target => Math.ceil(target / steps));

        let currentCounts = Array(stats_state.length).fill(0);

        let interval = setInterval(() => {
            let updatedCounts = currentCounts.map((count, i) => {
                let newCount = count + increments[i];
                return newCount >= finalCounts[i] ? finalCounts[i] : newCount;
            });

            setCounts(updatedCounts);
            currentCounts = updatedCounts;

            if (updatedCounts.every((count, i) => count === finalCounts[i])) {
                clearInterval(interval);
            }
        }, intervalTime);

        return () => clearInterval(interval);

    }, [isVisible, stats_state]);

    return (
        <section ref={statsRef} className="my-5 mx-2 text-center rounded-md p-4 md:p-5 bg-white shadow-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {stats.map((stat, index) => (
                    <div key={index} className="p-5 bg-gray-100 rounded-lg shadow-md flex flex-col items-center">
                        <span className="text-4xl">{stat.icon}</span>
                        <h3 className="text-2xl font-bold text-blue-700 mt-2">
                            {counts[index].toLocaleString()}+
                        </h3>
                        <p className="text-gray-600">{stat.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default WebStatistics;
