import { useEffect, useState, useMemo } from 'react';
import ItemBox from "../Component/ItemBox";
import { useBusyBuy } from "../BusyContext";
import { toast } from 'react-toastify';

const HomePage = () => {
    const value = useBusyBuy();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchCategory, setSearchCategory] = useState([]);
    const [price, setPrice] = useState(75000);

    const filteredProducts = useMemo(() => {
        return value.allProducts.filter(product => {
            const matchesCategory = searchCategory.length === 0 || searchCategory.includes(product.category);
            const matchesSearchTerm = product.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPrice = product.price <= price;
            return matchesCategory && matchesSearchTerm && matchesPrice;
        });
    }, [searchCategory, searchTerm, price]);

    useEffect(() => {
        if (filteredProducts.length === 0) {
            toast.info("No products found.");
        }
    }, [filteredProducts]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
    };

    const toggleCategory = (category) => {
        setSearchCategory(prev =>
            prev.includes(category) ? prev.filter(cat => cat !== category) : [...prev, category]
        );
    };

    return (
        <>
            <div className="align-middle max-w-xl w-full mx-auto my-8 p-4">
                <form className="flex items-center space-x-4" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search By Name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Submit
                    </button>
                </form>
            </div>

            <div className="space-x-0 md:space-x-8 flex flex-col md:flex-row">
                <div className="max-w-xs w-full md:w-1/3 h-80 bg-slate-100 shadow-lg rounded-lg sticky top-4 p-4">
                    <p className="text-3xl text-center font-semibold font-sans text-gray-800">Filter</p>
                    <p className="text-center text-gray-600 mt-2">Price: <span className="font-bold text-lg">{price}</span></p>

                    <input
                        type="range"
                        min="0"
                        max="1000"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full mt-2"
                    />

                    <div className="mt-4">
                        <p className="text-lg text-center font-medium text-gray-700">Category</p>
                        <div className="mt-2 space-y-4">
                            {["Electronics", "Jewelery", "Men's Clothing", "Women's Clothing"].map(category => (
                                <div key={category} className="flex items-center" onClick={() => toggleCategory(category.toLowerCase())}>
                                    <input
                                        id={category.toLowerCase().replace(/ /g, "-")}
                                        type="checkbox"
                                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        checked={searchCategory.includes(category.toLowerCase())}
                                        readOnly
                                    />
                                    <label htmlFor={category.toLowerCase().replace(/ /g, "-")} className="ml-2 text-sm font-medium text-gray-800 hover:text-blue-600 cursor-pointer">
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 flex flex-wrap">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ItemBox key={product.id} product={product} />
                        ))
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default HomePage;
