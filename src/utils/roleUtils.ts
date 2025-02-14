export const getRoleLinks = (role: string) => {
    const roleLinks: { [key: string]: { name: string; path: string }[] } = {
        ceo: [
            { name: "Dashboard", path: "/ceo/dashboard" },
            { name: "Employee Data", path: "/ceo/employeeData" },
            { name: "Chat", path: "/bdo/chat" },
        ],
        hr: [
            { name: "Dashboard", path: "/hr/dashboard" },
            // { name: "Employees", path: "/hr/employees" },
            // { name: "Attendance", path: "/hr/attendance" },
            { name: "Team", path: "/hr/team" },
            { name: "Chat", path: "/hr/chat" },
        ],
        employee: [
            { name: "Dashboard", path: "/employee/dashboard" },
            { name: "Projects", path: "/employee/projects" },
            { name: "Tasks", path: "/employee/tasks" },
            { name: "Chat", path: "/bdo/chat" },
        ],
        bdo: [
            { name: "Dashboard", path: "/bdo/dashboard" },
            { name: "Meetings", path: "/bdo/meetings" },
            { name: "Sales Report", path: "/bdo/sales-report" },
            { name: "Calls", path: "/bdo/calls" },
            { name: "Chat", path: "/bdo/chat" },
        ],
    };

    return roleLinks[role] || [];
};






// export const getRoleLinks = (role: string) => {
//     const commonLinks = [
//         { name: "Chat", path: "/chat" },
//     ];

//     const roleSpecificLinks: { [key: string]: { name: string; path: string }[] } = {
//         ceo: [
//             { name: "Dashboard", path: "/ceo/dashboard" },
//             { name: "Employee Data", path: "/ceo/employeeData" },
            
//         ],
//         hr: [
//             { name: "Dashboard", path: "/hr/dashboard" },
//             { name: "Employees", path: "/hr/employees" },
//             { name: "Attendance", path: "/hr/attendance" },
//         ],
//         developer: [
//             { name: "Dashboard", path: "/developer/dashboard" },
//             { name: "Projects", path: "/developer/projects" },
//             { name: "Tasks", path: "/developer/tasks" },
//         ],
//         bdo: [
//             { name: "Dashboard", path: "/bdo/dashboard" },
//             { name: "Meetings", path: "/bdo/meetings" },
//             { name: "Sales Report", path: "/bdo/sales-report" },
//             { name: "Calls", path: "/bdo/calls" },
//         ],
//     };

//     return [...(roleSpecificLinks[role] || []), ...commonLinks];
// };







// // export const getRoleLinks = (role: string) => {
// //     const roleLinks: { [key: string]: { name: string; path: string }[] } = {
// //         ceo: [
// //             { name: "Dashboard", path: "/ceo/dashboard" },
// //             { name: "Employee Data", path: "/ceo/employeeData" },
// //             { name: "Chat", path: "/chat" },
// //         ],
// //         hr: [
// //             { name: "Dashboard", path: "/hr/dashboard" },
// //             { name: "Employees", path: "/hr/employees" },
// //             { name: "Attendance", path: "/hr/attendance" },
// //             { name: "Chat", path: "/chat" },
// //         ],
// //         developer: [
// //             { name: "Dashboard", path: "/developer/dashboard" },
// //             { name: "Projects", path: "/developer/projects" },
// //             { name: "Tasks", path: "/developer/tasks" },
// //             { name: "Chat", path: "/chat" },
// //         ],
// //         bdo: [
// //             { name: "Dashboard", path: "/bdo/dashboard" },
// //             { name: "Meetings", path: "/bdo/meetings" },
// //             { name: "Sales Report", path: "/bdo/sales-report" },
// //             { name: "Calls", path: "/bdo/calls" },
// //             { name: "Chat", path: "/chat" },
// //         ],
// //     };

// //     return roleLinks[role] || [];
// // };
