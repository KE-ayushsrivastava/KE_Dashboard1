from config import column_colors
from config import area_colors
from config import nps_colors


def to_highcharts_config(data, data_labels, chart_type=None):
    """
    Convert raw JSON into Highcharts-ready config
    :param data: list of dicts (output from calculate())
    :param data_labels: list of keys from data (e.g. ["promoter", "passive", "detractor"])
    :param chart_type: str, chart type ("bar", "column", "pie", "stack_column", "area")
                       if None → return raw_data
    :return: dict with categories + series (+ optional maxValue/nps)
    """

    if chart_type is None:
        return data

    chart_type = chart_type.lower()
    series = []
    extra = {}

    # 🟢 PIE CHART
    if chart_type == "pie":
        label = data_labels[0]
        pie_data = [{"name": row["brand"], "y": row[label]} for row in data]

        # ✅ Sort by value ascending
        pie_data = sorted(pie_data, key=lambda x: x["y"])

        series.append({
            "name": label.capitalize(),
            "data": pie_data
        })
        categories = [p["name"] for p in pie_data]

    # 🟢 COLUMN CHART
    elif chart_type == "column":
        categories = [row["brand"] for row in data]
        for label in data_labels:
            pairs = [(row["brand"], row[label]) for row in data]

            # Sort by value
            pairs_sorted = sorted(pairs, key=lambda x: x[1])
            categories = [p[0] for p in pairs_sorted]

            # Y + Color mapping
            values_sorted = [
                {
                    "y": value,
                    "color": column_colors.get(brand, {"linearGradient": {"x1":0,"y1":0,"x2":0,"y2":1},"stops":[[0,"#999"],[1,"#ccc"]]})
                }
                for brand, value in pairs_sorted
            ]

            series.append({
                "name": label.capitalize(),
                "data": values_sorted
            })
        extra["maxValue"] = max(row[label] for row in data for label in data_labels)

    elif chart_type == "columnx":
        data_sorted = sorted(data, key=lambda x: x[data_labels[0]])
        categories = [row["brand"] for row in data_sorted]

        series = [
            {"brand": row["brand"], "value": row[data_labels[0]]}
            for row in data_sorted
        ]

    # 🟢 AREA CHART
    elif chart_type == "area":
        for idx, label in enumerate(data_labels):
            c = area_colors[idx % len(area_colors)]
            pairs = [(row["brand"], row[label]) for row in data]

            # ✅ sort by value
            pairs_sorted = sorted(pairs, key=lambda x: x[1])

            categories = [p[0] for p in pairs_sorted]
            values_sorted = [p[1] for p in pairs_sorted]

            series.append({
                "name": label.capitalize(),
                "data": values_sorted,
                "lineColor": c["line"],
                "color": {
                    "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
                    "stops": [
                        [0, c["fill"][0]],
                        [1, c["fill"][1]],
                    ]
                }
            })

        extra["maxValue"] = max(values_sorted)

    elif chart_type == "line":
        for idx, label in enumerate(data_labels):
            c = area_colors[idx % len(area_colors)]
            pairs = [(row["brand"], row[label]) for row in data]

            # ✅ sort by value
            pairs_sorted = sorted(pairs, key=lambda x: x[1])

            categories = [p[0] for p in pairs_sorted]
            values_sorted = [p[1] for p in pairs_sorted]

            series.append({
                "name": label.capitalize(),
                "data": values_sorted,
                "lineColor": c["line"],
                "color": {
                    "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
                    "stops": [
                        [0, c["fill"][0]],
                        [1, c["fill"][1]],
                    ]
                }
            })

        extra["maxValue"] = max(values_sorted)

    # 🟢 STACKED COLUMN
    elif chart_type == "stack_column":
        # ✅ Data ko NPS ke ascending order me sort karo
        data_sorted = sorted(data, key=lambda x: x.get("nps", 0))

        # ✅ Categories sorted by NPS
        categories = [row["brand"] for row in data_sorted]

        # ✅ Series values bhi NPS order ke hisaab se
        for label in data_labels:
            values_sorted = [row[label] for row in data_sorted]
            series.append({
                "name": label.capitalize(),
                "data": values_sorted,
                "color": nps_colors.get(label.capitalize())  # ✅ vibrant gradient
            })

        # ✅ NPS array bhi sorted order me bhejna
        nps_sorted = [row.get("nps", None) for row in data_sorted]
        extra["nps"] = nps_sorted
        
        extra["maxValue"] = max([n for n in nps_sorted if n is not None], default=0)

    # 🟢 FALLBACK (bar/line etc.)
    else:
        categories = [row["brand"] for row in data]
        for label in data_labels:
            pairs = [(row["brand"], row[label]) for row in data]
            pairs_sorted = sorted(pairs, key=lambda x: x[1])
            categories = [p[0] for p in pairs_sorted]
            values_sorted = [p[1] for p in pairs_sorted]

            series.append({
                "name": label.capitalize(),
                "data": values_sorted
            })
        extra["maxValue"] = max(row[label] for row in data for label in data_labels)

    config = {
        "categories": categories,
        "series": series,
    }

    if extra:
        for key, value in extra.items():
            config[key] = value

    return config
