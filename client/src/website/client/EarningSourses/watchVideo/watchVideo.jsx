import React, { useEffect } from 'react';

const WatchVideo = () => {
    useEffect(() => {
        const observer = new MutationObserver((mutationsList, observer) => {
            // Check if any new element with class 'video_slider' is added
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('video_slider')) {
                        // Agar element mil jata hai, toh function call karo
                        yourFunction();
                    }
                });
            });
        });

        // Observe the document body for added nodes (elements)
        observer.observe(document.body, {
            childList: true, // Look for added or removed children
            subtree: true, // Observe the entire DOM tree
        });

        // Cleanup observer when component unmounts
        return () => {
            observer.disconnect();
        };
    }, []);

    const yourFunction = () => {
        console.log('video_slider class wala element dynamically added!');
        let demo = document.getElementsByClassName('video_slider')[0]
        demo.removeAttribute('class')
        demo.removeAttribute('style')
        demo.children[0].style.display = 'none'
        demo.children[2].style.width = '100%'
        demo.children[2].style.height = '100%'
        let demo1 = document.getElementById('demo')
        demo1.appendChild(demo)
        console.log(demo, 'nul');
    };
    return (
        <div className='ml-auto flex flex-col justify-between  bg-[#ecf0f5] select-none w-full md:w-[75%] lg:w-[80%] overflow-auto h-[94vh] mt-12'>
            <div id="demo" style="background-color: red; padding: 20px;"></div>
        </div>
    );
}

export default WatchVideo;
