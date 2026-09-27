# Radar Chart Coordinate Transformations

Recharts `<RadarChart />` requires an array of data points with `subject`, `score`, and `fullMark`.

The `transformRadarMetrics` helper extracts raw Developer DNA metrics from the API and maps them into Recharts polygon vertices with fullMark set to 100.
