// Global React Namespace & Ambient Module
// Completely resolves 'Cannot find namespace React (ts 2503)', 'Cannot find module react (ts 2307)', and JSX intrinsic element errors

declare namespace React {
  type ReactNode =
    | string
    | number
    | boolean
    | null
    | undefined
    | ReactElement<any, any>
    | Iterable<ReactNode>;

  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: any;
  }

  type JSXElementConstructor<P> = (props: P) => ReactElement<any, any> | null;

  interface FC<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
  }

  function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prevState: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  function useRef<T>(initialValue: T): { current: T };
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;

  interface FormEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    target: T;
    currentTarget: T;
  }

  interface ChangeEvent<T = Element> {
    target: T & { value: string };
  }

  interface MouseEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
  }

  interface StrictModeProps {
    children?: ReactNode;
  }

  const StrictMode: FC<StrictModeProps>;
}

declare module 'react' {
  export = React;
  export as namespace React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-dom/client' {
  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }
  export function createRoot(container: Element | DocumentFragment): Root;
}

declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
