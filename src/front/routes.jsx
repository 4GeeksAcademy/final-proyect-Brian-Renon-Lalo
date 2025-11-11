// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { RZHome } from "./pages/RZHome";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { RZRegister } from "./pages/RZRegister";
import { RZLogin } from "./pages/RZLogin";
import { RZProfile } from "./pages/RZProfile";
import { RZElection } from "./pages/RZElection";
import { RZVista } from "./pages/RZVista";
import { RZSavedRoutes } from "./pages/RZSavedRoutes";

export const router = createBrowserRouter(
    createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

      // Root Route: All navigation will start from here.
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

        {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
        <Route path= "/" element={<RZHome />} />
        <Route path="/single/:theId" element={ <Single />} />  {/* Dynamic route for single items */}
        <Route path="/demo" element={<Demo />} />
        <Route path="/register" element={<RZRegister />} />
        <Route path="/login" element={<RZLogin />} />
        <Route path="/profile" element={<RZProfile />} />
        <Route path="/rzelection" element={<RZElection />} />
        <Route path="/routes/:routeId" element={<RZVista />} />
        <Route path="/savedroutes" element={<RZSavedRoutes />} />
        
      </Route>
    )
);