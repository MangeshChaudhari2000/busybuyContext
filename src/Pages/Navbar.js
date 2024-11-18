import { NavLink } from "react-router-dom";
import { useBusyBuy } from "../BusyContext";
import { useEffect } from "react";

function Navbar() {
    const value = useBusyBuy();


    useEffect(() => {
        console.log("Updated userId in Navbar: ", value.userId);
    }, [value.userId]);



    return (
        <>
            <div className="flex justify-between items-center h-20 w-full bg-gray-800 px-16">
                <NavLink className="text-neutral-50"
                    to="/"
                >
                    <h4 className="font-mono text-2xl">BusyBuy</h4>
                </NavLink>
                <div className="flex space-x-8">
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? "text-blue-500" : "text-white")}
                    >
                        <h4>HOME</h4>
                    </NavLink>
                    {value.userId ? <>   <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? "text-blue-500" : "text-white")}
                    >
                        <h4>MyOrder</h4>
                    </NavLink>   <NavLink
                        to="/MyCart"
                        className={({ isActive }) => (isActive ? "text-blue-500" : "text-white")}
                    >
                            <h4>Cart</h4>
                        </NavLink></> : undefined}



                    <NavLink
                        to={value.userId ? "/" : "/Auth"}
                        className={({ isActive }) => (isActive ? "text-blue-500" : "text-white")}
                        onClick={value.userId ? value.handleLogout : undefined} // Call logout function if user is logged in
                    >
                        <h4>{value.userId ? "Logout" : "LogIn"}</h4>
                    </NavLink>
                </div>

            </div>
        </>
    );
}

export default Navbar;
