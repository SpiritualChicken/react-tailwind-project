import {BsFillLightningFill, BsGearFill} from 'react-icons/bs';
import { FaSkull } from 'react-icons/fa';
import { IoIosCreate } from "react-icons/io";

const SideBar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col
                 dark:bg-gray-900 text-white shadow-lg">
                    
        <SideBarIcon icon={<FaSkull />} />
        <Divider />
        <SideBarIcon icon={<IoIosCreate size="32" />} text={'tooltip 💡'} />
        <SideBarIcon icon={<BsFillLightningFill size="20" />} text={'tooltip 💡'} />
        <Divider />
        <SideBarIcon icon={<BsGearFill size="22" />} />
    </div>
  );
};

const SideBarIcon = ({ icon, text }) => (
  <div className="sidebar-icon group">
    {icon}
    {text && (
      <span className="sidebar-tooltip group-hover:scale-100">
        {text}
      </span>
    )}
  </div>
);


const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;