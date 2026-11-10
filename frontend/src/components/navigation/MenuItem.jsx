import { useNavigate, useLocation } from "react-router-dom";

const MenuItem = ({ label, path, icon, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === path;

  return (
    <div
      onClick={() => navigate(path)}
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-white/10"
      style={{
        backgroundColor: isActive ? "#1B4A75" : "transparent",
        color: isActive ? "white" : "#A4B5C7",
        alignSelf: "stretch",
      }}
    >
      {icon}

      {isOpen && (
        <span className="text-sm font-medium">
          {label}
        </span>
      )}
    </div>
  );
};

export default MenuItem;
