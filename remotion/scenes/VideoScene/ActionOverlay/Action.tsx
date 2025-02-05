import React, { useCallback, useState } from "react";

export const ActionContainer: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}> = ({ children, onClick, disabled }) => {
  const [hovered, setHovered] = useState(false);
  const onPointerEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onPointerLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      type="button"
      style={{
        width: "100%",
        fontSize: 24,
        fontFamily: "sans-serif",
        fontWeight: "bold",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: 12,
        gap: 20,
        cursor: "pointer",
        appearance: "none",
        border: "none",
        borderRadius: 0,
        background: "none",
        color: "black",
        opacity: disabled ? 0.5 : hovered ? 1 : 0.7,
      }}
    >
      {children}
    </button>
  );
};
