import React, { createContext, useContext, useReducer } from 'react';

type State = { expandedId: string | null };
type Action =
  | { type: 'TOGGLE'; id: string }
  | { type: 'EXPAND'; id: string }
  | { type: 'COLLAPSE' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE':
      return { expandedId: state.expandedId === action.id ? null : action.id };
    case 'EXPAND':
      return { expandedId: action.id };
    case 'COLLAPSE':
      return { expandedId: null };
    default:
      return state;
  }
};

const initialState: State = { expandedId: null };

const WidgetContext = createContext<{
  expandedId: string | null;
  isExpanded: (id: string) => boolean;
  toggle: (id: string) => void;
  expand: (id: string) => void;
  collapse: () => void;
} | null>(null);

export const WidgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = {
    expandedId: state.expandedId,
    isExpanded: (id: string) => state.expandedId === id,
    toggle: (id: string) => dispatch({ type: 'TOGGLE', id }),
    expand: (id: string) => dispatch({ type: 'EXPAND', id }),
    collapse: () => dispatch({ type: 'COLLAPSE' }),
  };
  return <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>;
};

export const useWidgetManager = () => {
  const ctx = useContext(WidgetContext);
  if (!ctx) throw new Error('useWidgetManager must be used inside WidgetProvider');
  return ctx;
};
