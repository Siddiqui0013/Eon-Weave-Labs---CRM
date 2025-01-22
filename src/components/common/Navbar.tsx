import { getRoleLinks } from "../../utils/roleUtils";
import { useLocation, useNavigate } from "react-router";
import { useLogoutMutation } from "@/services/userApi";
import { useToast } from "@/hooks/use-toast";
import Button from "./Button";
import { Loader2 } from "lucide-react";
import useLogout from "@/hooks/useLogout";
import { Link } from "react-router"
import logo from "../../assets/logo.png"
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { X, Menu } from 'lucide-react';
import TopButtons from "./TopButtons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const role = user ? user.role : "";
  const links = getRoleLinks(role);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLinkActive = (linkPath: string) => {
    const currentPath = location.pathname.replace(/\/$/, '');
    const normalizedLinkPath = linkPath.replace(/\/$/, '');

    if (normalizedLinkPath.endsWith('/dashboard')) {
      return currentPath === normalizedLinkPath;
    }

    return currentPath.includes(normalizedLinkPath) &&
      (normalizedLinkPath !== `/${role}` || currentPath === `/${role}`);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const [logout, { isLoading }] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      useLogout();
      toast({
        variant: "default",
        title: "Success",
        description: "You have been logged out",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again",
      });
    }
  }

  return (
    <>
      <div
        className="md:hidden flex justify-between fixed top-0 left-0 w-full z-50 p-2 h-16 bg-card text-white"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <TopButtons />

      </div>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 mb-20  z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className={`
        fixed top-0 left-0 h-screen bg-[#171717] flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out z-40
        w-64 md:w-[20%]
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="mt-12">
          <div className="p-4 mt-8 md:m-0 flex justify-between items-center">
            <Link
              to={role ? `/${role}/dashboard` : "/"}
              className="text-xl font-bold text-white"
              onClick={handleLinkClick}
            >
              Eon Weave Labs
            </Link>
            <img src={logo} alt="EWL" className="h-8" />
          </div>

          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`flex items-center mx-2 rounded-full px-6 py-3
                    ${isLinkActive(link.path)
                      ? 'bg-primary text-white'
                      : 'text-white bg-transparent hover:bg-gray-800'
                    }`}
                >
                  <span>{link.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Button
          title={isLoading ? "Logging out..." : "Logout"}
          onClick={handleLogout}
          disabled={isLoading}
          icon={isLoading && <Loader2 size={16} />}
          className="m-4 justify-center font-semibold"
        />
      </nav>
    </>
  );
};

export default Navbar;





// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from "../../redux/Store"
// import { setLinks } from '../../redux/slices/navbarSlice';

// const Navbar: React.FC = () => {
//   const dispatch = useDispatch();
//   const role = useSelector((state: RootState) => state.user.role);
//   const links = useSelector((state: RootState) => state.navbar.links);

//   useEffect(() => {

//     let roleLinks = [];
//     switch (role) {
//       case 'CEO':
//         roleLinks = [
//           { key: '1', label: 'Dashboard', path: '/dashboard' },
//           { key: '2', label: 'Employee Data', path: '/employeeData' },
//         ];
//         break;
//       case 'HR':
//         roleLinks = [{ key: '1', label: 'Recruitment', path: '/recruitment' }];
//         break;
//       case 'Developer':
//         roleLinks = [{ key: '1', label: 'Projects', path: '/projects' }];
//         break;
//       case 'BDO':
//         roleLinks = [{ key: '1', label: 'Sales Report', path: '/salesReport' }];
//         break;
//       default:
//         roleLinks = [];
//     }
//     dispatch(setLinks(roleLinks));
//   }, [role, dispatch]);

//   return (
//     <div style={{ width: 256, height: '100vh', backgroundColor: '#171717', color: 'white' }}>
//       <ul>
//         {links.map((link) => (
//           <li key={link.key}>
//             <a href={link.path} style={{ color: 'white' }}>
//               {link.label}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Navbar;







// import React from 'react';
// import {
//   AppstoreOutlined,
//   CalendarOutlined,
//   MailOutlined,
//   SettingOutlined,
// } from '@ant-design/icons';
// import { Menu } from 'antd';
// import type { GetProp, MenuProps } from 'antd';
// import { ConfigProvider } from 'antd';
// import './Navbar.css';

// type MenuItem = GetProp<MenuProps, 'items'>[number];

// const items: MenuItem[] = [
//   {
//     key: '1',
//     icon: <MailOutlined />,
//     label: 'Navigation One',
//   },
//   {
//     key: '2',
//     icon: <CalendarOutlined />,
//     label: 'Navigation Two',
//   },
//   {
//     key: '3',
//     label: 'Navigation Three',
//     icon: <AppstoreOutlined />,
//   },
//   {
//     key: '4',
//     label: 'Navigation Four',
//     icon: <SettingOutlined />,
//   },
// ];

// const App: React.FC = () => {
//   return (
//     <ConfigProvider
//       theme={{
//         components: {
//           Menu: {
//             darkItemBg: '#171717',
//             darkItemSelectedBg: '#f77206',
//             darkItemSelectedColor: '#ffffff',
//             darkItemColor: '#ffffff',
//             darkItemHoverBg: '#ff8c33',
//           },
//         },
//       }}
//     >
//       <div style={{ display: 'flex', height: '100vh' }}>
//         <Menu
//           className="custom-menu"
//           style={{
//             width: 256,
//             height: '100%',
//             position: 'fixed',
//             overflow: 'auto',
//           }}
//           defaultSelectedKeys={['1']}
//           defaultOpenKeys={['sub1']}
//           items={items}
//           theme="dark"
//         />
//       </div>
//     </ConfigProvider>
//   );
// };

// export default App;