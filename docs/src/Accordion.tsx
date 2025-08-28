import React from 'react';

interface Props {
  title: string;
  isOpen: boolean;
  data: React.JSX.Element;
  toggleAccordion: () => void;
}

const Accordion: React.FC<Props> = ({ title, isOpen, data, toggleAccordion }: Props) => (
  <div className="w-full border p-6 rounded shadow-md">
    <button
      className="w-full flex justify-between items-center text-left transition duration-300"
      onClick={toggleAccordion}>
      <h2 className="text-black dark:text-white text-xl font-semibold">{title}</h2>
      <span
        className={`float-right transition-transform duration-300 ease-out will-change-transform ${
          isOpen ? 'rotate-180' : 'rotate-0'
        }`}>
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </button>
    {isOpen && data}
  </div>
);

export default Accordion;
