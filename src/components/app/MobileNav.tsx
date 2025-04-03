
import { Home, Users, FileText, Settings, Briefcase } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: "Główna", 
      icon: <Home size={20} />, 
      path: "/dashboard",
      active: location.pathname === "/dashboard"
    },
    { 
      name: "Klienci", 
      icon: <Users size={20} />, 
      path: "/clients",
      active: location.pathname.includes("/clients")
    },
    { 
      name: "Sesje", 
      icon: <FileText size={20} />, 
      path: "/sessions",
      active: location.pathname.includes("/sessions")
    },
    { 
      name: "Narzędzia", 
      icon: <Briefcase size={20} />, 
      path: "/tools",
      active: location.pathname.includes("/tools")
    },
    { 
      name: "Ustawienia", 
      icon: <Settings size={20} />, 
      path: "/settings",
      active: location.pathname.includes("/settings")
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-sm md:hidden">
      <div className="flex justify-around">
        {navItems.map(item => (
          <Link 
            key={item.name} 
            to={item.path}
            className={`flex flex-col items-center py-2 px-4 ${
              item.active 
                ? "text-mindway-primary" 
                : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
