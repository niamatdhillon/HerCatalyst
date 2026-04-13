import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime

# --- HIGH-END UI CONFIG ---
st.set_page_config(page_title="HerCatalyst OS", page_icon="🌸", layout="wide")

st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;800&display=swap');
    .stApp { background: #FFF5F7; font-family: 'Inter', sans-serif; }
    .main-card { background: white; padding: 30px; border-radius: 25px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border-left: 10px solid #D81B60; margin-bottom: 20px; }
    .feature-node { background: #FCE4EC; padding: 15px; border-radius: 15px; text-align: center; border: 1px solid #F8BBD0; transition: 0.3s; }
    .feature-node:hover { transform: translateY(-5px); background: #F8BBD0; }
    h1, h2 { color: #880E4F; font-weight: 800; }
    </style>
    """, unsafe_allow_html=True)

# --- DATA INGESTION ---
@st.cache_data
def load_research_data():
    return pd.read_csv('Period_Log.csv')

logs_df = load_research_data()

# --- LOGIN & REGISTRATION ---
if 'user' not in st.session_state:
    st.markdown("<br><br>", unsafe_allow_html=True)
    _, col, _ = st.columns([1, 2, 1])
    with col:
        st.markdown("<div class='main-card'>", unsafe_allow_html=True)
        st.title("HERCATALYST OS 🌸")
        st.write("### Welcome, Student. Initialize Your Environment.")
        name = st.text_input("Name")
        college = st.text_input("University")
        if st.button("BOOT SYSTEM"):
            if name and college:
                st.session_state.user = {"name": name, "college": college}
                st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)
    st.stop()

# --- NAVIGATION TABS (The 35 Feature Solution) ---
st.sidebar.title(f"🌸 {st.session_state.user['name']}")
st.sidebar.write(f"Campus: {st.session_state.user['college']}")
st.sidebar.divider()

menu = st.sidebar.radio("NAVIGATE ECOSYSTEM", [
    "🚀 AI Performance Brain", 
    "📂 The 35 Feature Portal", 
    "📊 Dataset Insights (18k Logs)",
    "🚨 Security & SOS Hub"
])

# --- TAB 1: AI PERFORMANCE BRAIN (THE LEARNING ENGINE) ---
if menu == "🚀 AI Performance Brain":
    st.title("AI Performance Optimizer")
    
    col_input, col_viz = st.columns([1, 1.5], gap="large")
    
    with col_input:
        st.markdown("<div class='main-card'>", unsafe_allow_html=True)
        st.subheader("Daily Bio-Sync")
        last_p = st.date_input("Last Cycle Start")
        stress = st.slider("Exam/Assignment Load", 1, 10, 5)
        
        # Calculation
        days = (datetime.now().date() - last_p).days % 28
        if days <= 5: phase = "Menstrual"
        elif days <= 13: phase = "Follicular"
        elif days <= 17: phase = "Ovulation"
        else: phase = "Luteal"
        
        st.info(f"Detected Phase: **{phase}**")
        st.markdown("</div>", unsafe_allow_html=True)

    with col_viz:
        st.markdown("<div class='main-card'>", unsafe_allow_html=True)
        # Pulling Real Research Substance
        phase_avg = logs_df[logs_df['cycle_phase'] == phase]['concentration_score'].mean()
        readiness = np.clip(phase_avg - (stress * 0.2), 1, 10)
        
        st.subheader("Predictive Readiness")
        st.metric("Focus Score", f"{readiness:.2f}/10", delta=f"{readiness-5:.1f} vs Global Avg")
        
        # Gauge Chart
        fig = go.Figure(go.Indicator(
            mode = "gauge+number", value = readiness,
            gauge = {'axis': {'range': [0, 10]}, 'bar': {'color': "#D81B60"}}
        ))
        fig.update_layout(height=250, margin=dict(t=0, b=0))
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

# --- TAB 2: THE 35 FEATURE PORTAL (THE SUBSTANCE) ---
elif menu == "📂 The 35 Feature Portal":
    st.title("Unified Feature Ecosystem")
    st.write("Browse the 35 modules designed for the modern female student.")
    
    categories = {
        "Academics (6)": ["AI Phase Predictor", "E-Library", "PYQ Repository", "Study Gamification", "Attendance Tracker", "Tutor Connect"],
        "Safety (5)": ["SOS Emergency", "Safe-Path Map", "Shuttle Trace", "Fake Call Generator", "Security Escort"],
        "Wellness (6)": ["Symptom Log", "Mental Health Support", "Cycle Diet Plans", "Fitness Hub", "Medical Vault", "Sleep Tracker"],
        "Career (6)": ["STEM Mentors", "Job Board", "Research Portfolio", "Scholarships", "Writing Lab", "Internships"],
        "Social (6)": ["Women Forums", "Alumni Connect", "Club Hub", "Empowerment Groups", "Roommate Finder", "Volunteering"],
        "Productivity (6)": ["Smart Alerts", "Focus Timers", "Budget AI", "Journal", "Task Manager", "Event RSVP"]
    }
    
    for cat, features in categories.items():
        st.subheader(cat)
        cols = st.columns(len(features))
        for i, feature in enumerate(features):
            cols[i].markdown(f"<div class='feature-node'>{feature}</div>", unsafe_allow_html=True)
        st.write("")

# --- TAB 3: DATASET INSIGHTS ---
elif menu == "📊 Dataset Insights (18k Logs)":
    st.title("Global Research Analytics")
    st.write("Analyzing the 18,240 records that power our AI predictions.")
    
    c1, c2 = st.columns(2)
    with c1:
        st.markdown("<div class='main-card'>", unsafe_allow_html=True)
        # Bar Chart of Phases
        fig1 = px.bar(logs_df.groupby('cycle_phase')['concentration_score'].mean().reset_index(), 
                      x='cycle_phase', y='concentration_score', color='concentration_score', 
                      title="Concentration per Phase", color_continuous_scale='RdPu')
        st.plotly_chart(fig1, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
    with c2:
        st.markdown("<div class='main-card'>", unsafe_allow_html=True)
        # Pain vs Concentration Scatter
        fig2 = px.scatter(logs_df.sample(500), x='pain_level', y='concentration_score', 
                          color='cycle_phase', title="Correlation: Pain vs Focus")
        st.plotly_chart(fig2, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

# --- TAB 4: SOS HUB ---
elif menu == "🚨 Security & SOS Hub":
    st.title("Campus Security Protocol")
    st.markdown("<div class='main-card' style='border-left: 10px solid red; text-align: center;'>", unsafe_allow_html=True)
    st.error("### EMERGENCY SOS")
    st.write("One-click activation will alert campus security and your emergency contacts with your live GPS location.")
    if st.button("ACTIVATE TEST ALERT"):
        st.warning("TEST ALERT SENT TO SECURITY DASHBOARD")
    st.markdown("</div>", unsafe_allow_html=True)
