import SideBar from './SideBar';
import TopNavigation from './TopNavigation';
import DisplayTattoo from './DisplayTattoo';


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
  
  // Add more tattoo data as needed
];


function HomePage() {
  return (
    
    <div className='flex'>
      <SideBar />
      <div className='content-container' >
      <TopNavigation />
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 pr-20 '>
          {tattoosData.map((tattoo, index) => (
            <DisplayTattoo key={index} {...tattoo} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;