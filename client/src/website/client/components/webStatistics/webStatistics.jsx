import React, { useEffect, useRef, useState } from 'react';

const WebStatistics = () => {
    const stats = [
        { icon: "👥", target: 15942, text: "Registered Users", fixed: true },
        { icon: "🔗", target: 1446214, text: "Users Created URL" },
        { icon: "📊", target: 63531163, text: "Visits This Month" },
        { icon: "💰", target: 79711 * 83, text: "Total Withdrawal (₹)" }, // Dollar to INR (₹)
    ];

    const [counts, setCounts] = useState(stats.map(stat => (stat.fixed ? stat.target : 0)));
    const [stats_state, setStats_state] = useState(stats);
    const [isVisible, setIsVisible] = useState(false);

    const fetchUserStatistics = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/userRoute/userWebstatisticsGet`);
            if (response.ok) {
                const data = await response.json();
                const updatedCounts = stats.map(stat =>
                    stat.fixed ? { ...stat, target: data.users } : stat
                );
                setStats_state(updatedCounts);
            } else {
                console.log("Unexpected response:", response);
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

        const intervals = stats_state.map((stat, index) => {
            let start = 0;
            const increment = Math.ceil(stat.target / 100); // Increment speed
            const interval = setInterval(() => {
                start += increment;
                if (start >= stat.target) {
                    start = stat.target;
                    clearInterval(interval);
                }
                setCounts(prevCounts => {
                    const newCounts = [...prevCounts];
                    newCounts[index] = start;
                    return newCounts;
                });
            }, 30);
            return interval;
        });

        return () => intervals.forEach(interval => clearInterval(interval));
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
