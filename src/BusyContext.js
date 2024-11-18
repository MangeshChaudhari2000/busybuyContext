import { createContext, useContext, useState, useEffect } from 'react';
import {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithPopup,
    signOut
} from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { collection, query, where, getDocs, addDoc, updateDoc } from "firebase/firestore";
import { db, provider } from './firebaseConfig';

const auth = getAuth();
const BusyContext = createContext();

const useBusyBuy = () => {
    const context = useContext(BusyContext);
    if (!context) {
        throw new Error('useBusyBuy must be used within a BusyBuyProvider');
    }
    return context;
}

const BusyBuyProvider = ({ children }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [myCarts, setMyCarts] = useState([]);
    const handleError = (message) => {
        setError(message);
        toast.error(message);
    };

    const getAllProducts = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setAllProducts(data);
        } catch (error) {
            handleError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User signed up successfully! ID:', userCredential.user.uid);
        } catch (error) {
            handleError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUserId(userCredential.user.uid);
            console.log('User signed in successfully! ID:', userCredential.user.uid);
        } catch (error) {
            handleError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUserId(null);
            setMyCarts([]); // Clear cart on logout
            toast.info("Logout Successfully!");
        } catch (error) {
            handleError(error.message);
        }
    };

    const handleForgotPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log('Password reset email sent!');
        } catch (error) {
            handleError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const userCredential = await signInWithPopup(auth, provider);
            setUserId(userCredential.user.uid);

            toast.success('User signed in with Google successfully!');
        } catch (error) {
            handleError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCart = async (product) => {
        if (!userId) {
            return handleError("User not logged in");
        }

        try {
            const q = query(collection(db, "UserCarts"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                const existingCart = querySnapshot.docs[0].data().cart || [];
                const productIndex = existingCart.findIndex(item => item.ProdId === product.id);

                if (productIndex !== -1) {
                    // Product already in cart, increase quantity
                    existingCart[productIndex].Qty += 1;
                    await updateDoc(docRef, { cart: existingCart });
                    setMyCarts(prev => prev.map(item =>
                        item.ProdId === product.id
                            ? { ...item, Qty: item.Qty + 1 }
                            : item
                    ));
                    toast.success("Increased quantity of the product in the cart");
                } else {
                    // Product not in cart, add it
                    existingCart.push({ ProdId: product.id, Qty: 1 });
                    await updateDoc(docRef, { cart: existingCart });
                    setMyCarts(prev => [...prev, { ProdId: product.id, Qty: 1 }]);
                    toast.success("Cart updated with new product");
                }
            } else {
                // No cart exists, create one
                const docRef = await addDoc(collection(db, "UserCarts"), {
                    userId: userId,
                    cart: [{ ProdId: product.id, Qty: 1 }]
                });
                setMyCarts(prev => [...prev, { ProdId: product.id, Qty: 1 }]);
                toast.success("Cart created with new product");
                console.log("Document written with ID:", docRef.id);
            }
        } catch (error) {
            handleError("Error adding to cart: " + error.message);
        }
    };


    const getCart = async () => {
        if (!userId) return [];

        try {
            const q = query(collection(db, "UserCarts"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const existingCart = querySnapshot.docs[0].data().cart || [];
                // Only update myCarts if the data has changed
                if (JSON.stringify(existingCart) !== JSON.stringify(myCarts)) {
                    setMyCarts(existingCart);
                }
                return existingCart; // Return the cart items
            }
            return [];
        } catch (error) {
            handleError("Error fetching cart: " + error.message);
            return [];
        }
    };

    const getProduct = async (productId) => {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${productId}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseText = await response.text(); // Get the raw response text

            if (!responseText) {
                return null;
            }

            const data = JSON.parse(responseText); // Parse the response as JSON
            return data;
        } catch (error) {
            handleError("Error fetching product: " + error.message);
            return null; // Return null or a fallback value
        }
    };

    const handleRemoveCart = async (productId) => {
        try {
            const q = query(collection(db, "UserCarts"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;
                const existingCart = querySnapshot.docs[0].data().cart || [];
                const productIndex = existingCart.findIndex(item => item.ProdId === productId);

                if (productIndex !== -1) {
                    // Product already in cart, increase quantity
                    existingCart.splice(productIndex, 1);
                    await updateDoc(docRef, { cart: existingCart });
                    setMyCarts(existingCart);
                    toast.success("Removed Product from Cart");
                }
            }
        } catch (error) {
            handleError(error.message)
        }
    }

    const handleIncQuantity = async (productId) => {
        try {
            const q = query(collection(db, "UserCarts"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.warn("No cart found for this user.");
                return; // Early return if cart is empty
            }

            const docRef = querySnapshot.docs[0].ref;
            const existingCart = querySnapshot.docs[0].data().cart || [];
            const productIndex = existingCart.findIndex(item => item.ProdId === productId);

            if (productIndex !== -1) {
                // Product already in cart, increase quantity
                existingCart[productIndex].Qty += 1;

                // Update Firestore
                await updateDoc(docRef, { cart: existingCart });
                console.log("Firestore updated with new cart:", existingCart);

                // Update local state
                setMyCarts(prev => prev.map(item =>
                    item.ProdId === productId
                        ? { ...item, Qty: item.Qty + 1 }
                        : item
                ));
                toast.success("Increased quantity of the product in the cart");
            } else {
                console.warn("Product not found in cart:", productId);
            }

        } catch (error) {
            console.error("Error updating quantity:", error);
            handleError(error.message);
        }
    };

    const handleDecQuantity = async (productId) => {
        try {
            const q = query(collection(db, "UserCarts"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.warn("No cart found for this user.");
                return; // Early return if cart is empty
            }

            const docRef = querySnapshot.docs[0].ref;
            const existingCart = querySnapshot.docs[0].data().cart || [];
            const productIndex = existingCart.findIndex(item => item.ProdId === productId);
            console.log("handle dec quantity clicked,ProductIndex", productIndex);

            if (productIndex !== -1) {

                if (existingCart[productIndex].Qty === 1) {
                    handleRemoveCart(productId);
                } else {
                    --existingCart[productIndex].Qty;
                    await updateDoc(docRef, { cart: existingCart });

                    setMyCarts(existingCart);
                    toast.success("Decreased quantity of the product in the cart")
                }
            }
        } catch (error) {
            handleError(error.message);
        }
    }

    const handleOrderItem = async (CartItems) => {
        try {
            // Create the order items array
            const orderItems = CartItems.map((d) => ({
                Title: d.title,
                Qty: d.Qty,
                Price: d.price
            }));
    
            // Add the order to Firestore
            const docRef = await addDoc(collection(db, "UserOrders"), {
                userId: userId,
                Order: orderItems,
                Created_ts: new Date()
            });
    
            // Success message
            if (docRef.id) {
                // Clear the cart after successful order placement
                const q = query(collection(db, "UserCarts"), where("userId", "==", userId));
                const querySnapshot = await getDocs(q);
    
                if (!querySnapshot.empty) {
                    const docRef = querySnapshot.docs[0].ref;
                    await updateDoc(docRef, { cart: [] }); // Clear the cart
                    setMyCarts([]); // Update local state
                    toast.success("Order Placed Successfully and Cart Cleared");
                } else {
                    toast.success("Order Placed Successfully, but no cart found");
                }
            } else {
                throw new Error("Document reference was not created");
            }
        } catch (error) {
            console.error("Error placing order: ", error);
            toast.error("Error placing order. Please try again.");
        }
    };
    
    

    useEffect(() => {
        getAllProducts();
        // getCart();
    }, []);

    useEffect(() => {
        if (error) {
            toast.error(error);
            setError(null); // Clear error after displaying
        }
    }, [error]);

    return (
        <BusyContext.Provider value={{ allProducts, userId, loading, myCarts, getCart, getProduct, handleSignUp, handleSignIn, handleForgotPassword, handleLogout, handleGoogleSignIn, handleAddCart, handleError, handleRemoveCart, handleIncQuantity, handleDecQuantity,handleOrderItem }}>
            {loading ? (
                <div className="spinner-container">
                    <ClipLoader loading={loading} size={50} />
                </div>
            ) : (
                children
            )}
            <ToastContainer />
        </BusyContext.Provider>
    );
}

export { useBusyBuy };
export default BusyBuyProvider;
