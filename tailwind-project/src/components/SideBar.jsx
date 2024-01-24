import { BsFillLightningFill, BsGearFill } from 'react-icons/bs';
import { FaSkull } from 'react-icons/fa';
import { IoIosCreate } from 'react-icons/io';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col dark:bg-gray-900 text-white shadow-lg">
      <NavLink to="/" activeClassName="active">
        <SideBarIcon icon={<FaSkull />} />
      </NavLink>
      <Divider />
      <NavLink to="/create" activeClassName="active">
        <SideBarIcon icon={<IoIosCreate size="32" />} text={'Create 💡'} />
      </NavLink>
      <NavLink to="/ai" activeClassName="active">
        <SideBarIcon icon={<BsFillLightningFill size="20" />} text={'Ai Design 💡'} />
      </NavLink>
      <Divider />
      <NavLink to="/settings" activeClassName="active">
        <SideBarIcon icon={<BsGearFill size="22" />} />
      </NavLink>
    </div>
  );
};

const SideBarIcon = ({ icon, text }) => (
  <div className="sidebar-icon group">
    {icon}
    {text && <span className="sidebar-tooltip group-hover:scale-100">{text}</span>}
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;