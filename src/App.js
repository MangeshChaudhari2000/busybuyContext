import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Navbar from "./Pages/Navbar";
import HomePage from "./Pages/HomePage";
import BusyBuyProvider from "./BusyContext";
import Auth from "./Pages/Auth";
import MyCart from "./Pages/MyCart";
import { Outlet } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <BusyBuyProvider>
          <Navbar />
          <Outlet />  {/* This will render child routes */}
        </BusyBuyProvider>
      ),
      children: [
        {
          path: "", element: <HomePage />
        }, 
        {
          path: "Auth", element: <Auth />
        }, 
        {
          path: "MyCart", element: <MyCart />
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
