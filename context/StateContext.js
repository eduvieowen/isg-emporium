import React, { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { Product } from "../components";

const Context = createContext();
// console.log(children);
export const StateContext = ( {children} ) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    const [meme, setMeme] = useState(false);

    let foundProduct;
    let index;
    
    // adding product to cart
    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);
        
        if(checkProductInCart) {

            const updatedCart = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                };
            });

            setCartItems(updatedCart);
        } else {
            product.quantity = quantity;
            
            setCartItems([...cartItems, { ...product }]);
        }

        toast.success(qty > 1 ? `${qty} ${product.name}s added to the cart` : `${qty} ${product.name} added to the cart`);
    };

    // removing product from cart
    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);

        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
    }

    // increments or decrement product quantity
    const toggleCartItemQty = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);

        const newCartItems = cartItems.filter((item) => item._id !== id);
        // const newCartItems = filteredCartItems.reverse((item) => item._id !== id);
        // console.log(newCartItems);

        if(value === 'inc') {

            setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity + 1}]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price)
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);

        } else if (value === 'dec') {

            if (foundProduct.quantity > 1) {

                setCartItems([...newCartItems, {...foundProduct, quantity: foundProduct.quantity - 1}]);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);

            }
        }
    }    

    // increasing quantity count outside cart
    const increaseQty = () => {
        setQty((prevQuantity) => prevQuantity + 1);
    };
    // decreasing quantity count outside cart
    const decreaseQty = () => {
        setQty((prevQuantity) => {
            if(prevQuantity - 1 < 1) return 1;
            
            return prevQuantity - 1;
        });
    };

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                setCartItems,
                totalPrice,
                setTotalPrice,
                totalQuantities,
                setTotalQuantities,
                qty,
                increaseQty,
                decreaseQty,
                onAdd,
                onRemove,
                toggleCartItemQty,
                meme,
                setMeme,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);