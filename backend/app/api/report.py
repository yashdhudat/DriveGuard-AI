from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import Optional, List
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    PageBreak,
)
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import qrcode
import io
from datetime import datetime
import base64

router = APIRouter(prefix="/report", tags=["Report"])

# ---------- Pydantic Models ----------

class FaultItem(BaseModel):
    component: str
    issue: str
    severity: str
    action: str


class HealthPayload(BaseModel):
    health_score: int
    rul_days: int
    priority: str
    critical_comp: str
    insight: str
    faults: List[FaultItem] = []


class ChartImages(BaseModel):
    engine_rpm: Optional[str] = None
    engine_temp: Optional[str] = None
    oil_pressure: Optional[str] = None
    battery_voltage: Optional[str] = None
    vibration: Optional[str] = None
    rul_trend: Optional[str] = None
    fault_timeline: Optional[str] = None


class ReportExportPayload(BaseModel):
    vehicle_id: str
    vehicle_label: Optional[str] = None
    generated_at: Optional[str] = None
    health: Optional[HealthPayload] = None
    charts: Optional[ChartImages] = None


# ---------- Helpers ----------

def _b64_to_image(data_url: Optional[str], width: float):
    """
    Convert base64 data URL string to reportlab Image.
    Returns None if invalid / missing.
    """
    if not data_url:
        return None
    try:
        if "," in data_url:
            _, b64 = data_url.split(",", 1)
        else:
            b64 = data_url
        raw = base64.b64decode(b64)
        bio = io.BytesIO(raw)
        img = Image(bio, width=width, height=width * 0.5)  # simple aspect ratio
        return img
    except Exception:
        return None


# ---------- Main Export Endpoint ----------

@router.post("/export")
async def export_report(payload: ReportExportPayload):
    try:
        buffer = io.BytesIO()

        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40,
        )

        styles = getSampleStyleSheet()
        elements = []

        vehicle_label = payload.vehicle_label or payload.vehicle_id
        ts = (
            datetime.fromisoformat(payload.generated_at.replace("Z", "+00:00"))
            if payload.generated_at
            else datetime.now()
        )

        # ---------- PAGE 1: SUMMARY & HEALTH ----------

        title_style = styles["Heading1"]
        title_style.textColor = colors.HexColor("#00C6FF")
        elements.append(Paragraph("DriveGuard AI — Predictive Health Report", title_style))
        elements.append(Spacer(1, 16))

        subtitle = styles["Heading3"]
        subtitle.textColor = colors.white
        elements.append(
            Paragraph(f"Vehicle: {vehicle_label} ({payload.vehicle_id})", subtitle)
        )
        elements.append(
            Paragraph(f"Generated on: {ts.strftime('%Y-%m-%d %H:%M:%S')}", styles["Normal"])
        )
        elements.append(Spacer(1, 12))

        # Vehicle / Health summary table
        if payload.health:
            h = payload.health
            summary_data = [
                ["Metric", "Value"],
                ["Health Score", f"{h.health_score} %"],
                ["Remaining Useful Life", f"{h.rul_days} days"],
                ["Priority Level", h.priority],
                ["Critical Component", h.critical_comp],
            ]
            summary_table = Table(summary_data, colWidths=[180, 260])
            summary_table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#007BFF")),
                        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                        ("FONTSIZE", (0, 0), (-1, -1), 10),
                        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#007BFF")),
                    ]
                )
            )
            elements.append(summary_table)
            elements.append(Spacer(1, 18))

            elements.append(Paragraph("<b>Insight:</b>", styles["Normal"]))
            elements.append(Paragraph(h.insight, styles["Normal"]))
            elements.append(Spacer(1, 16))

            # Fault list
            if h.faults:
                elements.append(Paragraph("Detected Faults & Recommendations", subtitle))
                elements.append(Spacer(1, 8))

                fault_rows = [["Component", "Issue", "Severity", "Action"]]
                for f in h.faults:
                    fault_rows.append(
                        [f.component, f.issue, f.severity, f.action]
                    )

                fault_table = Table(fault_rows, colWidths=[110, 170, 80, 140])
                fault_table.setStyle(
                    TableStyle(
                        [
                            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#222B3F")),
                            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                            ("TEXTCOLOR", (0, 1), (-1, -1), colors.white),
                            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                            ("FONTSIZE", (0, 0), (-1, -1), 9),
                            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#444B6A")),
                            ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ]
                    )
                )
                elements.append(fault_table)
                elements.append(Spacer(1, 16))
            else:
                elements.append(
                    Paragraph(
                        "No critical faults detected in the latest cycle. Continue routine monitoring.",
                        styles["Normal"],
                    )
                )
                elements.append(Spacer(1, 16))

        # QR code linking back to dashboard (for mechanics)
        qr = qrcode.make("http://localhost:5173")  # or your deployed frontend URL
        qr_buffer = io.BytesIO()
        qr.save(qr_buffer, format="PNG")
        qr_buffer.seek(0)
        qr_img = Image(qr_buffer, width=1.2 * inch, height=1.2 * inch)
        elements.append(Spacer(1, 10))
        elements.append(Paragraph("Scan for Live Dashboard View:", styles["Normal"]))
        elements.append(qr_img)

        # Footer-like note
        elements.append(Spacer(1, 10))
        elements.append(
            Paragraph(
                "This report is auto-generated by DriveGuard AI based on live telemetry and predictive models.",
                styles["Italic"],
            )
        )

        elements.append(PageBreak())

        # ---------- PAGE 2: TELEMETRY & RUL CHARTS ----------

        charts = payload.charts or ChartImages()

        elements.append(Paragraph("Telemetry & Degradation Analytics", title_style))
        elements.append(Spacer(1, 16))

        chart_width = 5.0 * inch  # all charts same width

        def add_chart_section(label: str, data_url: Optional[str]):
            img = _b64_to_image(data_url, width=chart_width)
            if not img:
                return
            elements.append(Paragraph(label, subtitle))
            elements.append(Spacer(1, 4))
            elements.append(img)
            elements.append(Spacer(1, 18))

        add_chart_section("Engine RPM Trend", charts.engine_rpm)
        add_chart_section("Engine Temperature Trend", charts.engine_temp)
        add_chart_section("Oil Pressure Behavior", charts.oil_pressure)
        add_chart_section("Battery Voltage Stability", charts.battery_voltage)
        add_chart_section("Vibration Levels", charts.vibration)
        add_chart_section("Remaining Useful Life (RUL) Trend", charts.rul_trend)
        add_chart_section("Fault Timeline", charts.fault_timeline)

        # If no charts at all, show a note instead
        if not any(
            [
                charts.engine_rpm,
                charts.engine_temp,
                charts.oil_pressure,
                charts.battery_voltage,
                charts.vibration,
                charts.rul_trend,
                charts.fault_timeline,
            ]
        ):
            elements.append(
                Paragraph(
                    "No chart snapshots were provided from the dashboard. "
                    "Please re-generate report after telemetry has streamed.",
                    styles["Normal"],
                )
            )

        # Build PDF
        doc.build(elements)
        buffer.seek(0)

        return Response(
            content=buffer.read(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{payload.vehicle_id}_driveguard_report.pdf"'
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
