import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export const HomePage = () => {
    const [productData, setProductData] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [status, setStatus] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [cart, setCart] = useState([]);


    useEffect(() => {
        const productApiData = async () => {
            try {
                const response = await fetch('https://dummyjson.com/products');
                const data = await response.json();

                // console.log('Fetched data:', data);
                // console.log('Is Array:', Array.isArray(data));
                // console.log('First item:', data[0]);

                if (Array.isArray(data.products)) {
                    setProductData(data.products);
                    setFilteredProducts(data.products);
                    setStatus(true);
                } else {
                    // console.error('Invalid data format. Expected "products" property to be an array:', data);
                    setStatus(false);
                }
            } catch (error) {
                // console.error('Error fetching data:', error);
                setStatus(false);
            }
        };

        productApiData();
    }, []);


    // ---------------search by name ----------
    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredProducts(productData);
            return;
        }

        fetch(`https://dummyjson.com/products/search?q=${searchTerm}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('Search data:', data);

                if (Array.isArray(data.products)) {
                    setFilteredProducts(data.products);
                } else {
                    console.error('Invalid search data format:', data);
                }
            })
            .catch((error) => {
                console.error('Error fetching search data:', error);
            });
    };

    // -----------filter by price-------------
    const handleFilterByPrice = () => {
        const filtered = productData.filter((item) => {
            const itemPrice = parseFloat(item.price);
            const minPriceValue = minPrice ? parseFloat(minPrice) : Number.NEGATIVE_INFINITY;
            const maxPriceValue = maxPrice ? parseFloat(maxPrice) : Number.POSITIVE_INFINITY;

            return itemPrice >= minPriceValue && itemPrice <= maxPriceValue;
        });

        setFilteredProducts(filtered);
    };

    const [users, setUsers] = useState();

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userInfo = await fetch('https://dummyjson.com/users')
                setUsers(userInfo);
            } catch (error) {
                console.log('Error fetching user info:', error);
            }
        };
        getUserInfo();
    }, []);


    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    // Function to close the popup
    const closePopup = () => {
        setShowSuccessPopup(false);
    };

    const addToCart = (productId) => {

        if (!users) {
            console.log('User info is not available');
            return;
        }

        fetch('https://dummyjson.com/carts/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: users.id,
                products: [
                    {
                        id: productId,
                        quantity: 1,
                    },
                ],
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('Added to Cart:', data);
                setCart([...cart, { id: productId, quantity: 1 }]);
                // Set state to show the success popup
                setShowSuccessPopup(true);
                // Automatically close the popup after 5 seconds
                setTimeout(closePopup, 1000);
            })
            .catch((error) => {
                console.error('Error adding to Cart:', error);
                // Handle errors (e.g., show an error message to the user)
            });
    };

    // Calculate cart count and total amount
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);



    return (
        <div className='container-fluid' style={{ backgroundColor: "rgb(241 221 239)" }} >
            <div className='row' style={{ paddingBottom: "20px", backgroundColor: "rgb(2 25 60)", padding: "20px" }}>
                <div className='col-lg-2 col-md-2 col-sm-12'>
                    <h1 style={{ color: "white", paddingLeft: "20px", textAlign: "center" }}>EShopy</h1>
                </div>
                <div className='col-lg-6 col-md-8 col-sm-12 d-flex justify-content-center pt-2'>
                    <div className='search-bar'  >
                        <input
                            type='text'
                            placeholder='Search by product name'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "350px", height: "40px", borderRadius: "10px 0px 0px 10px", padding: "10px", border: "none", color: "#000000", fontWeight: "600" }}
                        />
                        <button onClick={handleSearch} style={{ height: "40px", width: "60px", borderRadius: "0px 10px 10px 0px", border: "none", color: "#000000", fontWeight: "600", fontSize: "18px" }}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>
                <div className='col-lg-4 col-md-2 col-sm-12'>
                    {/* Shopping Cart Section */}
                    <div style={{ display: "flex", color: 'white', justifyContent: "center" }}>
                        <FontAwesomeIcon icon={faShoppingCart} style={{ height: "30px", width: "40px", marginTop: "20px" }} />
                        <p style={{ backgroundColor: "white", borderRadius: "50%", width: "22px", height: "22px", color: "rgb(2 25 60)", textAlign: "center", fontSize: "15px", fontWeight: "bold", marginTop: "3px", marginLeft: "-9px" }}>{cartCount} </p>

                    </div>
                </div>
            </div>
            <div className='row' style={{ padding: "30px 30px 0px 40px" }}>
                <div className='col-lg-6 col-md-4 col-sm-12 col-12'>
                    <h3 style={{ fontWeight: "600", color: "#000000" }}>
                        {searchTerm ? `Searched Products (${filteredProducts.length})` : 'All Products'}
                    </h3>
                </div>
                <div className='col-lg-6 col-md-8 col-sm-12 col-12'>
                    <div className='price-filter' style={{ float: "right" }}>
                        <input
                            type='number'
                            placeholder='Min Price'
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            style={{ width: "130px" }}
                        />
                        <input
                            type='number'
                            placeholder='Max Price'
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            style={{ width: "130px" }}
                        />
                        <button onClick={handleFilterByPrice} style={{ borderRadius: "5px", fontSize: "18px" }}>Filter</button>
                    </div>

                </div>
            </div>


            {status ? (
                <div className='row' style={{ padding: "20px 50px" }}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item, i) => (
                            <div className='col-lg-4 col-md-4 col-sm-6 d-flex justify-content-center' key={i}>
                                {/* Assume 'images', 'title', 'brand', 'description', 'price', 'rating' are properties in your product data */}
                                <div className='p-2 product-card' style={{ width: "400px", height: "580px", margin: "20px", borderRadius: "5px", border: "2px solid rgb(206, 201, 201)", color: "#000000" }}>
                                    <div style={{ height: "300px", textAlign: "center" }}>
                                        <img src={item.images[0]} alt={item.title} style={{ width: "100%", height: "100%", borderRadius: "5px" }} />
                                    </div>

                                    <div style={{ height: "100px", paddingTop: "8px" }}>
                                        <h3 style={{ fontSize: "20px", lineHeight: "20px", fontWeight: "bold" }}>{item.title}</h3>
                                        <p style={{ fontSize: "16px", lineHeight: "16px", fontWeight: "600" }}>{item.brand}</p>
                                    </div>

                                    <div style={{ height: "70px", fontSize: "16px", lineHeight: "18px", }}>
                                        <p>{item.description}</p>
                                    </div>
                                    <div style={{ height: "18px", fontSize: "15px" }}>
                                        <p style={{ float: "left", fontWeight: "bold" }}>Price: Rs.{item.price}</p>
                                        <p style={{ float: "right" }}>Ratings: {item.rating}</p>
                                    </div>
                                    <div className='product-card-button' style={{ padding: "20px", textAlign: "center" }}>
                                        <button
                                            className='bn btn'
                                            style={{ backgroundColor: "rgb(2 25 60)", textAlign: "center", width: "150px", height: "40px", color: "white", fontWeight: "bold" }}
                                            onClick={() => {
                                                addToCart(item.id);
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: "center", textTransform: "capitalize", padding: "280px", fontSize: "40px", fontFamily: "Times New Roman", fontWeight: "600" }}>not available!</p>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Product successfully added to the cart!</p>
                        <button onClick={() => setShowSuccessPopup(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};


