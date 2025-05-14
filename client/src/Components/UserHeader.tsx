import React from 'react'

interface UserHeaderProps {
    loggedInUser: string | null;
    }
const UserHeader: React.FC <UserHeaderProps> = ({loggedInUser}) => {
    
  return (
    <header style={{paddingInline:"5%"}} className="flex justify-between items-center fixed bg-white z-2 border-b-4 border-stone-200 top-0 right-0 w-full h-[70px] px-[10px]">

                <div className="flex items-center">
                <img src="/truck.jpg" alt="logo" className="w-[60px] translate-y-[-5px]"/>
                <h1 style={{ fontSize: "24px",fontWeight:"600",  }} >Dashboard</h1>
              </div>
              <div className="flex items-center justify-between bg-stone-100 border border-stone-300 rounded-full px-4 py-1 w-fit shadow-sm">
                <span className="text-sm text-stone-700">{loggedInUser}</span>
                <div className="ml-3 w-8 h-8 flex items-center justify-center rounded-full border-2 border-blue-900 bg-white text-blue-900 font-semibold">
                  {loggedInUser?.[0] ?? ""}
                </div>
              </div>

              
                
              
          
    
      </header>
  )
}

export default UserHeader