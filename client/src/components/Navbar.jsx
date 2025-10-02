import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass w-full p-4 flex justify-between text-white text-[16px]">
        <div className="navbar__logo heading-neon text-xl">
            <Link to="/">Graph Explorer</Link>
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