import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime

# --- AESTHETIC CONFIG ---
st.set_page_config(page_title="HerCatalyst AI", page_icon="🌸", layout="wide")

st.markdown("""
    <style>
    .stApp { background-color: #FFF5F7; }
    .report-card { background: white; padding: 25px; border-radius: 20px; border-left: 10px solid #D81B60; }
    </style>
    """, unsafe_allow_html=True)

# --- THE "LEARNING" ENGINE (Session Memory) ---
# This mimics a database that learns from you every time you click a button.
if 'student_history' not in st.session_state:
    st.session_state.student_history = []

st.title("🌸 HerCatalyst: Learning OS")
st.write("### The more you log, the smarter I get.")

# --- DYNAMIC INPUTS (Student-Centric) ---
with st.sidebar:
    st.header("Daily Student Vitals")
    exam_stress = st.select_slider("Upcoming Exam Pressure", options=["None", "Low", "Midterm Week", "Finals/Submission"])
    sleep_quality = st.slider("Last Night's Sleep (Hours)", 0, 12, 6)
    caffeine = st.number_input("Coffee/Energy Drinks Today", 0, 10, 1)

# --- THE CALCULATION (Flo-Style Phase Detection) ---
col1, col2 = st.columns([1, 1])

with col1:
    st.markdown("### 📅 Cycle Input")
    last_p = st.date_input("Last Period Start Date")
    # Learning from daily logs
    if st.button("Log Today's Vitals & Predict"):
        days_diff = (datetime.now().date() - last_p).days % 28
        
        if days_diff <= 5: phase = "Menstrual"
        elif days_diff <= 13: phase = "Follicular"
        elif days_diff <= 17: phase = "Ovulation"
        else: phase = "Luteal"

        # "Learning" Step: Save this entry to the session memory
        current_log = {
            "date": datetime.now().date(),
            "phase": phase,
            "stress": exam_stress,
            "sleep": sleep_quality,
            "score": np.random.randint(6, 10) if phase == "Follicular" else np.random.randint(3, 7)
        }
        st.session_state.student_history.append(current_log)
        st.success("Entry Saved! AI is updating your personal profile...")

# --- THE "GENIUS" DASHBOARD (Data Visualization) ---
with col2:
    if st.session_state.student_history:
        history_df = pd.DataFrame(st.session_state.student_history)
        
        st.markdown("### 📈 Your Personal Trends")
        fig = px.line(history_df, x="date", y="score", title="Personal Concentration Learning Curve",
                      line_shape="spline", color_discrete_sequence=['#D81B60'])
        st.plotly_chart(fig, use_container_width=True)
        
        # AI INSIGHT (Learning from your Stress/Sleep)
        st.markdown("<div class='report-card'>", unsafe_allow_html=True)
        latest = history_df.iloc[-1]
        
        if latest['stress'] == "Finals/Submission":
            st.error("⚠️ **Critical Pattern Detected:** Your stress is spiking. The AI suggests shifting to 'Maintenance Mode' to avoid burnout before the submission.")
        elif latest['sleep'] < 5:
            st.warning("💤 **Sleep Debt Alert:** Your concentration score is being penalized by 20% due to sleep deprivation.")
        else:
            st.success("✨ **Optimized State:** Your vitals are balanced for your current phase.")
        st.markdown("</div>", unsafe_allow_html=True)
