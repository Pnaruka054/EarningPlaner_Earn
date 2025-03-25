import React, { useEffect, useState } from 'react';

const SubscribeOurChannel = () => {
    const [channelData, setChannelData] = useState(null);


    const channelId = 'UCrJcJFwtn7LpA8HdW5BGbsw';
    const apiKey = 'AIzaSyAah4lGfFj_2a6jcofVFkzxAiI43Ajcyy0';
    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`);
                const data = await response.json();
                setChannelData(data.items[0]);
            } catch (error) {
                console.error('Error fetching channel data:', error);
            }
        };

        fetchChannelData();
        const interval = setInterval(fetchChannelData, 60000);
        return () => clearInterval(interval);
    }, [channelId, apiKey]);
    const updateCount = (newCount) => {
        return newCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    return (
        <section className="mt-5 mx-2 bg-white shadow-md rounded-lg p-4 md:p-8 border border-gray-200">
            {/* Title */}
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 relative inline-block">
                    Subscribe <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Our Channel</span>
                </h2>
            </div>
            {channelData && (
                <div className="mt-8 flex flex-col md:flex-row items-center gap-10">
                    {/* Channel Logo & Title */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative">
                            <img
                                src={channelData.snippet.thumbnails.default.url}
                                alt="Channel Logo"
                                className="w-32 h-32 rounded-full shadow-lg border-4 border-blue-500"
                            />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
                                LIVE
                            </span>
                        </div>
                        <h2 className="mt-3 text-xl font-semibold text-gray-800">{channelData.snippet.title}</h2>
                    </div>

                    {/* Stats & Subscribe Button */}
                    <div className="w-full md:w-auto flex flex-col items-center text-center bg-gray-100 p-6 rounded-lg shadow-lg">
                        <div className="text-gray-700 space-y-2 text-lg font-medium">
                            <p><strong>Subscribers:</strong> <span className="text-blue-600 font-semibold">{updateCount(channelData.statistics.subscriberCount)}</span></p>
                            <p><strong>Views:</strong> <span className="text-green-600 font-semibold">{updateCount(channelData.statistics.viewCount)}</span></p>
                            <p><strong>Videos:</strong> <span className="text-gray-900">{channelData.statistics.videoCount}</span></p>
                        </div>
                        <a
                            href={`https://www.youtube.com/channel/${channelId}?sub_confirmation=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 w-full md:w-auto bg-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300"
                        >
                            🔔 Subscribe
                        </a>
                    </div>


                    {/* Channel Description */}
                    <div className="flex-1">
                        <h5 className="text-lg font-semibold text-gray-700">Description:</h5>
                        <pre className="mt-2 text-gray-600 text-base leading-relaxed bg-gray-100 p-4 rounded-md shadow-inner whitespace-pre-wrap">
                            {channelData.snippet.description}
                        </pre>
                    </div>
                </div>
            )}
        </section>
    );
}

export default SubscribeOurChannel;
