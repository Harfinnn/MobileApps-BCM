import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import styles from '../../../../styles/forecast/f3dStyle';

const AnimatedTemp = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;

    const counter = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(counter);
      } else {
        setDisplay(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(counter);
  }, [value]);

  return <Text style={styles.tempBig}>{display}°</Text>;
};

export default AnimatedTemp;
