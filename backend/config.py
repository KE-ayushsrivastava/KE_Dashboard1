import mysql.connector
from mysql.connector import pooling

# Connection Pool Setup
dbconfig = {
    "host": "localhost",
    "user": "root",
    "password": "pass@123",
    "database": "pj_chakra_db"
}

# Pool create (size tumhare concurrent users ke hisaab se adjust karna)
connection_pool = pooling.MySQLConnectionPool(
    pool_name="pjchakra_pool",
    pool_size=5,     # ek time pe max 5 connections
    **dbconfig
)

def get_connection():
    """Get a pooled connection"""
    return connection_pool.get_connection()

column_colors = {
"Maruti Suzuki Arena": {
    "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
    "stops": [
        [0, "#2563eb"],
        [1, "#60a5fa"]
    ]
},
"Maruti Suzuki Nexa": {
    "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
    "stops": [
        [0, "#0d9488"],
        [1, "#5eead4"]
    ]
},
"Hyundai": {
    "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
    "stops": [
        [0, "#4f46e5"],
        [1, "#818cf8"]
    ]
},
"Kia": {
    "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
    "stops": [
        [0, "#9333ea"],
        [1, "#c084fc"]
    ]
},
"Mahindra": {
    "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
    "stops": [
        [0, "#db2777"],
        [1, "#f472b6"]
    ]
},
"Tata Motors": {
    "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
    "stops": [
        [0, "#ea580c"],
        [1, "#fb923c"]
    ]
},
"Toyota": {
    "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
    "stops": [
        [0, "#d97706"],
        [1, "#fbbf24"]
    ]
},
"MG": {
    "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
    "stops": [
        [0, "#059669"],
        [1, "#34d399"]
    ]
}
}

area_colors = [
    {"line": "#550080", "fill": ["rgba(124,58,237,0.6)", "rgba(124,58,237,0.05)"]},
    {"line": "#550080", "fill": ["rgba(20,184,166,0.6)", "rgba(20,184,166,0.05)"]},
    {"line": "#550080", "fill": ["rgba(245,158,11,0.6)", "rgba(245,158,11,0.05)"]},
]

nps_colors = {
    "Promoter": {
        "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
        "stops": [
            [0, "#0f766e"],  # Emerald Green (top)
            [1, "#0d9488"],  # Deep Green (bottom)
        ]
    },
    "Passive": {
        "linearGradient": { "x1": 0, "y1": 0, "x2": 0, "y2": 1 },
        "stops": [
            [0, "#d97706"],  # top vibrant orange
            [1, "#f59e0b"]    # bottom amber
        ]
    },
    "Detractor": {
        "linearGradient": {"x1": 0, "y1": 0, "x2": 0, "y2": 1},
        "stops": [
            [0, "#ef4444"],  # Vibrant Red (top)
            [1, "#991b1b"],  # Dark Red (bottom)
        ]
    }
}

FILTER_MAP = {
    "time": "Quarter",
    "zone": "Q5b",
}
