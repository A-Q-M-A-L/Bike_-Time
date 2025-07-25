import logo from "../assets/images/logo.png"


const Header = () => {

  return (
    <header className="flex justify-between items-center px-8 py-6 !bg-transparent relative z-[999">
      <nav className="flex gap-6 text-sm font-bold uppercase">
        <a href="#" className="link-hover">Fietsen</a>
        <a href="#" className="link-hover">Onderdelen</a>
      </nav>
      <div className="w-32" alt="BikeTime Logo">
       <img src={logo} className="w-32 h-full" alt="" />
      </div>
      <nav className="flex gap-6 text-sm font-bold uppercase">
        <a href="#" className="link-hover">Over</a>
        <a href="#" className="link-hover">Contact</a>
      </nav>
    </header>
  )

}

export default Header;