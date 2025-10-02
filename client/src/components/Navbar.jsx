import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar w-full p-4 flex justify-between bg-black text-white text-[16px]">
        <div className="navbar__logo">
            {/* <h1 className='font-semibold'>Flagright</h1> */}
            <Link to="/">
            <img src="https://cdn.prod.website-files.com/64f420094266acf96b6d3f84/64f4202e5cb2cbb8378b2092_logo-dark.svg" className='max-h-[28px]' alt="" />
            </Link>
        </div>
        <ul className="navbar__links flex gap-4">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/transactions">Transactions</Link></li>
            {/* <li><Link to="/relationships">Relationships</Link></li> */}
        </ul>
    </nav>    ) 
}
    
export default Navbar   