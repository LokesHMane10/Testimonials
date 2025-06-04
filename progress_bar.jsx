import React, { useState, useEffect, useRef } from "react";
import "./Progress_bar.css";

const skills = [
  { name: "Visualization", progress: 90 },
  { name: "Visualization", progress: 85 },
  { name: "Visualization", progress: 85 },
  { name: "Visualization", progress: 87 },
];

const CircularProgress = ({
  progress,
  size = 100,
  strokeWidth = 3,
  duration = 1.5,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const progressRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      setAnimatedProgress(0);
      setDisplayedProgress(0);

      setTimeout(() => {
        setAnimatedProgress(progress);
      }, 200);

      let start = 0;
      const stepTime = (duration * 1000) / progress;
      const interval = setInterval(() => {
        start += 1;
        setDisplayedProgress(start);
        if (start >= progress) clearInterval(interval);
      }, stepTime);

      return () => clearInterval(interval);
    }
  }, [isVisible, progress, duration]);

  const offset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div ref={progressRef}>
      <svg width={size} height={size} className="circular-progress">
        <circle
          className="progress-background"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: `stroke-dashoffset ${duration}s ease-in-out` }}
        />
        <text className="progress-text" x="50%" y="50%">
          {displayedProgress}%
        </text>
      </svg>
    </div>
  );
};

const ProgressBar = () => {
  return (
    <div className="progress-wrapper">
      {skills.map((skill) => (
        <div className="progress-container" key={skill.name}>
          <CircularProgress progress={skill.progress} />
          <div className="skills">{skill.name}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
