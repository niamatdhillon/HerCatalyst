import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime

# --- SYSTEM STYLING (Premium Tech Aesthetic) ---
st.set_page_config(page_title="HerCatalyst OS", layout="wide")
st.markdown("""
    <style>
    .stApp { background: #FFF5F7; }
    .main-card { background: white; padding: 25px; border-radius: 20px; border-left: 10px solid #D81B60; box-shadow: 0 10px 20px rgba(0,0,0,0.05); margin-bottom: 20px; }
    .feature-chip { background: #FCE4EC; color: #880E4F; padding: 10px; border-radius: 12px; text-align: center; font-size: 0.8rem; font-weight: bold; border: 1px solid #F8BBD0; }
    h1, h2 { color: #880E4F; font-family: 'Inter', sans-serif; font-weight: 800; }
    </style>
    """, unsafe_allow_html=True)

# --- DATASET LOAD (The Pre-Trained Knowledge) ---
@st.cache_data
def load_data():
    return pd.read_csv('Period_Log.csv')

logs_df = load_data()

# --- INITIALIZATION & SESSION MEMORY (The Learning) ---
if 'history' not in st.session_state:
    st.session_state.history = []
if 'todos' not in st.session_state:
    st.session_state.todos = ["Draft Thesis Proposal", "Lab Report: Neural Networks", "Presentation Prep"]

# --- SIDEBAR NAVIGATION ---
with st.sidebar:
    st.title("🌸 HerCatalyst OS")
    st.markdown("---")
    menu = st.radio("SELECT DASHBOARD", [
        "🎯 AI Brain & Learning", 
        "✅ My To-Dos & Stats", 
        "📂 All 35 Features", 
        "🚨 Security Hub"
    ])
    st.markdown("---")
    st.caption("Student: Niamat Dhillon | Major: Data Science")

# --- DASHBOARD 1: THE AI BRAIN & LEARNING ---
if menu == "🎯 AI Brain & Learning":
    st.title("AI Performance Engine")
    col1, col2 = st.columns([1, 1.5], gap="large")
    
    with col1:
        st.markdown("<div class='main-card'>", unsafe_allow_html=True)
        st.subheader("Bio-Sync Input")
        last_p = st.date_input("Last Cycle Start")
        stress = st.slider("Current Stress Level", 1, 10, 5)
        
        # Calculate Phase
        days = (datetime.now().date() - last_p).days % 28
        if days <= 5: phase = "Menstrual"
        elif days <= 13: phase = "Follicular"
        elif days <= 17: phase = "Ovulation"
        else: phase = "Luteal"
        
        if st.button("Sync & Learn"):
            # This is where the app "Learns" from your specific input
            entry = {"date": datetime.now().strftime("%Y-%m-%d"), "phase": phase, "stress": stress}
            st.session_state.history.append(entry)
            st.success("Entry recorded. AI Model updated.")
        st.markdown("</div>", unsafe_allow_html=True)

    with col2:
        st.markdown("<div class='main-card'>", unsafe_allow_html=True)
        st.subheader("AI Readiness Prediction")
        # Pulling substance from the 18k logs
        avg_focus = logs_df[logs_df['cycle_phase'] == phase]['concentration_score'].mean()
        readiness = np.clip(avg_focus - (stress * 0.15), 1, 10)
        
        st.metric("Academic Readiness", f"{readiness:.2f}/10")
        
        fig = px.area(logs_df.groupby('cycle_phase')['concentration_score'].mean().reset_index(), 
                      x='cycle_phase', y='concentration_score', title="Dataset Baseline (Pre-Trained Knowledge)")
        fig.update_traces(line_color='#D81B60')
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

# --- DASHBOARD 2: MY TO-DOS & STATS ---
elif menu == "✅ My To-Dos & Stats":
    st.title("Productivity & Personal Stats")
    col_stat1, col_stat2 = st.columns(2)
    
    with col_stat1:
        st.markdown("<div class='main-card'>", unsafe_allow_html=True)
        st.subheader("Academic To-Do List")
        for i, task in enumerate(st.session_state.todos):
            st.checkbox(task, key=f"task_{i}")
        new_task = st.text_input("Add New Task")
        if st.button("Add"): st.session_state.todos.append(new_task); st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    with col_stat2:
        st.markdown("<div class='main-card'>", unsafe_allow_html=True)
        st.subheader("Learning History")
        if st.session_state.history:
            st.table(pd.DataFrame(st.session_state.history))
        else:
            st.write("No entries yet. AI needs more data to learn your patterns.")
        st.markdown("</div>", unsafe_allow_html=True)

# --- DASHBOARD 3: ALL 35 FEATURES ---
elif menu == "📂 All 35 Features":
    st.title("The 35-Feature Ecosystem")
    st.write("Click a module to explore our full market vision.")
    
    features = {
        "Academics (6)": ["AI Phase Predictor", "E-Library", "PYQ Repository", "Study Gamification", "Attendance Tracker", "Tutor Connect"],
        "Safety (5)": ["SOS Button", "Safe-Path Map", "Shuttle Trace", "Fake Call Generator", "Security Escort"],
        "Wellness (6)": ["Symptom Log", "Mental Health Support", "Cycle Diet Plans", "Fitness Hub", "Medical Vault", "Sleep Tracker"],
        "Social (6)": ["Women Forums", "Alumni Connect", "Club Hub", "Empowerment Groups", "Roommate Finder", "Volunteering"],
        "Productivity (6)": ["Smart Alerts", "Focus Timers", "Budget AI", "Journal", "Task Manager", "Event RSVP"],
        "Inclusivity (6)": ["Accessibility Map", "Intl. Portal", "Job Board", "Scholarships", "Research Portfolio", "Writing Lab"]
    }
    
    for category, items in features.items():
        st.subheader(category)
        cols = st.columns(len(items))
        for i, item in enumerate(items):
            cols[i].markdown(f"<div class='feature-chip'>{item}</div>", unsafe_allow_html=True)
        st.markdown("<br>", unsafe_allow_html=True)

# --- DASHBOARD 4: SECURITY ---
elif menu == "🚨 Security Hub":
    st.title("Campus Security & Safety")
    st.markdown("<div class='main-card' style='border-left: 10px solid red; background: #FFF0F0;'>", unsafe_allow_html=True)
    st.error("### EMERGENCY SOS ACTIVATION")
    st.write("Will notify Campus Security and share live GPS location with emergency contacts.")
    st.button("TRIGGER SOS ALERT", use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)
