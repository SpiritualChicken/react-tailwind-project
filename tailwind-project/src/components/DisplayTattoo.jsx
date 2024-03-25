import defaultTattoo from '../assets/tattooPlaceholder.png';
import { CiHeart } from "react-icons/ci";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaUserCircle, } from 'react-icons/fa';
import { FaRegComments } from "react-icons/fa";
import { FaShare } from "react-icons/fa";




function DisplayTattoo({ UserName, likes, saves }) {
    return (
      <div className='content-list ; '>
        <div className="bg-white rounded-md shadow-md hover:cursor-pointer hover:transform hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-300 ease-in-out ">
          {/* User name + Description */}
          {/* <div className='block'>
            <div className='flex items-center pl-1 pt-1'>
              <UserCircle />    
              <h4 className='font-semibold pl-1'>{`${ UserName }`}</h4>
            </div>
            <div className='pl-1 pt-1 pb-1'>
              <p className='text-sm'>Description</p>
              <p className='text-sm'>#tag</p>
            </div>
          </div> */}
            <div className="block border-2 rounded-md h-full w-full"> 
                <img src={defaultTattoo} alt={`${UserName}'s Tattoo`} className='w-full h-auto rounded-md'/>
            </div>
            <div className='flex justify-center pt-2 pb-1'>
                <Interaction icon={ <CiHeart />} displayNumber={likes}/>
                <Interaction icon={ <IoIosAddCircleOutline /> } displayNumber={saves} /> 
                {/* Comment button */}
                {/* <Interaction icon={ <FaRegComments /> } displayNumber={saves} /> */}
                {/* Share Button */}
                {/* <Interaction icon={ <FaShare />} displayNumber={saves} /> */}
            </div>
        </div>
      </div>
    );
}

function Interaction({ icon, displayNumber}) {
    return (
      <div className="flex items-center mr-4 content-container-icons">
        {icon}
        <div className="ml-2">{displayNumber}</div>
      </div>
    );
  }

const UserCircle = () => <FaUserCircle size='24' />;

export default DisplayTattoo