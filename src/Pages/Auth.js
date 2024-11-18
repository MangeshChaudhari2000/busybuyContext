import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { useBusyBuy } from '../BusyContext';

const Auth = () => {
    const value = useBusyBuy();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const toggleSignup = () => {
        setIsSignUp(!isSignUp);
        setEmail("");
        setPassword("");
    }
    return (

        // <div>
        //     <input type="text" placeholder="Email" onChange={(e) =>
        //         setEmail(e.target.value)} />
        //     <input type="password" placeholder="Password" onChange={(e) =>
        //         setPassword(e.target.value)} />
        //     <button onClick={() => value.handleSignUp(email, password)}>Sign Up</button>
        //     <button onClick={() => value.handleSignIn(email, password)}>Sign In</button>
        //     {value.error && <p>{value.error}</p>}
        // </div>
        //-----------------------------------
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div>
            </div>
            <div className="max-w-screen-xl sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className=" flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">
                            {isSignUp ? "Sign up" : "Sign in"}
                        </h1>
                        <div className="w-full flex-1 mt-8">
                            <div className="flex flex-col items-center" onClick={() => value.handleGoogleSignIn()}>
                                <button
                                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                                    <div className="bg-white p-2 rounded-full">
                                        <img className='w-4' src='https://cdn-icons-png.flaticon.com/128/300/300221.png' />
                                    </div>
                                    <span className="ml-4">
                                        Sign in with Google
                                    </span>
                                </button>
                            </div>

                            <div className="my-12 border-b text-center">
                                <div
                                    className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                    Or sign{isSignUp ? " up" : " in"} with e-mail
                                </div>
                            </div>

                            <div className="mx-auto max-w-xs">
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <input
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <button onClick={() => isSignUp ? value.handleSignUp(email, password) : value.handleSignIn(email, password)}
                                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                    <span className="ml-3">
                                        {isSignUp ? "Sign up" : "Sign in"}
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleSignup()}
                                    className="px-2 mt-2 text-sm text-gray-500 font-medium hover:text-gray-950 hover:shadow-2xl focus:outline-none"
                                >
                                    Or <strong>{isSignUp ? "Sign In" : "Sign Up"}</strong> with e-mail
                                </button>


                                <p className="mt-6 text-xs text-gray-600 text-center">
                                    I agree to abide by templatana's
                                    <a href="#" className="border-b border-gray-500 border-dotted">
                                        Terms of Service
                                    </a>
                                    and its
                                    <a href="#" className="border-b border-gray-500 border-dotted">
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1  bg-center mx-auto  lg:flex bg-no-repeat bg-contain" style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/young-woman-casual-clothing-joyfully-jumping-with-shopping-bags-vibrant-energetic-image-retail-happiness-modern-consumer-lifestyle-ai_372197-26865.jpg?w=826')" }}
                >

                </div>

            </div>

        </div>

    );
};
export default Auth;
