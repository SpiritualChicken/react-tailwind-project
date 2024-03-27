import SideBar from './SideBar';
import TopNavigation from './TopNavigation';
import DisplayTattoo from './DisplayTattoo';
import React, { useState, useEffect, useRef } from 'react';


const tattoosData = [
  { UserName: 'User1', likes: 10, saves: 5 },
  { UserName: 'User2', likes: 20, saves: 8 },
  { UserName: 'User3', likes: 50, saves: 20 },
  { UserName: 'User4', likes: 100, saves: 60 },
  { UserName: 'User5', likes: 400, saves: 20 },
  { UserName: 'Charlie100', likes: 425, saves: 30 },
  { UserName: 'maddy100', likes: 545, saves: 20 },
  { UserName: 'Luke', likes: 30, saves: 8 },
  { UserName: 'Will', likes: 45, saves: 4 },
  { UserName: 'Lola', likes: 1000, saves: 100 },
  { UserName: 'Rafferty', likes: 1200, saves: 500 },



  
  // Add more tattoo data as needed
];


function HomePage() {
  const [displayCount, setDisplayCount] = useState(10); // Number of items to display initially
  const [loadMoreVisible, setLoadMoreVisible] = useState(true); // Flag to control the visibility of the "Load More" button
  const [tattoos, setTattoos] = useState(tattoosData); // State to hold tattoo data
  const loadMoreTriggerRef = useRef(null); // Reference to the load more trigger element

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loadMoreVisible) {
          // Regenerate tattoo data when the bottom of the page is reached
          setTattoos([...tattoos, ...tattoosData]);
          setDisplayCount(displayCount + 10);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreTriggerRef.current) {
      observer.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (loadMoreTriggerRef.current) {
        observer.unobserve(loadMoreTriggerRef.current);
      }
    };
  }, [loadMoreVisible, displayCount, tattoos]);

  useEffect(() => {
    if (displayCount >= tattoos.length) {
      setLoadMoreVisible(false);
    } else {
      setLoadMoreVisible(true);
    }
  }, [displayCount, tattoos]);

  return (
    <div className='flex'>
      <SideBar />
      <div className='content-container'>
        <TopNavigation />
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 pr-20'>
          {/* Use slice to display only the first `displayCount` items */}
          {tattoos.slice(0, displayCount).map((tattoo, index) => (
            <DisplayTattoo key={index} {...tattoo} />
          ))}
        </div>
        {/* Use a <div> element as the loadMoreTrigger */}
        <div id="loadMoreTrigger" ref={loadMoreTriggerRef} className="h-8"></div>
      </div>
    </div>
  );
}

export default HomePage;