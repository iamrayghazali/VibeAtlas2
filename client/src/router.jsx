import {createBrowserRouter} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ErrorElement from "./pages/ErrorElement";
import Survey from "./pages/Survey.jsx";
import Recommendations from "./pages/Recommendations.jsx";
import SelectLocation from "./pages/SelectLocation.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,  // Starting page, maybe a welcome screen or map
        errorElement: <ErrorElement />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/survey",
        element: <Survey />,
    },{
        path: "/location",
        element: <SelectLocation />,
    },
    {
        path: "/recommendations",
        element: <Recommendations />,
    },
    {
        path: "*",  // Catch-all route for unknown pages
        element: <ErrorElement />,
    },
]);

export default router;