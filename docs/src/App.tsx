import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import ReactJson from 'react-json-view';
import Cookies from 'js-cookie';

import Accordion from './Accordion';
import connectSocket from './socket';
import type { AccordionItem, ErrorRes, EventData, EventName, User } from './socket';

const servers = import.meta.env.DEV
  ? {
      'Local Server': 'ws://localhost:3000',
    }
  : ({
      'Live Server': 'wss://typescript-vercel-template.vercel.app',
    } as const);

const namespaces = {
  'Protected Route': '/',
  'Public Route': '/anonymous',
} as const;

type Props = object;

const App: React.FC<Props> = () => {
  const [server, setServer] = useState<(typeof servers)[keyof typeof servers]>(
    servers[import.meta.env.DEV ? 'Local Server' : 'Live Server']
  );
  const [namespace, setNamespace] = useState<(typeof namespaces)[keyof typeof namespaces]>(
    namespaces['Protected Route']
  );
  const [token, setToken] = useState(Cookies.get('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));
  const [showPopup, setShowPopup] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [eventName, setEventName] = useState<EventName | undefined>();
  const [eventData, setEventData] = useState<EventData | undefined>();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<ErrorRes>({ status: 200, message: '' });
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [accordions, setAccordion] = useState<AccordionItem[]>([
    { key: 1, isOpen: true },
    { key: 2, isOpen: true },
  ]);

  const errorRef = useRef<HTMLLIElement>(null);

  const { socket, addUser, startConnection, closeConnection } = useMemo(
    () => connectSocket(`${server}${namespace}`, isAuthenticated),
    [isAuthenticated, namespace, server]
  );

  useEffect(() => {
    if (!socket) return;
    const handleGetUsers = (data: User[]): void => {
      setUsers(data);
    };
    socket.on('getUsers', handleGetUsers);
    return () => {
      socket.off('getUsers', handleGetUsers);
    };
  }, [socket, isConnected]);

  useEffect(() => {
    if (!socket) return;
    const handleGetError = (data: ErrorRes): void => {
      setError(data);
    };
    socket.on('eventError', handleGetError);
    socket.on('connect_error', err => {
      handleGetError({
        status: 500,
        message: err?.message?.toLowerCase() || 'something went wrong',
      });
      closeConnection();
      setToken('');
      setIsAuthenticated(false);
      Cookies.remove('token');
      setIsConnected(false);
      if (
        err?.message?.includes('please login to continue') ||
        err?.message?.includes('user not found')
      ) {
        setTimeout(() => {
          setShowPopup(true);
        }, 1000);
      }
    });
    return () => {
      socket.off('eventError', handleGetError);
    };
  }, [socket, isConnected, closeConnection]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleConnection = (): void => {
    setError({ status: 200, message: '' });
    if (isConnected) {
      closeConnection();
      setToken('');
      setIsAuthenticated(false);
      Cookies.remove('token');
      setIsConnected(false);
    } else {
      startConnection();
      setIsConnected(true);
    }
  };

  const sendEvent = (): void => {
    if (!eventName || !eventData) return;
    setError({ status: 200, message: '' });
    switch (eventName) {
      case 'addUser':
        addUser(eventData);
        break;
      default:
        break;
    }
    errorRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const toggleTheme = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleAccordion = (accordionkey: number): void => {
    const updatedAccordions = accordions.map(accord => {
      if (accord.key === accordionkey) {
        return { ...accord, isOpen: !accord.isOpen };
      } else {
        return accord;
      }
    });
    setAccordion(updatedAccordions);
  };

  const setJWTToken = (): void => {
    if (token?.trim()) {
      Cookies.set('token', token, {
        expires: 1,
        secure: true,
        sameSite: 'lax',
      });
      setIsAuthenticated(true);
      setShowPopup(false);
    }
  };

  return (
    <>
      <div className="px-6 py-10 w-full mx-auto space-y-10">
        <div className="flex flex-col gap-4">
          <select
            title="select server"
            value={server}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setServer(e.target.value as (typeof servers)[keyof typeof servers]);
            }}
            disabled={isConnected}
            className="bg-gray-50 border border-gray-300 text-black dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block h-fit w-1/2 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {Object.entries(servers).map(([key, url]) => (
              <option key={key} value={url}>{`${url} - ${key}`}</option>
            ))}
          </select>
          <select
            title="select namespace"
            value={namespace}
            onChange={e => {
              setNamespace(e.target.value as (typeof namespaces)[keyof typeof namespaces]);
            }}
            disabled={isConnected}
            className="bg-gray-50 border border-gray-300 text-black dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block h-fit w-1/2 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {Object.entries(namespaces).map(([key, url]) => (
              <option key={key} value={url}>{`${server}${url} - ${key}`}</option>
            ))}
          </select>
          <div className="flex gap-4">
            <button
              onClick={toggleConnection}
              className="w-fit px-4 py-1 bg-blue-500 text-white rounded">
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
            <button
              onClick={() => {
                setShowPopup(true);
              }}
              className="w-fit px-4 py-1 bg-gray-500 text-white rounded">
              {isAuthenticated ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                  fill="white"
                  focusable="false">
                  <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8zM12 8H8V5.199C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                  fill="white"
                  focusable="false">
                  <path d="M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col gap-6 justify-start items-start">
          <Accordion
            key={1}
            title="Send Events"
            isOpen={accordions[0].isOpen}
            toggleAccordion={() => {
              toggleAccordion(1);
            }}
            data={
              <ul className="mt-4">
                <li className="p-6 border rounded mt-4">
                  <div className="text-black dark:text-white font-bold text-base">
                    Name:{' '}
                    <span className="ml-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 text-black dark:text-white text-sm rounded-lg py-1 px-2.5 dark:border-gray-600 dark:text-white">
                      addUser
                    </span>
                  </div>
                  <p className="text-sm text-black dark:text-white mt-2 mb-4">
                    Description: Add a user.
                  </p>
                  <div className="text-sm text-black dark:text-white mt-2 mb-8">
                    Schema:
                    <ReactJson
                      name="data"
                      src={{}}
                      enableClipboard={false}
                      quotesOnKeys={false}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      theme={theme === 'light' ? 'bright:inverted' : 'bright'}
                    />
                  </div>
                  {eventName === 'addUser' ? (
                    <>
                      <p>Try it:</p>
                      <textarea
                        title="event data input"
                        rows={3}
                        value={JSON.stringify(eventData, null, 4)}
                        onChange={e => {
                          setEventData(JSON.parse(e.target.value));
                        }}
                        className="bg-gray-50 border border-gray-300 text-black dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <button
                        onClick={sendEvent}
                        disabled={!isConnected}
                        className="mt-4 px-3 py-1 bg-green-500 text-white text-sm rounded disabled:opacity-70 disabled:cursor-not-allowed">
                        Send
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEventName('addUser');
                        setEventData({});
                      }}
                      className="mt-4 px-3 py-1 bg-blue-500 text-white text-sm rounded">
                      Try now
                    </button>
                  )}
                </li>
              </ul>
            }
          />
          <Accordion
            key={2}
            title="Receive Events"
            isOpen={accordions[1].isOpen}
            toggleAccordion={() => {
              toggleAccordion(2);
            }}
            data={
              <ul className="mt-4">
                <li ref={errorRef} className="p-6 border rounded mt-4">
                  <div className="text-black dark:text-white font-bold text-base">
                    Name:{' '}
                    <span className="ml-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 text-black dark:text-white text-sm rounded-lg py-1 px-2.5 dark:border-gray-600 dark:text-white">
                      eventError
                    </span>
                  </div>
                  <p className="text-sm text-black dark:text-white mt-2 mb-4">
                    Description: Get error message after sending an event.
                  </p>
                  <div className="text-sm text-black dark:text-white mt-2 mb-8">
                    Schema:
                    <ReactJson
                      name="error"
                      src={{ status: 'number', message: 'string' }}
                      enableClipboard={false}
                      quotesOnKeys={false}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      theme={theme === 'light' ? 'bright:inverted' : 'bright'}
                    />
                  </div>
                  <div className="text-sm">
                    Response:
                    <ReactJson
                      name="error"
                      src={error}
                      enableClipboard={false}
                      quotesOnKeys={false}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      theme={theme === 'light' ? 'bright:inverted' : 'bright'}
                    />
                  </div>
                </li>
                <li className="p-6 border rounded mt-4">
                  <div className="text-black dark:text-white font-bold text-base">
                    Name:{' '}
                    <span className="ml-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 text-black dark:text-white text-sm rounded-lg py-1 px-2.5 dark:border-gray-600 dark:text-white">
                      getUsers
                    </span>
                  </div>
                  <p className="text-sm text-black dark:text-white mt-2 mb-4">
                    Description: Get all online users.
                  </p>
                  <div className="text-sm text-black dark:text-white mt-2 mb-8">
                    Schema:
                    <ReactJson
                      name="users"
                      src={[
                        {
                          userId: 'string',
                          socketId: 'string',
                        },
                      ]}
                      enableClipboard={false}
                      quotesOnKeys={false}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      theme={theme === 'light' ? 'bright:inverted' : 'bright'}
                    />
                  </div>
                  <div className="text-sm">
                    Response:
                    <ReactJson
                      name="users"
                      src={users}
                      enableClipboard={false}
                      quotesOnKeys={false}
                      displayDataTypes={false}
                      displayObjectSize={false}
                      theme={theme === 'light' ? 'bright:inverted' : 'bright'}
                    />
                  </div>
                </li>
              </ul>
            }
          />
        </div>
      </div>
      <div
        className={`${
          showPopup ? 'fixed z-10 opacity-100' : '-z-10 hidden'
        } inset-0 w-screen h-screen flex items-start justify-center pt-[1vh] bg-black bg-opacity-50`}>
        <div className="bg-[#fafafa] dark:bg-[#1f1f1f] text-[#3b4151] dark:text-[rgb(181,186,201)] p-6 rounded-md shadow-lg w-[90%] md:w-[50%]">
          <h2 className="text-lg font-bold mb-4">cookieAuth (apiKey)</h2>
          <p className="text-[12px]">Name: token</p>
          <p className="text-[12px]">In: cookie</p>
          <p className="text-[12px]">Value:</p>
          <input
            type="text"
            className="mt-2 bg-gray-50 border border-gray-300 text-black dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="paste token here..."
            value={token}
            onChange={e => {
              setToken(e.target.value);
            }}
          />
          <div className="mt-4 flex justify-end space-x-2">
            <button className="px-4 py-1 bg-green-500 text-white rounded" onClick={setJWTToken}>
              Authorize
            </button>
            <button
              className="px-4 py-1 bg-blue-500 text-white rounded"
              onClick={() => {
                setShowPopup(false);
              }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={toggleTheme}
        className="fixed top-3 right-3 flex items-center justify-center px-2 py-1.5 border rounded-xl shadow-md transition-all duration-300 dark:bg-gray-800 dark:text-white dark:border-white/20 dark:shadow-white/20 bg-white text-gray-800 border-gray-800/20 shadow-gray-800/20 hover:scale-105 active:scale-95">
        {theme === 'light' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        )}
      </button>
    </>
  );
};

export default App;
