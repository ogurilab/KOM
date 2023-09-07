import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClickHandler: () => void;
};

export function Button({ children }: Props) {
  return (
    <button type="button" onClick={onClickHandler}>
      {children}
    </button>
  );
}
