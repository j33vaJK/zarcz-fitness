export const routes = [
    {
        path: '/',
        protected: false,
    },
    {
        path: '/dashboard',
        protected: true,
        roles: ['user', 'admin'],
    },
    {
        path: '/admin',
        protected: true,
        roles: ['admin'],
    },
    // Add more routes here
];
