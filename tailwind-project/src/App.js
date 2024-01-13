import SideBar from './components/SideBar';
import './App.css';
import TopNavigation from './components/TopNavigation';
import DisplayTattoo from './components/DisplayTattoo';


const tattoosData = [
  { UserName: 'User1', likes: 10, saves: 5 },
  { UserName: 'User2', likes: 20, saves: 8 },
  // Add more tattoo data as needed
];


function App() {
  return (
    
    <div className='flex'>
      <TopNavigation />
      <SideBar />
      <div className='flex flex-wrap justify-center'>
        {tattoosData.map((tattoo, index) => (
          <DisplayTattoo key={index} {...tattoo} />
        ))}
      </div>
    </div>
  );
}

export default App;
