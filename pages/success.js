import React, { useEffect, useState } from 'react'
import { useStateContext } from '../context/StateContext'
import { BsBagCheckFill } from "react-icons/bs";
import Link from 'next/link';
import { dispFireworks } from '../lib/utils';
import { client, urlFor } from '../lib/client';

const Success = ({ memeData }) => {
    // console.log(memeData[0].image);

    const { setCartItems, setTotalPrice, setTotalQuantities, meme, setMeme } = useStateContext();
    
    const toggleMeme = () => !meme ? setMeme(true) : setMeme(false); 

    useEffect(() => {
      localStorage.clear();

      setCartItems([]);
      setTotalPrice(0);
      setTotalQuantities(0);
      
      dispFireworks();
    
    }, [])
        
  return (
    <div className='success-wrapper'>
        <div className='transition'>
            {meme && (
                <img
                    src={urlFor(memeData[0].image)}
                    className="meme-image"
                    alt={memeData[0].title}
                    onClick={dispFireworks} 
                />
            )}
        </div>

        <div className='success'>

            <p className='icon'>
                <BsBagCheckFill
                    onClick={toggleMeme}
                    title='This is so dumb but Ed wanted it here smh'
                />
            </p>
            
            <h2>Thank you for your order!</h2>
            
            <p className='email-msg'>Check your email inbox for your receipt.</p>

            <p className='description'>
                If you have any questions please email 
                <a className='email' href='mailto:emporium@info.com'>
                emporium@info.com
                </a>
            </p>
            <Link href="/">
                
                <button type='button' className='btn'>
                    Continue Shopping
                </button>
                
            </Link>
        </div>

    </div>
  )
}
export const getServerSideProps = async () => {

    const memeQuery = '*[_type == "meme"]';
    const memeData = await client.fetch(memeQuery);
  
    return {
      props: { memeData }
    }
  }
  
export default Success