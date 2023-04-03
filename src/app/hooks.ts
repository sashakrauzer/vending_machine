import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import { useState, useEffect, useRef } from "react";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useErrorTimeout = (
  defaultState: boolean
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [error, setError] = useState(defaultState);
  const timerId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (error) {
      timerId.current = setTimeout(() => setError(false), 1500);
    }

    return () => clearTimeout(timerId.current);
  }, [error]);

  return [error, setError];
};
