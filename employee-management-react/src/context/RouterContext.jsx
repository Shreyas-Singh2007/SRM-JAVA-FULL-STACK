import React, { createContext, useContext, useState, useEffect } from 'react';

const RouterContext = createContext(null);

export const Router = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to) => {
    if (to !== currentPath) {
      window.history.pushState({}, '', to);
      setCurrentPath(to);
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useNavigate = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useNavigate must be used within a Router');
  return ctx.navigate;
};

export const useLocation = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useLocation must be used within a Router');
  return { pathname: ctx.currentPath };
};

export const useParams = () => {
  const { currentPath } = useContext(RouterContext);
  // Match patterns like /employees/:id
  const match = currentPath.match(/\/employees\/([^/]+)/);
  if (match) {
    return { id: match[1] };
  }
  return {};
};

export const Link = ({ to, children, className = '', activeClassName = '', style = {}, onClick, ...props }) => {
  const { currentPath, navigate } = useContext(RouterContext);
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    navigate(to);
  };

  const combinedClass = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a href={to} onClick={handleClick} className={combinedClass} style={style} {...props}>
      {children}
    </a>
  );
};

export const Routes = ({ children }) => {
  const { currentPath } = useContext(RouterContext);
  let matchedElement = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child) || matchedElement) return;

    const { path, element } = child.props;
    if (path === currentPath) {
      matchedElement = element;
    } else if (path.includes(':')) {
      // Dynamic route matching, e.g. /employees/:id
      const regexPattern = '^' + path.replace(/:[a-zA-Z0-9_]+/g, '([^/]+)') + '$';
      const regex = new RegExp(regexPattern);
      if (regex.test(currentPath)) {
        matchedElement = element;
      }
    } else if (path === '*' && !matchedElement) {
      matchedElement = element;
    }
  });

  return matchedElement;
};

export const Route = ({ path, element }) => null;
