import React from "react";
import styles from "./Button.module.css";

export interface ButtonsProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  icon?: React.ReactNode;
  variant?: "undoBtn" | "inputting" | "danger"; 
}

export const Buttons: React.FC<ButtonsProps> = ({
  label,
  onClick,
  type = "button",
  icon,
  variant = "undoBtn",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${styles[variant]}`}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {label}
    </button>
  );
};
