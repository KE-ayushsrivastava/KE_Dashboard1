import React, { useState, useRef, useEffect } from "react";

export default function ColumnXChart({ config, height }) {
  if (!config || !config.series) return <p>⏳ Loading chart...</p>;

  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const canvasRef = useRef(null);
  useEffect(() => {
    // create offscreen canvas context once
    canvasRef.current = document.createElement("canvas").getContext("2d");
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const chartWidth = Math.max(containerSize.width, 300); // min safeguard
  const chartHeight = height; // height is 220
  const gap = (chartWidth - 40) / config.series.length;
  const barWidth = gap * 0.4;
  const totalHeight = chartHeight * 0.5;
  const baseY = chartHeight - 60;
  const depth = 8;

  const measureText = (text, isBold = false) => {
    const ctx = canvasRef.current;
    if (!ctx) return text.length; // fallback
    ctx.font = `${isBold ? "bold " : ""}12px Inter, Arial, sans-serif`; // match SVG font-size
    return ctx.measureText(text).width;
  };

  // ✅ Brand palette
  const brandPalette = {
    "Maruti Suzuki Arena": {
      left: ["#2563eb", "#60a5fa"],
      right: ["#1d4ed8", "#3b82f6"],
      top: ["#93c5fd", "#bfdbfe"],
    },
    "Maruti Suzuki Nexa": {
      left: ["#0d9488", "#5eead4"],
      right: ["#0f766e", "#14b8a6"],
      top: ["#99f6e4", "#ccfbf1"],
    },
    Hyundai: {
      left: ["#4f46e5", "#818cf8"],
      right: ["#4338ca", "#6366f1"],
      top: ["#a5b4fc", "#c7d2fe"],
    },
    Kia: {
      left: ["#9333ea", "#c084fc"],
      right: ["#7e22ce", "#a855f7"],
      top: ["#ddd6fe", "#ede9fe"],
    },
    Mahindra: {
      left: ["#dc2626", "#f87171"],
      right: ["#b91c1c", "#ef4444"],
      top: ["#fecaca", "#fee2e2"],
    },
    "Tata Motors": {
      left: ["#ea580c", "#fb923c"],
      right: ["#c2410c", "#f97316"],
      top: ["#fed7aa", "#ffedd5"],
    },
    Toyota: {
      left: ["#d97706", "#fbbf24"],
      right: ["#b45309", "#f59e0b"],
      top: ["#fde68a", "#fef3c7"],
    },
    MG: {
      left: ["#059669", "#34d399"],
      right: ["#047857", "#10b981"],
      top: ["#a7f3d0", "#d1fae5"],
    },
  };

  // ✅ Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    brand: "",
    value: 0,
  });

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <svg
        width="100%"
        height={chartHeight + 80}
        viewBox={`0 0 ${chartWidth} ${chartHeight + 80}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gradients */}
        <defs>
          {config.series.map((item) => {
            const colors = brandPalette[item.brand];
            if (!colors) return null;
            const idSafe = item.brand.replace(/\s+/g, "-");

            return (
              <React.Fragment key={idSafe}>
                <linearGradient
                  id={`fillLeft-${idSafe}`}
                  x1="0"
                  y1="1"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor={colors.left[0]} />
                  <stop offset="100%" stopColor={colors.left[1]} />
                </linearGradient>
                <linearGradient
                  id={`fillRight-${idSafe}`}
                  x1="0"
                  y1="1"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor={colors.right[0]} />
                  <stop offset="100%" stopColor={colors.right[1]} />
                </linearGradient>
                <linearGradient
                  id={`fillTop-${idSafe}`}
                  x1="0"
                  y1="1"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor={colors.top[0]} />
                  <stop offset="100%" stopColor={colors.top[1]} />
                </linearGradient>
              </React.Fragment>
            );
          })}
        </defs>

        {/* Axes */}
        <line
          x1={40}
          y1={baseY}
          x2={40}
          y2={10}
          stroke="#9ca3af"
          strokeWidth="1.2"
        />
        {[0, 25, 50, 75, 100].map((val) => {
          const y = baseY - (val / 100) * totalHeight;
          return (
            <g key={val}>
              <text
                x={30}
                y={y + 4}
                fontSize="12"
                textAnchor="end"
                fill="#374151"
              >
                {val}
              </text>
            </g>
          );
        })}
        <line
          x1={40}
          y1={baseY}
          x2={chartWidth - 30}
          y2={baseY}
          stroke="#9ca3af"
          strokeWidth="1.5"
        />

        {/* Bars */}
        {config.series.map((item, idx) => {
          const idSafe = item.brand.replace(/\s+/g, "-");
          const x = 70 + idx * gap;
          const halfW = barWidth / 2;
          const shellTopY = baseY - totalHeight;
          const dataLabelHeight = shellTopY - 20;
          const barHeight = (item.value / 100) * totalHeight;
          const fillTopY = baseY - barHeight;

          return (
            <g
              key={idSafe}
              onMouseEnter={() =>
                setTooltip({
                  visible: true,
                  anchorX: x,
                  anchorY: dataLabelHeight,
                  brand: item.brand,
                  value: item.value,
                })
              }
              onMouseMove={(e) => {
                const rect = containerRef.current.getBoundingClientRect();
                setTooltip((prev) => ({
                  ...prev,
                }));
              }}
              onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
              style={{ cursor: "pointer" }}
            >
              {/* Outer shell */}
              <polygon
                points={`${x},${baseY} ${x - halfW},${baseY - depth} ${
                  x - halfW
                },${shellTopY - depth} ${x},${shellTopY}`}
                fill="#e5e7eb"
                style={{ pointerEvents: "all" }}
              />
              <polygon
                points={`${x},${baseY} ${x + halfW},${baseY - depth} ${
                  x + halfW
                },${shellTopY - depth} ${x},${shellTopY}`}
                fill="#d1d5db"
                style={{ pointerEvents: "all" }}
              />
              <polygon
                points={`${x},${shellTopY} ${x - halfW},${
                  shellTopY - depth
                } ${x},${shellTopY - depth} ${x + halfW},${shellTopY - depth}`}
                fill="#f3f4f6"
              />

              {/* Fill */}
              <polygon
                points={`${x},${baseY} ${x - halfW},${baseY - depth} ${
                  x - halfW
                },${fillTopY - depth} ${x},${fillTopY}`}
                fill={`url(#fillLeft-${idSafe})`}
                style={{ pointerEvents: "all" }}
              />
              <polygon
                points={`${x},${baseY} ${x + halfW},${baseY - depth} ${
                  x + halfW
                },${fillTopY - depth} ${x},${fillTopY}`}
                fill={`url(#fillRight-${idSafe})`}
                style={{ pointerEvents: "all" }}
              />
              <polygon
                points={`${x},${fillTopY} ${x - halfW},${
                  fillTopY - depth
                } ${x},${fillTopY - depth / 2} ${x + halfW},${
                  fillTopY - depth
                }`}
                fill={`url(#fillTop-${idSafe})`}
                style={{ pointerEvents: "all" }}
              />

              {/* Brand labels */}
              {item.brand.split(" ").map((word, i) => (
                <text
                  key={i}
                  x={x}
                  y={baseY + 20 + i * 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#000"
                >
                  {word}
                </text>
              ))}

              {/* Value labels */}
              <text
                x={x}
                y={dataLabelHeight}
                textAnchor="middle"
                fontSize="11.2"
                fontWeight="bold"
                fill="#000"
              >
                {item.value}%
              </text>
            </g>
          );
        })}

        {/* === Tooltip as SVG group === */}
        {tooltip.visible &&
          (() => {
            const brandText = tooltip.brand || "";
            const valueText = `Value: ${tooltip.value}%`;

            // measure both lines (brand bold, value normal)
            const brandW = measureText(brandText, true);
            const valueW = measureText(valueText, false);

            const contentWidth = Math.max(brandW, valueW);
            const paddingH = 16; // left+right total (8px each side)
            const boxWidth = Math.max(100, Math.ceil(contentWidth + paddingH)); // min 100

            const lineHeight = 16;
            const boxHeight = lineHeight * 2 + 12; // two lines + vertical padding
            const translateX = tooltip.anchorX - boxWidth / 2;
            const translateY = tooltip.anchorY + 12;

            return (
              <g
                transform={`translate(${translateX}, ${translateY})`}
                style={{ pointerEvents: "none" }}
              >
                {/* background rounded rect */}
                <rect
                  x={0}
                  y={0}
                  width={boxWidth}
                  height={boxHeight}
                  rx={6}
                  ry={6}
                  fill="rgba(8,8,8,0.9)"
                  stroke="#E5E7EB"
                  strokeWidth="0.5"
                />

                {/* arrow centered under box */}
                <polygon
                  points={`${boxWidth / 2 - 6},0 ${boxWidth / 2 + 6},0 ${
                    boxWidth / 2
                  },-8`}
                  fill="rgba(8,8,8,0.9)"
                  stroke="#E5E7EB"
                  strokeWidth="0.5"
                />

                {/* text: brand (bold) + value */}
                <text x={8} y={lineHeight + 2} fontSize="12" fill="#F7F7F8">
                  <tspan style={{ fontWeight: 700 }}>{brandText}</tspan>
                  <tspan x={8} dy={lineHeight} style={{ fontWeight: 400 }}>
                    {valueText}
                  </tspan>
                </text>
              </g>
            );
          })()}
      </svg>
    </div>
  );
}
