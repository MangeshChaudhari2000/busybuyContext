import { useEffect, useState } from "react";
import { useBusyBuy } from "../BusyContext";
import CartBox from "../Component/CartBox";

const MyCart = () => {
    const { getCart, getProduct, handleError, myCarts,handleOrderItem } = useBusyBuy();
    const [myProducts, setMyProducts] = useState([]);

    // Fetch cart items and product details on component mount
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const cartItems = await getCart(); // Fetch the cart items
                if (cartItems.length > 0) {
                    const products = await Promise.all(
                        cartItems.map(async (cartItem) => {
                            const product = await getProduct(cartItem.ProdId);
                            return product ? { ...product, Qty: cartItem.Qty } : null; // Add Qty to product
                        })
                    );
                    const filteredProducts = products.filter(product => product !== null);

                    // Check if the products have changed before updating the state
                    if (JSON.stringify(filteredProducts) !== JSON.stringify(myProducts)) {
                        setMyProducts(filteredProducts); // Update only if products have changed
                    }
                } else {
                    setMyProducts([]); // Clear products if no items in cart
                }
            } catch (error) {
                handleError(error);
            }
        };

        fetchCartItems();
    }, [myCarts]); // Run effect only when myCarts changes
    const totalAmount = myProducts.reduce((acc, product) => acc + (product.price.toFixed(2) * product.Qty), 0);
    const totalQuantity = myProducts.reduce((data, product) => data + product.Qty, 0)
    return (
        <div className="space-x-0 md:space-x-8 flex flex-col md:flex-row m-2">
            <div className="max-w-xs w-full md:w-1/3 h-80 bg-slate-100 shadow-lg mt-8 rounded-lg sticky top-8 p-4">
                <p className="text-2xl text-center font-bold font-sans text-gray-800">Price Details</p>
                <div className="flex justify-between w-10/11 mx-auto mt-4">
                    <p>Price ({totalQuantity} item)</p>
                    <p>${totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between w-10/11 mx-auto mt-4">
                    <p>Platform Fee (i)</p>
                    <p className="line-through">$3</p>
                </div>
                <div className="flex justify-between w-10/11 mx-auto mt-4">
                    <p>Delivery Charges</p>
                    <p><span className="line-through">$40</span> <span className="text-lime-700 text-xs">Free Delivery</span></p>
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="flex justify-between w-10/11 mx-auto mt-4">
                    <p>Total Amount</p>
                    <p>${totalAmount.toFixed(2)}</p>
                </div>
                <button
                    onClick={() => {
                        // handle order placement
                        handleOrderItem(myProducts);
                    }}
                    type="button"
                    aria-label="Place Order"
                    className="flex mx-auto mt-4 items-center space-x-2 bg-amber-400 px-4 py-2 rounded-lg shadow-md transition-colors duration-200 hover:bg-yellow-400 hover:scale-105 hover:shadow-xl"
                >
                    <h2 className="text-lg font-semibold">Place Order</h2>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-wrap">
                {myProducts.length > 0 ? (
                    myProducts.map((product, index) => (
                        <CartBox key={`${product.id}-${index}`} product={product} />
                    ))
                ) : (
                    <p>No Cart Added.</p>
                )}
            </div>
        </div>
    );
};

export default MyCart;
