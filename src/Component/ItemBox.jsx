import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useBusyBuy } from "../BusyContext";
import { toast } from "react-toastify";

const ItemBox = ({ product }) => {
  const value = useBusyBuy();
  const navigate = useNavigate();

  const toggleNavigate = () => {
    navigate("Auth");
    toast.info("Please Login to add to cart");
  };
  return (
    <div className="w-80 m-4 mx-auto border-2 border-gray-200 hover:border-blue-300 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer relative">
      <img
        className="w-full h-60 object-contain p-2"
        alt={product.title} // Change to use product title
        src={product.image}
      />

      <div className="p-2">
        <p className="text-xm font-medium text-sky-800">{product.title}</p>
        <p className="text-sm font-medium text-gray-800 truncate ">
          {product.description}
        </p>

        <p className="text-lg font-bold text-gray-700">${product.price}</p>
      </div>

      <div className="bg-white bg-opacity-90 p-4 rounded-lg flex justify-center">
        <button
          onClick={() => {
            if (value.userId) {
              value.handleAddCart(product);
            } else {
              toggleNavigate(); // Navigate to Auth page if not logged in
            }
          }}
          type="button"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 hover:bg-blue-500"
        >
          <h2 className="text-lg font-semibold">Add to Cart</h2>
        </button>
      </div>
    </div>
  );
};

export default ItemBox;
