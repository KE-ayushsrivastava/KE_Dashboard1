from config import get_connection
from config import FILTER_MAP

def build_filter_cond(filters: dict) -> str:
    cond_parts = []
    for key, col in FILTER_MAP.items():
        if filters.get(key):
            vals = ",".join([f"'{v}'" for v in filters[key]])
            cond_parts.append(f"{col} IN ({vals})")
    return " AND ".join(cond_parts) if cond_parts else "1=1"




class QuestionBase:
    def __init__(self, condX):
        self.condX = condX

    def run_query(self, sql):
        """Pool se connection le, query run kare aur auto close kare"""
        conn = get_connection()
        try:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(sql)
            result = cursor.fetchone()
            return result or {}
        finally:
            cursor.close()
            conn.close()  # release back to pool
    

class NPSCalculator(QuestionBase):
    def __init__(self, condX):
        super().__init__(condX)

    def calculate(self, prefix, prefix2, brand_dict):

        base_counts, promoter_counts, passive_counts, detractor_counts = [], [], [], []

        # Build dynamic SQL (only by brand, no range loop)
        for code in brand_dict.keys():
            base_counts.append(
                f"COUNT(CASE WHEN {prefix2} = '{code}' AND {prefix} != '' "
                f"THEN record END) AS {prefix}_{code}base"
            )
            promoter_counts.append(
                f"COUNT(CASE WHEN {prefix2} = '{code}' AND {prefix} IN (10,11) "
                f"THEN record END) AS {prefix}_{code}promoter"
            )
            passive_counts.append(
                f"COUNT(CASE WHEN {prefix2} = '{code}' AND {prefix} IN (8,9) "
                f"THEN record END) AS {prefix}_{code}passive"
            )
            detractor_counts.append(
                f"COUNT(CASE WHEN {prefix2} = '{code}' AND {prefix} IN (1,2,3,4,5,6,7) "
                f"THEN record END) AS {prefix}_{code}detractor"
            )

        sql = f"""
            SELECT {", ".join(base_counts)},
                {", ".join(promoter_counts)},
                {", ".join(passive_counts)},
                {", ".join(detractor_counts)}
            FROM cherry
            WHERE {self.condX}
        """

        result = self.run_query(sql)
        data = []

        for code, name in brand_dict.items():
            base_key = f"{prefix}_{code}base"
            promoter_key = f"{prefix}_{code}promoter"
            passive_key = f"{prefix}_{code}passive"
            detractor_key = f"{prefix}_{code}detractor"

            base_count = result.get(base_key, 0) or 1
            promoter_count = result.get(promoter_key, 0)
            passive_count = result.get(passive_key, 0)
            detractor_count = result.get(detractor_key, 0)

            promoter_pct = (promoter_count / base_count) * 100
            passive_pct = (passive_count / base_count) * 100
            detractor_pct = (detractor_count / base_count) * 100
            nps_pct = promoter_pct - detractor_pct

            data.append({
                "brand": name,  # ✅ brand name aa jayega
                "base": base_count,
                "promoter": round(promoter_pct),
                "passive": round(passive_pct),
                "detractor": round(detractor_pct),
                "nps": round(nps_pct),
            })

        return data


class SingleSelectCalculator(QuestionBase):
    def __init__(self, condX):
        super().__init__(condX)

    def calculate(self, prefix, prefix2, brand_dict):

        base_counts = []
        top2_counts = []

        # Build SQL parts dynamically
        for code in brand_dict.keys():
            base_counts.append(
                f"COUNT(CASE WHEN {prefix2} = '{code}' AND {prefix} != '' "
                f"THEN record END) AS {prefix}_{code}base"
            )
            top2_counts.append(
                f"COUNT(CASE WHEN {prefix2} = '{code}' AND {prefix} IN (9,10) "
                f"THEN record END) AS {prefix}_{code}top2"
            )

        sql = f"""
            SELECT {", ".join(base_counts)},
                {", ".join(top2_counts)}
            FROM cherry
            WHERE {self.condX}
        """

        result = self.run_query(sql)
        data = []

        for code, name in brand_dict.items():
            base_key = f"{prefix}_{code}base"
            top2_key = f"{prefix}_{code}top2"

            base_count = result.get(base_key, 0) or 1
            top2_count = result.get(top2_key, 0)

            top2_pct = (top2_count / base_count) * 100

            data.append({
                "brand": name,  # ✅ brand name aa jayega
                "base": base_count,
                "top2": round(top2_pct),
            })

        return data
