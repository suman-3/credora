import React from "react";

interface AnimatedButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children = "Credits",
  onClick,
  className = "",
}) => {
  return (
    <>
      <style jsx global>{`
        .animated-button {
          --h-button: 48px;
          --w-button: 102px;
          --round: 1.5rem;
          background: radial-gradient(
              65.28% 65.28% at 50% 100%,
              rgba(152, 237, 99, 0.8) 0%,
              rgba(152, 237, 99, 0) 100%
            ),
            linear-gradient(0deg, #98ed63, #98ed63);
        }

        .animated-button::before,
        .animated-button::after {
          content: "";
          position: absolute;
          inset: var(--space);
          transition: all 0.5s ease-in-out;
          border-radius: calc(var(--round) - var(--space));
          z-index: 0;
        }

        .animated-button::before {
          --space: 1px;
          background: linear-gradient(
            177.95deg,
            rgba(255, 234, 113, 0.3) 0%,
            rgba(255, 234, 113, 0) 100%
          );
        }

        .animated-button::after {
          --space: 2px;
          background: radial-gradient(
              65.28% 65.28% at 50% 100%,
              rgba(152, 237, 99, 0.8) 0%,
              rgba(152, 237, 99, 0) 100%
            ),
            linear-gradient(0deg, #98ed63, #98ed63);
        }

        .animated-button:active {
          transform: scale(0.95);
        }

        .fold {
          background: radial-gradient(
            100% 75% at 55%,
            rgba(255, 234, 113, 0.9) 0%,
            rgba(255, 234, 113, 0) 100%
          );
          box-shadow: 0 0 3px rgba(152, 237, 99, 0.5);
        }

        .fold::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 150%;
          height: 150%;
          transform: rotate(45deg) translateX(0%) translateY(-18px);
          background-color: #ffea71;
          pointer-events: none;
        }

        .animated-button:hover .fold {
          margin-top: -1rem;
          margin-right: -1rem;
        }

        .point {
          animation: floating-points infinite ease-in-out;
        }

        @keyframes floating-points {
          0% {
            transform: translateY(0);
          }
          85% {
            opacity: 0;
          }
          100% {
            transform: translateY(-55px);
            opacity: 0;
          }
        }

        .point:nth-child(1) {
          left: 10%;
          opacity: 1;
          animation-duration: 2.35s;
          animation-delay: 0.2s;
        }
        .point:nth-child(2) {
          left: 30%;
          opacity: 0.7;
          animation-duration: 2.5s;
          animation-delay: 0.5s;
        }
        .point:nth-child(3) {
          left: 25%;
          opacity: 0.8;
          animation-duration: 2.2s;
          animation-delay: 0.1s;
        }
        .point:nth-child(4) {
          left: 44%;
          opacity: 0.6;
          animation-duration: 2.05s;
        }
        .point:nth-child(5) {
          left: 50%;
          opacity: 1;
          animation-duration: 1.9s;
        }
        .point:nth-child(6) {
          left: 75%;
          opacity: 0.5;
          animation-duration: 1.5s;
          animation-delay: 1.5s;
        }
        .point:nth-child(7) {
          left: 88%;
          opacity: 0.9;
          animation-duration: 2.2s;
          animation-delay: 0.2s;
        }
        .point:nth-child(8) {
          left: 58%;
          opacity: 0.8;
          animation-duration: 2.25s;
          animation-delay: 0.2s;
        }
        .point:nth-child(9) {
          left: 98%;
          opacity: 0.6;
          animation-duration: 2.6s;
          animation-delay: 0.1s;
        }
        .point:nth-child(10) {
          left: 65%;
          opacity: 1;
          animation-duration: 2.5s;
          animation-delay: 0.2s;
        }

        .animated-button:focus .icon {
          fill: #374151;
        }

        .animated-button:hover .icon {
          fill: transparent;
          animation: dasharray 1s linear forwards,
            filled 0.1s linear forwards 0.95s;
        }

        @keyframes dasharray {
          from {
            stroke-dasharray: 0 0 0 0;
          }
          to {
            stroke-dasharray: 68 68 0 0;
          }
        }

        @keyframes filled {
          to {
            fill: #374151;
          }
        }
      `}</style>

      <button
        type="button"
        onClick={onClick}
        className={`
          animated-button
          cursor-pointer relative inline-flex items-center justify-center
          overflow-hidden transition-all duration-300 ease-in-out
          rounded-3xl border-none outline-none px-[18px] py-3
          ${className}
        `}
      >

        {/* Floating points */}
        <div className="absolute inset-0 overflow-hidden w-full h-full pointer-events-none z-10">
          {Array.from({ length: 10 }, (_, i) => (
            <i
              key={i}
              className="point absolute bottom-[-10px] pointer-events-none w-0.5 h-0.5 bg-yellow-300 rounded-full"
            />
          ))}
        </div>

        {/* Button content */}
        <span className="z-20 gap-1.5 relative w-full text-gray-800 font-semibold inline-flex items-center justify-center text-base leading-6 transition-colors duration-200 ease-in-out">
          {children}
            <svg
            className="icon w-[18px] h-[18px] transition-all duration-100"
            fill="#070E02"
            stroke="#070E02"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          >
            <polyline points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37" />
          </svg>
        </span>
      </button>
    </>
  );
};

export default AnimatedButton;
