import { getRoleLinks } from "../../utils/roleUtils";
import { useLocation } from "react-router";
import { RootState } from "../../redux/Store"
import { Link } from "react-router"
import { useEffect } from "react";
import logo from "../../assets/logo.png"
import { useSelector, useDispatch } from "react-redux";
import { setRole } from "../../redux/slices/userSlice";

const Navbar = () => {

  const role = useSelector((state: RootState) => state.user.role);
  const links = getRoleLinks(role);
  const location = useLocation()
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setRole(role));
  }, [role]);

  const isLinkActive = (linkPath: string) => {
    const currentPath = location.pathname.replace(/\/$/, '');
    const normalizedLinkPath = linkPath.replace(/\/$/, '');

    if (normalizedLinkPath.endsWith('/dashboard')) {
      return currentPath === normalizedLinkPath;
    }

    return currentPath.includes(normalizedLinkPath) && 
           (normalizedLinkPath !== `/${role}` || currentPath === `/${role}`);
  };

    return (
        <nav className="w-[20%] h-screen fixed top-0 overflow-hidden left-0 bg-[#171717] flex flex-col justify-between">

            <div className="box1">
                <div className="p-4 my-8 flex justify-between">
                <Link to={role ? `/${role}/dashboard` : "/"} className="text-xl font-bold text-white">
                Eon Weave Labs
                    </Link>
                    <img src={logo} alt="EWL" className="h-8" />
                </div>

                <ul className="flex flex-col">
                    {links.map((link) => (
                        <li key={link.path}>
              <Link
                to={link.path}
                className={`flex items-center mx-2 rounded-full px-6 py-3
                  ${isLinkActive(link.path)
                    ? 'bg-primary text-white' 
                    : 'text-white bg-transparent'
                  }`}
              >
                                <span>{link.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <button className="bg-primary text-white font-bold mb-12 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            // onClick={() => signOut(auth)}
            onClick={() => {
            //   signOut(auth);
              dispatch(setRole(""));
            //   window.location.href = "/";
            }}
            >
            Sign out</button>

        </nav>
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