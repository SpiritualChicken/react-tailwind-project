import defaultTattoo from '../assets/tattooPlaceholder.png';
import { CiHeart } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaUserCircle, } from 'react-icons/fa';




function DisplayTattoo({ UserName, likes, saves }) {
    return (
      <div className='content-list ; '>
        <div className="bg-white rounded-md shadow-md p-4 m-2  hover:cursor-pointer hover:transform hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-300 ease-in-out ">
          <div className='block'>
            <div className='flex items-center'>
              <UserCircle className='mr-2' />    
              <h4 className='font-semibold pl-1'>{`${ UserName }`}</h4>
            </div>
            <div>
              <p className='text-sm'>Description</p>
              <p className='text-sm'>#tag</p>
            </div>
          </div>
            <div className="displayTattooImgContainer"> 
                <img src={defaultTattoo} alt={`${UserName}'s Tattoo`} className='w-full h-auto rounded-md'/>
            </div>
            <div className='center flex'>
                <Interaction icon={ <CiHeart />} displayNumber={likes}/>
                <Interaction icon={ <IoIosAddCircleOutline /> } displayNumber={saves} /> 
            </div>
        </div>
      </div>
    );
}

function Interaction({ icon, displayNumber}) {
    return (
      <div className="flex items-center mr-4">
        {icon}
        <div className="ml-2">{displayNumber}</div>
      </div>
    );
  }

const UserCircle = () => <FaUserCircle size='24' />;

export default DisplayTattoo