import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

export default function StatisticsChart({ data, balance }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  if (total === 0) {
    return (
      <View style={styles.container}>
        <Svg width="200" height="200">
          <Circle
            cx="100"
            cy="100"
            r="80"
            stroke="#ccc"
            strokeWidth="20"
            fill="none"
          />
          <SvgText
            x="100"
            y="100"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#333"
          >
            Немає даних
          </SvgText>
        </Svg>
      </View>
    );
  }

  const radius = 80;
  const strokeWidth = 20;
  const circleCircumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <View style={styles.container}>
      <Svg width="200" height="200">
        <G rotation="-90" origin="100, 100">
          {data.map((item, index) => {
            const percent = item.value / total;
            const strokeDasharray = `${circleCircumference * percent} ${
              circleCircumference * (1 - percent)
            }`;
            const strokeDashoffset = circleCircumference * (1 - cumulativePercent);
            cumulativePercent += percent;

            return (
              <Circle
                key={index}
                cx="100"
                cy="100"
                r={radius}
                stroke={item.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            );
          })}
        </G>
        <SvgText
          x="100"
          y="100"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill="#333"
        >
          {balance !== undefined && balance !== null
            ? `${balance.toFixed(2)} грн`
            : '0.00 грн'}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
});
