// import React, { useState, useRef, useEffect } from "react";
// import "./WindowDropdown.css";
// import ethImg from "../../assets/icons/eth.svg";
// import solImg from "../../assets/icons/sol.svg";
// import polImg from "../../assets/icons/polygon.png";
// import bnbImg from "../../assets/icons/bnb.png";
// import { useNavigate } from "react-router-dom";

// const WindowDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const blockChain = localStorage.getItem("blockchain");
//   const [selectedOption, setSelectedOption] = useState(
//     blockChain === null ? localStorage.setItem("blockchain", "SOL") : blockChain
//   );

//   const dropdownRef = useRef(null);
//   console.log("selectedOption", selectedOption);

//   const toggleDropdown = () => setIsOpen(!isOpen);

//   const handleClickOutside = (event) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       setIsOpen(false);
//     }
//   };

//   const removeAllCookies = () => {
//     const cookies = document.cookie.split("; ");
//     for (let cookie of cookies) {
//       const equalsPos = cookie.indexOf("=");
//       const name = equalsPos > -1 ? cookie.substr(0, equalsPos) : cookie;
//       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//     }
//   };

//   const selectOption = (option) => {

//     setSelectedOption(option);
//     localStorage.setItem("blockchain", option);

//     setIsOpen(false);
//     navigate("/");
//     window.location.reload(); // Refresh the page
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="win2000-select-container" ref={dropdownRef}>
//       <div className="win2000-select" onClick={toggleDropdown}>
//         <img
//           src={selectedOption === "SOL" ? solImg : ethImg}
//           alt={selectedOption}
//           className="dropdown-icon"
//         />
//         <span>{selectedOption}</span>
//       </div>
//       {isOpen && (
//         <div className="win2000-dropdown-options">
//           <div className="win2000-option" onClick={() => selectOption("SOL")}>
//             <img src={solImg} alt="SOL" className="dropdown-icon" />
//             SOL
//           </div>
//           <div className="win2000-option" onClick={() => selectOption("ETH")}>
//             <img src={ethImg} alt="ETH" className="dropdown-icon" />
//             ETH
//           </div>
//           <div className="win2000-option" onClick={() => selectOption("POL")}>
//             <img src={polImg} alt="POL" className="dropdown-icon" />
//             POL
//           </div>
//           <div className="win2000-option" onClick={() => selectOption("BNB")}>
//             <img src={bnbImg} alt="BNB" className="dropdown-icon" />
//             BNB
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WindowDropdown;



import React, { useState, useRef, useEffect } from "react";
import "./WindowDropdown.css";
import ethImg from "../../assets/icons/eth.svg";
import solImg from "../../assets/icons/sol.svg";
import polImg from "../../assets/icons/polygon.png";
import bnbImg from "../../assets/icons/bnb.png";
import { useNavigate } from "react-router-dom";
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react";

const WindowDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAppKitAccount()
  const navigate = useNavigate()
   const { disconnect } = useDisconnect()
  const blockChain = localStorage.getItem("blockchain")
  const [selectedOption, setSelectedOption] = useState(blockChain === null ? localStorage.setItem("blockchain", "SOL") : blockChain);

  const dropdownRef = useRef(null);
  console.log("selectedOption", selectedOption)


  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const selectOption = async (option) => {
    console.log("selected notiio",option,isConnected)
   
  
    setSelectedOption(option);
    localStorage.setItem("blockchain", option
      // option === 'SOL' ? 'SOL' :
      //   option === 'ETH' ? 'ethereum' :
      //     option === 'POL' ? 'polygon' :
      //       option === 'BNB' ? 'bsc' :
      //         'solana'
    );

   if(isConnected){ setIsOpen(false);
    await disconnect()
    navigate('/')
    document.cookie.split(";").forEach(cookie => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    window.location.reload(); // Refresh the page
  }else{
    document.cookie.split(";").forEach(cookie => {
      const [name] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    navigate('/')
    window.location.reload(); // Refresh the page
  }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="win2000-select-container" ref={dropdownRef}>
      <div className="win2000-select" onClick={toggleDropdown}>
        <img
          src={selectedOption === "SOL" ? solImg : ethImg}
          alt={selectedOption}
          className="dropdown-icon"
        />
        <span>{selectedOption ==="BNB"?"ETH":selectedOption}</span>
      </div>
      {isOpen && (
        <div className="win2000-dropdown-options">
          <div className="win2000-option" onClick={() => selectOption("SOL")}>
            <img src={solImg} alt="SOL" className="dropdown-icon" />
            SOL
          </div>
          <div className="win2000-option" onClick={() => selectOption("BNB")}>
            <img src={ethImg} alt="BNB" className="dropdown-icon" />
            ETH
          </div>
          {/* <div className="win2000-option" onClick={() => selectOption("POL")}>
            <img src={polImg} alt="POL" className="dropdown-icon" />
            POL
          </div>
          <div className="win2000-option" onClick={() => selectOption("BNB")}>
            <img src={bnbImg} alt="BNB" className="dropdown-icon" />
            BNB
          </div> */}
        </div>
      )}
    </div>
  );
};

export default WindowDropdown;
