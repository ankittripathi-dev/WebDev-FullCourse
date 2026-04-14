import React, { createContext } from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Key } from 'lucide-react';

const storecontext = createContext()

export default function Context(props) {



    const [allproduct, setproduct] = useState([]);
    const [cart, setcart] = useState([]);

    useEffect(
        () => {

            let api = axios.get('https://dummyjson.com/products?limit=195');

            api.then(

                (Response) => {

                    setproduct(Response.data.products)


                }).catch((error) => {
                    setproduct([])

                })
        }, []
    )

    const addtocart = (id) => {

        const product = allproduct.find((prod) => prod.id == id);

        if (product) {

            const cartproduct = cart.find((cd) => cd.id == id);
            if (cartproduct) {

                const updatecart = cart.map(
                    (item) => {

                        return item.id == id ? { ...item, qty: item.qty + 1 } : item

                    }
                )

                setcart(updatecart)


            } else {

                setcart([...cart, { ...product, qty: 1 }])

            }

        }

    }

    const qtyhandler = (id, flag) => {

        let updatecart;

        const product = allproduct.find((prod) => prod.id == id);

        if (product) {

            const cartproduct = cart.find((cd) => cd.id == id);
            if (cartproduct) {

                if (flag == 1) {

                    updatecart = cart.map(
                        (item) => {

                            return item.id == id ? { ...item, qty: item.qty + 1 } : item

                        }
                    )

                } else {

                    updatecart = cart.map(
                        (item) => {

                            return item.id == id ? { ...item, qty: item.qty - 1 } : item

                        }
                    )

                }



                setcart(updatecart)


            }

        }

    }


    const removeItem = (id) => {

       

        const updatedCart = cart.filter((item) => item.id !== id);
        setcart(updatedCart);
    };

    return (
        <storecontext.Provider value={{ addtocart, cart, qtyhandler, removeItem,allproduct }}>
            {props.children}
        </storecontext.Provider>
    )
}



export { storecontext }