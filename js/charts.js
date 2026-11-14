// High-Performance Zero-Dependency SVG Visualization Engine for PulseFit

class FitnessCharts {
  /**
   * Renders a responsive, interactive SVG Line Chart for Weight Progression
   */
  static renderWeightChart(containerId, weightLogs, unit = "kg") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!weightLogs || weightLogs.length === 0) {
      container.innerHTML = `<div class="chart-empty">No weight records logged yet. Add your first weigh-in!</div>`;
      return;
    }

    // Sort logs chronologically
    const sorted = [...weightLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
    const width = 640;
    const height = 260;
    const padding = { top: 25, right: 35, bottom: 45, left: 55 };

    const weights = sorted.map(d => d.weight);
    const minWeight = Math.min(...weights) - 1.5;
    const maxWeight = Math.max(...weights) + 1.5;
    const weightRange = maxWeight - minWeight || 1;

    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const getX = (index) => padding.left + (sorted.length > 1 ? (index / (sorted.length - 1)) * plotWidth : plotWidth / 2);
    const getY = (val) => padding.top + plotHeight - ((val - minWeight) / weightRange) * plotHeight;

    // Build path coordinates
    const points = sorted.map((d, i) => ({ x: getX(i), y: getY(d.weight), data: d }));
    let pathD = "";
    points.forEach((pt, i) => {
      pathD += (i === 0 ? "M " : " L ") + `${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    });

    const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${padding.top + plotHeight} L ${points[0].x.toFixed(1)} ${padding.top + plotHeight} Z`;

    // Horizontal grid lines
    const gridCount = 4;
    let gridLinesSvg = "";
    for (let i = 0; i <= gridCount; i++) {
      const val = minWeight + (weightRange / gridCount) * i;
      const y = getY(val);
      gridLinesSvg += `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--border)" stroke-dasharray="3,3" opacity="0.6"/>
        <text x="${padding.left - 10}" y="${y + 4}" fill="var(--text-muted)" font-size="11" text-anchor="end">${val.toFixed(1)}</text>
      `;
    }

    // X Axis labels (up to 6 readable date points)
    let xAxisLabels = "";
    const step = Math.max(1, Math.floor(sorted.length / 5));
    sorted.forEach((d, i) => {
      if (i % step === 0 || i === sorted.length - 1) {
        const x = getX(i);
        const shortDate = d.date.slice(5); // "MM-DD"
        xAxisLabels += `
          <text x="${x}" y="${height - 15}" fill="var(--text-muted)" font-size="11" text-anchor="middle">${shortDate}</text>
        `;
      }
    });

    // Data points & hover tooltips
    let pointsSvg = "";
    points.forEach((pt) => {
      pointsSvg += `
        <g class="chart-point-group" tabindex="0">
          <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="var(--accent)" stroke="var(--bg-card)" stroke-width="2.5" class="chart-dot"/>
          <circle cx="${pt.x}" cy="${pt.y}" r="14" fill="transparent" class="chart-hitbox">
            <title>${pt.data.date}: ${pt.data.weight} ${unit} ${pt.data.notes ? `(${pt.data.notes})` : ""}</title>
          </circle>
        </g>
      `;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="fitness-svg-chart" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        ${gridLinesSvg}
        <path d="${areaD}" fill="url(#weightGrad)"/>
        <path d="${pathD}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        ${xAxisLabels}
        ${pointsSvg}
      </svg>
    `;
  }

  /**
   * Renders 7-Day Workout Activity Bar Chart (Mon-Sun of current week)
   */
  static renderWeeklyActivityChart(containerId, workoutHistory) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 450;
    const height = 200;
    const padding = { top: 20, right: 20, bottom: 35, left: 45 };

    // Find dates for current week
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dailyMinutes = [0, 0, 0, 0, 0, 0, 0];

    // Populate daily minutes from workoutHistory
    workoutHistory.forEach(wo => {
      const woDate = new Date(wo.date);
      const diffDays = Math.floor((woDate - monday) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        dailyMinutes[diffDays] += (wo.durationMinutes || 45);
      }
    });

    const maxMinutes = Math.max(60, ...dailyMinutes) + 15;
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const barWidth = 28;
    const colStep = plotWidth / 7;

    let barsSvg = "";
    let labelsSvg = "";

    dailyMinutes.forEach((mins, i) => {
      const x = padding.left + i * colStep + (colStep - barWidth) / 2;
      const barHeight = (mins / maxMinutes) * plotHeight;
      const y = padding.top + plotHeight - barHeight;
      const isToday = i === dayOfWeek;

      barsSvg += `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${Math.max(2, barHeight)}" rx="6" 
          fill="${isToday ? 'var(--accent)' : 'var(--accent-blue)'}" opacity="${mins > 0 ? '0.9' : '0.2'}" class="chart-bar">
          <title>${days[i]}: ${mins} active minutes</title>
        </rect>
        ${mins > 0 ? `<text x="${x + barWidth / 2}" y="${y - 6}" font-size="10" fill="var(--text-muted)" text-anchor="middle">${mins}m</text>` : ''}
      `;

      labelsSvg += `
        <text x="${x + barWidth / 2}" y="${height - 12}" font-size="11" font-weight="${isToday ? '700' : '500'}" 
          fill="${isToday ? 'var(--accent)' : 'var(--text-muted)'}" text-anchor="middle">${days[i]}</text>
      `;
    });

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="fitness-svg-chart" preserveAspectRatio="xMidYMid meet">
        <line x1="${padding.left}" y1="${padding.top + plotHeight}" x2="${width - padding.right}" y2="${padding.top + plotHeight}" stroke="var(--border)" stroke-width="1.5"/>
        ${barsSvg}
        ${labelsSvg}
      </svg>
    `;
  }

  /**
   * Renders the Macronutrient Donut Progress Ring
   */
  static renderMacroRing(containerId, carbsG, proteinG, fatG, totalCalories, targetCalories) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = 180;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    const carbsCal = carbsG * 4;
    const proteinCal = proteinG * 4;
    const fatCal = fatG * 9;
    const macroTotalCal = (carbsCal + proteinCal + fatCal) || 1;

    // Proportions
    const proteinRatio = (proteinCal / macroTotalCal);
    const carbsRatio = (carbsCal / macroTotalCal);
    const fatRatio = (fatCal / macroTotalCal);

    const proteinLength = proteinRatio * circumference;
    const carbsLength = carbsRatio * circumference;
    const fatLength = fatRatio * circumference;

    const c1Offset = 0;
    const c2Offset = -proteinLength;
    const c3Offset = -(proteinLength + carbsLength);

    const remainingCal = Math.max(0, targetCalories - totalCalories);
    const calPercent = Math.min(100, Math.round((totalCalories / (targetCalories || 1)) * 100));

    container.innerHTML = `
      <div class="macro-ring-wrapper">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="macro-donut-svg">
          <!-- Background track -->
          <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--bg-secondary)" stroke-width="${strokeWidth}"/>
          
          <!-- Protein segment (cyan/blue) -->
          <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--accent-blue)" stroke-width="${strokeWidth}"
            stroke-dasharray="${proteinLength} ${circumference}" stroke-dashoffset="${c1Offset}" stroke-linecap="round"
            transform="rotate(-90 ${center} ${center})"/>
          
          <!-- Carbs segment (emerald green) -->
          <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--accent)" stroke-width="${strokeWidth}"
            stroke-dasharray="${carbsLength} ${circumference}" stroke-dashoffset="${c2Offset}"
            transform="rotate(-90 ${center} ${center})"/>
          
          <!-- Fat segment (amber/orange) -->
          <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="var(--accent-orange)" stroke-width="${strokeWidth}"
            stroke-dasharray="${fatLength} ${circumference}" stroke-dashoffset="${c3Offset}"
            transform="rotate(-90 ${center} ${center})"/>
        </svg>
        <div class="macro-ring-center">
          <span class="macro-center-cal">${remainingCal}</span>
          <span class="macro-center-label">kcal left</span>
          <span class="macro-center-percent">${calPercent}% of goal</span>
        </div>
      </div>
    `;
  }
}
