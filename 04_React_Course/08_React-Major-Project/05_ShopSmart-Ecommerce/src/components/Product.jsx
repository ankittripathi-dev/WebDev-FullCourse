import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { storecontext } from './Context';


export default function Product() {

    const { addtocart } = useContext(storecontext)
    const [allproduct, setproduct] = useState([]);
    const [categories, setcategories] = useState([])
    const [loading, setloading] = useState(true);
    const { categorieslug } = useParams();
    const [totalpage, settotalpage] = useState(0)
    const limit = 30;
    const [current, setcurrent] = useState(0)




    const getcategories = () => {

      axios.get('https://dummyjson.com/products/categories').then(
            (response) => {
                setcategories(response.data)
            }
        ).catch((error) => {

            console.log(error)

        })
    }



    useEffect(
        () => {

            getcategories()
        }, []
    )

    useEffect(
        () => {

            setloading(true);

            let api = ""
            if (categorieslug == null) {

                api = axios.get('https://dummyjson.com/products');

            } else {

              api = axios.get("https://dummyjson.com/products/category/" + categorieslug);
            }

            api.then(

                (Response) => {

                    setproduct(Response.data.products)
                    settotalpage(Math.ceil(Response.data.total / limit))

                }).catch((error) => {
                    setproduct([])

                }).finally(() => {
                    setloading(false)
                })
        }, [categorieslug]
    )

    useEffect(() => {

        setloading(true);
        axios.get(`https://dummyjson.com/products?skip=${current * limit}`).then(

            (Response) => {

                setproduct(Response.data.products)


            }).catch((error) => {

                setproduct([])

            }).finally(() => {
                setloading(false)
            })



    }, [current]
    )





    const getPageClass = (i) => {
        return `px-4 ms-2 py-2 rounded-lg cursor-pointer border transition-all duration-300 ${
            current === i
                ? "bg-pink-500 text-white border-pink-500"
                : "bg-white text-gray-600 border-gray-300 hover:bg-pink-100 hover:text-pink-600"
        }`;
    };

    const pagination = [];
    for (let i = 0; i < totalpage; i++) {
        pagination.push(
            <li key={i} onClick={() => setcurrent(i)} className={getPageClass(i)}>
                {i + 1}
            </li>
        );
    }




    return (
        <div className='max-w-[1360px] mx-auto mt-18 '>
        <div className='max-w-[1300px] p-4'>
          <div className='grid gap-5 items-start   grid-cols-12 '>
            <ul className='hidden md:block col-span-2 '>
              <Link to="/">
                <li className={`shadow ${categorieslug == null ? "bg-pink-500 text-white" : ""} cursor-pointer p-3`}>
                  ALL
                </li>
              </Link>
              {
                categories.map((cat, index) => {
                  return (
                    <Link key={index} to={`/${cat.slug}`}>
                      <li
                        className={`w-full ${categorieslug == cat.slug ? "bg-pink-500 text-white" : ""} cursor-pointer p-3 mb-3 shadow`}
                      >
                        {cat.name}
                      </li>
                    </Link>
                  );
                })
              }
            </ul>
      
            <div className='grid col-span-full  md:col-span-10 md:p-4 gap-5 items-start'>
            <ul className=' md:hidden flex flex-wrap'>
              <Link to="/">
                <li className={`shadow ${categorieslug == null ? "bg-pink-500 text-white" : ""} cursor-pointer p-3`}>
                  ALL
                </li>
              </Link>
              {
                categories.map((cat, index) => {
                  return (
                    <Link key={index} to={`/${cat.slug}`}>
                      <li
                        className={`w-full ${categorieslug == cat.slug ? "bg-pink-500 text-white" : ""} cursor-pointer p-3 mb-3 shadow`}
                      >
                        {cat.name}
                      </li>
                    </Link>
                  );
                })
              }
            </ul>
              <div className='grid gap-5 items-start md:grid-cols-2 lg:grid-cols-3'>
                {
                  loading == true ?
                    [1, 2, 3, 4, 5, 6, 7, 8].map((d, i) => <SkeletonCard key={i} />)
                    :
                    allproduct.map((prod, index) => {
                      return (
                        <div key={index} className="max-w-sm rounded-2xl overflow-hidden shadow-lg hover:scale-105 duration-100 bg-white p-5">
                          <Link to={`/productfulldetails/${prod.id}`}>
                            <img
                              className="w-full h-56 object-cover rounded-lg"
                              src={prod.thumbnail}
                              alt="Product"
                            />
                          </Link>
      
                          <div className="py-4">
                            <Link to={`/productfulldetails/${prod.id}`}>
                              <h2 className="text-xl font-semibold text-gray-900">{prod.title}</h2>
                              <p className="text-gray-600 mt-2">This is a short description of the product.</p>
                            </Link>
      
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-lg font-bold text-gray-900">$99.99</span>
                              <button
                                onClick={() => { addtocart(prod.id) }}
                                className="bg-pink-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                }
              </div>
      
              <ul className="flex -space-x-px text-sm mt-17 justify-center">
                {pagination}
              </ul>
            </div>
          </div>
        </div>
      </div>
      

    )
}



const SkeletonCard = () => {
    return (
        <div className="bg-white p-4 rounded-3xl shadow animate-pulse">
            <div className="h-48 bg-rose-100 rounded-xl mb-4"></div>
            <div className="space-y-3">
                <div className="h-4 bg-rose-200 rounded w-3/4"></div>
                <div className="h-4 bg-rose-200 rounded w-2/3"></div>
            </div>
            <div className="h-10 bg-rose-200 rounded-xl mt-4"></div>
        </div>
    );
};

