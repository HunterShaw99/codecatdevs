import React, { createContext, useContext, useReducer } from 'react';

/**
 * Represents the state of the widget manager.
 */
type WidgetState = {
  expandedId: string | null;
  activeWidget: string | null;
  subWidgets: {
    analysis: {
      measure: boolean;
      searchRings: boolean;
      routeTool: boolean;
    };
  };
};

/**
 * Defines the possible actions that can be dispatched to update the widget state.
 */
type Action =
  | { type: 'TOGGLE_WIDGET'; id: string }
  | { type: 'SET_ACTIVE_WIDGET'; id: string }
  | { type: 'CLEAR_ACTIVE_WIDGET' }
  | { type: 'TOGGLE_SUB_WIDGET'; widgetId: string; subWidgetId: string }
  | { type: 'COLLAPSE_ALL' };

/**
 * The initial state of the widget manager.
 */
const initialState: WidgetState = {
  expandedId: null,
  activeWidget: null,
  subWidgets: {
    analysis: {
      measure: false,
      searchRings: false,
      routeTool: false
    }
  }
};

/**
 * Reducer function that handles state transitions based on dispatched actions.
 * @param state - The current state of the widget manager.
 * @param action - The action to be performed.
 * @returns The new state after applying the action.
 */
const reducer = (state: WidgetState, action: Action): WidgetState => {
  switch (action.type) {
    case 'TOGGLE_WIDGET':
      if (state.expandedId === action.id) {
        return {
          ...state,
          expandedId: null,
          activeWidget: null
        };
      }

      return {
        ...state,
        expandedId: action.id,
        activeWidget: action.id,
        subWidgets: {
          ...state.subWidgets,
          analysis: initialState.subWidgets.analysis
        }
      };

    case 'SET_ACTIVE_WIDGET':
      return {
        ...state,
        activeWidget: action.id
      };

    case 'CLEAR_ACTIVE_WIDGET':
      return {
        ...state,
        activeWidget: null,
        subWidgets: {
          ...state.subWidgets,
          analysis: initialState.subWidgets.analysis
        }
      };

    case 'TOGGLE_SUB_WIDGET':
      if (action.widgetId === 'analysis') {
        const currentSubWidget = state.subWidgets.analysis[action.subWidgetId as keyof typeof state.subWidgets.analysis];

        if (currentSubWidget) {
          return {
            ...state,
            subWidgets: {
              ...state.subWidgets,
              analysis: {
                ...state.subWidgets.analysis,
                [action.subWidgetId]: false
              }
            }
          };
        }

        return {
          ...state,
          subWidgets: {
            ...state.subWidgets,
            analysis: {
              measure: action.subWidgetId === 'measure',
              searchRings: action.subWidgetId === 'searchRings',
              routeTool: action.subWidgetId === 'routeTool'
            }
          }
        };
      }
      return state;

    case 'COLLAPSE_ALL':
      return {
        ...initialState
      };

    default:
      return state;
  }
};

/**
 * Context for the widget manager, providing state and actions to components.
 */
const WidgetContext = createContext<{
  state: WidgetState;
  isExpanded: (id: string) => boolean;
  isActive: (id: string) => boolean;
  isSubWidgetActive: (widgetId: string, subWidgetId: string) => boolean;
  toggleWidget: (id: string) => void;
  setActiveWidget: (id: string) => void;
  clearActiveWidget: () => void;
  toggleSubWidget: (widgetId: string, subWidgetId: string) => void;
  collapseAll: () => void;
} | null>(null);

/**
 * Provider component that wraps the application and provides the widget manager context.
 * @param children - The child components that will have access to the widget manager.
 */
export const WidgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    state,
    isExpanded: (id: string) => state.expandedId === id,
    isActive: (id: string) => state.activeWidget === id,
    isSubWidgetActive: (widgetId: string, subWidgetId: string) => {
      if (widgetId === 'analysis') {
        return state.subWidgets.analysis[subWidgetId as keyof typeof state.subWidgets.analysis] || false;
      }
      return false;
    },
    toggleWidget: (id: string) => dispatch({ type: 'TOGGLE_WIDGET', id }),
    setActiveWidget: (id: string) => dispatch({ type: 'SET_ACTIVE_WIDGET', id }),
    clearActiveWidget: () => dispatch({ type: 'CLEAR_ACTIVE_WIDGET' }),
    toggleSubWidget: (widgetId: string, subWidgetId: string) =>
      dispatch({ type: 'TOGGLE_SUB_WIDGET', widgetId, subWidgetId }),
    collapseAll: () => dispatch({ type: 'COLLAPSE_ALL' }),
  };

  return <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>;
};

/**
 * Custom hook to access the widget manager context.
 * @returns The widget manager context.
 * @throws Will throw an error if used outside of a WidgetProvider.
 */
export const useWidgetManager = () => {
  const ctx = useContext(WidgetContext);
  if (!ctx) throw new Error('useWidgetManager must be used inside WidgetProvider');
  return ctx;
};