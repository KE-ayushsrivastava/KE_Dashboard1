from flask import Flask, jsonify, request
from classes import NPSCalculator, SingleSelectCalculator, MultiSelectCalculator, build_filter_cond
from mapper import to_highcharts_config

oemVal = 0

if oemVal == 0:
    column_name = 'Q13b'
    brand = {
        "4": "Maruti Suzuki Arena",
        "5": "Maruti Suzuki Nexa",
        "1": "Hyundai",
        "2": "Kia",
        "3": "Mahindra",
        "6": "Tata Motors",
        "7": "Toyota",
        "8": "MG"
    }
else:
    column_name = 'Q13'
    brand = {
        "4": "Maruti Suzuki Arena",
        "5": "Maruti Suzuki Nexa",
        "1": "Hyundai",
        "2": "Kia",
        "3": "Mahindra",
        "6": "Tata Motors",
        "7": "Toyota",
        "8": "MG"
    }

app = Flask(__name__)

@app.route("/chart_data")

def chart_data():
    question_type = request.args.get("questionType")
    chart_type = request.args.get("chartType")
    prefix = request.args.get("variableName")
    value_range = request.args.get("valueRange")

    filters = {
        "time": request.args.get("time", "").split(",") if request.args.get("time") else [],
        "zone": request.args.get("zone", "").split(",") if request.args.get("zone") else [],
    }

    condX = build_filter_cond(filters)
    print("condX =>", condX)

    if question_type == "NPS":
        calc = NPSCalculator(condX)
        raw_data = calc.calculate(
            prefix=prefix,
            prefix2=column_name,
            brand_dict=brand,
        )
        data_labels = ["promoter", "passive", "detractor"]
    elif question_type == "Single_Select":
        calc = SingleSelectCalculator(condX)
        raw_data = calc.calculate(
            prefix=prefix, 
            prefix2=column_name,
            brand_dict=brand,
        )
        data_labels = ["top2"]
    elif question_type == "Multi_Select":
        calc = MultiSelectCalculator(condX)
        raw_data = calc.calculate(
            prefix=prefix, 
            prefix2=column_name,
            value_range=value_range,
            brand_dict=brand,
        )
        data_labels = ["top2"]
    else:
        return jsonify({"error": "Invalid questionType"}), 400

    

    chart_series = to_highcharts_config(
        data=raw_data,
        data_labels=data_labels,
        chart_type=chart_type.lower()  # direct string
    )

    return jsonify(chart_series)

if __name__ == "__main__":
    app.run(debug=True)
