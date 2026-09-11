# Calculation prompts for the Code & Calculation Agent demo
# Use these exact prompts in the UI InputBar during the live demo.

PROMPT_1 = """
Calculate the mass flow rate of crude oil through orifice plate FE-104 using the ISO 5167 standard.
Given:
- Pipe inner diameter (D): 254 mm
- Orifice bore diameter (d): 152.4 mm
- Differential pressure (ΔP): 28.5 kPa
- Fluid density (ρ): 860 kg/m³
- Discharge coefficient (Cd): 0.61

Print all intermediate values and the final mass flow rate in kg/s and tonnes/hr.
"""

PROMPT_2 = """
A centrifugal pump (P-102A) has the following nameplate data:
- Rated flow: 450 m³/hr
- Rated head: 180 m
- Fluid: Crude oil, SG = 0.86
- Pump efficiency: 78%
- Motor efficiency: 94%

Calculate:
1. Hydraulic power (kW)
2. Brake power at pump shaft (kW)
3. Motor input power (kW)
4. Annual electricity cost if tariff is ₹8.5/kWh and the pump runs 8400 hours/year

Print a clean formatted summary table.
"""

PROMPT_3 = """
Calculate the minimum required wall thickness of a carbon steel pipe (ASTM A106 Gr.B) carrying high-pressure steam using ASME B31.1 Power Piping Code formula:
- Design pressure: 42 kg/cm² (convert to MPa first)
- Design temperature: 399°C
- Outside diameter (OD): 219.1 mm (8-inch NPS Sch 80)
- Allowable stress (S) at 399°C for A106 Gr.B: 95.1 MPa
- Weld joint efficiency (E): 1.0
- Coefficient (y): 0.4
- Corrosion allowance: 1.5 mm

Print the calculated minimum thickness and compare to the actual Sch 80 wall thickness (12.70 mm).
"""
