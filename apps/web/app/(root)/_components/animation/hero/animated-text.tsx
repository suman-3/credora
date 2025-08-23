const AIAutomationText = () => {
  return (
    <>
      <style>{`
        @keyframes drawPath {
          from {
            stroke-dashoffset: 2000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

          .ai-automation-text {
          background: linear-gradient(180deg, #FFFCE1 0.90%, rgba(255, 255, 255, 0.00) 220.4%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
          color: transparent !important;
        }
      `}</style>

      <span className="relative inline-block">
        <span className="ai-automation-text"> AI Automation</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="549"
          height="99"
          viewBox="0 0 549 99"
          fill="none"
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-[110%] h-auto pointer-events-none"
          style={{ minWidth: "300px", maxWidth: "510px" }}
        >
          <path
            d="M335.662 2C335.662 2 333.632 5.50049 310.738 9.486C283.935 14.152 269.096 18.2162 241.96 20.2642C216.411 22.1924 176.332 20.2642 176.332 20.2642C56.4999 26 35.4999 28.613 11.9998 44.9515C-83.0001 111 546.474 109.5 546.474 63.933C546.473 18.3659 427.514 26.877 306.538 21.7475C306.538 21.7475 244.003 15.4733 204.683 7.48794"
            stroke="#FFEA71"
            strokeWidth="4"
            fill="none"
            className="animate-[drawPath_2s_ease-in-out_1s_forwards]"
            strokeDasharray="2000"
            strokeDashoffset="2000"
          />
        </svg>
      </span>
    </>
  );
};

export default AIAutomationText;
