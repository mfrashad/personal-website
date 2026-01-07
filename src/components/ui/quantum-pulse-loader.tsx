import { cn } from "@/lib/utils";

export const QuantumPulseLoader = () => {
  return (
    <div className="generating-loader-wrapper">
      <div className="generating-loader-text">
        <span className="generating-loader-letter">L</span>
        <span className="generating-loader-letter">o</span>
        <span className="generating-loader-letter">a</span>
        <span className="generating-loader-letter">d</span>
        <span className="generating-loader-letter">i</span>
        <span className="generating-loader-letter">n</span>
        <span className="generating-loader-letter">g</span>
        <span className="generating-loader-letter">.</span>
        <span className="generating-loader-letter">.</span>
        <span className="generating-loader-letter">.</span>
      </div>
      <div className="generating-loader-bar"></div>
    </div>
  );
};
