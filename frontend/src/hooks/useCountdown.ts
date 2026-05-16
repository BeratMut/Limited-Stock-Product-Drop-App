import { useState, useEffect } from 'react';

export const useCountdown = (targetDateString: string | null) => {
  const [timeLeft, setTimeLeft] = useState(0); 
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    
    if (!targetDateString) {
      setTimeLeft(0);
      setIsExpired(false);
      return;
    }

    const targetDate = new Date(targetDateString).getTime();

  
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = Math.floor((targetDate - now) / 1000);

      if (difference <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        return true; 
      } else {
        setTimeLeft(difference);
        setIsExpired(false);
        return false;
      }
    };

    const expired = calculateTime();
    if (expired) return;

    
    const intervalId = setInterval(() => {
      const expired = calculateTime();
      if (expired) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDateString]);

  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return { timeLeft, isExpired, formattedString };
};
