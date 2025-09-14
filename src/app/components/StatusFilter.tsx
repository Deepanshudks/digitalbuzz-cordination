import React from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DropDownInput from "./utils/DropDownInput";
import { branches } from "../static";

interface StatusFilterProps {
  status: string;
  branch: string;
  setStatus: (status: string) => void;
  setBranch: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  status,
  setStatus,
  branch,
  setBranch,
}) => {
  const statuses = ["", "PENDING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    handleMenuClose();
  };

  return (
    <div className="w-full flex justify-between items-center">
      <div className="hidden sm:flex flex-wrap items-center gap-2 bg-gray-100 p-3 rounded-lg shadow-sm">
        {statuses.map((value) => {
          const label = value === "" ? "All Tasks" : value.replace(/_/g, " ");
          const isActive = value === status;

          return (
            <button
              key={value || "all"}
              onClick={() => setStatus(value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer 
                ${
                  isActive
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-blue-50"
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <div className="sm:hidden flex items-center bg-white p-2 rounded-xl shadow-md border border-gray-200">
          <IconButton
            onClick={handleMenuOpen}
            className="hover:bg-blue-50 transition-colors duration-200"
            size="large"
          >
            <MenuIcon className="text-gray-700" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              className:
                "rounded-lg shadow-xl border border-gray-100 bg-white min-w-[150px]",
            }}
            MenuListProps={{
              className: "py-2",
            }}
          >
            {statuses.map((value) => {
              const label =
                value === "" ? "All Tasks" : value.replace(/_/g, " ");
              const isSelected = value === status;

              return (
                <MenuItem
                  key={value || "all"}
                  selected={isSelected}
                  onClick={() => handleStatusChange(value)}
                  className={`transition-colors duration-150 rounded-md mx-1 ${
                    isSelected
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {label}
                </MenuItem>
              );
            })}
          </Menu>
        </div>
        <div className="px-4">
          <DropDownInput
            options={branches}
            name="branch"
            placeholder="Select branch"
            className="w-40"
            label="Select Branch"
            value={branch}
            setValue={setBranch}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;
