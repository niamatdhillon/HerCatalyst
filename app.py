import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime

# --- BRANDING & GLASSMORPHISM ---
st.set_page_config(page_title="HerCatalyst: Student OS", layout="wide")
st.markdown("""
    <style>
    .stApp { background: #FFF5F7; }
    .card { background: white; padding: 30px; border-radius: 25px; border-left: 10px solid #D81B60; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    h1 { color: #880E4F; font-weight: 800; letter-spacing: -1px; }
    </style>
    """, unsafe_allow_html=True)

# --- THE REFERENCE ENGINE (Dataset used only for Training) ---
@st.cache_data
def load_training_set():
    # We use this ONLY to understand general trends (The "AI" part)
    return pd.read_csv('Period_Log.csv')

logs_df = load_training_set()

# --- STEP 1: FRESH STUDENT REGISTRATION ---
if 'student_name' not in st.session_state:
    st.title("Welcome to HerCatalyst 🌸")
    st.write("### Create your Student Profile to begin.")
    
    col1, _ = st.columns([1, 1])
    with col1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        name = st.text_input("Full Name")
        college = st.text_input("University / Campus")
        course = st.text_input("Course of Study (e.g. B.Tech Computer Science)")
        
        if st.button("Initialize Student OS"):
            if name and college:
                st.session_state.student_name = name
                st.session_state.college = college
                st.session_state.course = course
                st.rerun()
            else:
                st.error("Please fill in your details to set up the environment.")
        st.markdown("</div>", unsafe_allow_html=True)
    st.stop()

# --- STEP 2: THE PERSONALIZED DASHBOARD ---
st.sidebar.title("🎓 Student Portal")
st.sidebar.write(f"**Student:** {st.session_state.student_name}")
st.sidebar.write(f"**Campus:** {st.session_state.college}")
st.sidebar.caption(st.session_state.course)

st.title(f"Catalyst Dashboard for {st.session_state.student_name.split()[0]} ✨")

col_left, col_right = st.columns([1, 1.5], gap="large")

with col_left:
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.subheader("🧬 Daily Bio-Sync")
    last_p = st.date_input("Last Period Start Date")
    stress = st.select_slider("Academic Pressure Level", options=["Low", "Moderate", "High", "Critical (Finals)"])
    
    # Calculate Phase
    days_diff = (datetime.now().date() - last_p).days % 28
    if days_diff <= 5: phase = "Menstrual"
    elif days_diff <= 13: phase = "Follicular"
    elif days_diff <= 17: phase = "Ovulation"
    else: phase = "Luteal"
    
    st.info(f"**Detected Phase:** {phase}")
    
    if st.button("Generate Performance Forecast"):
        st.session_state.ready = True
    st.markdown("</div>", unsafe_allow_html=True)

with col_right:
    if 'ready' in st.session_state:
        # DATA SCIENCE: Compare current student to the 18,000 log training set
        phase_benchmark = logs_df[logs_df['cycle_phase'] == phase]['concentration_score'].mean()
        
        # Adjust based on Student's self-reported stress
        stress_map = {"Low": 0, "Moderate": 0.5, "High": 1.2, "Critical (Finals)": 2.0}
        final_score = np.clip(phase_benchmark - stress_map[stress], 1, 10)
        
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.subheader("AI Academic Prediction")
        
        # High-End Visualization
        st.metric("Focus Potential", f"{final_score:.1f}/10", delta=f"{final_score - 5:.1f} vs Avg")
        
        # Plotting the "Learning" trend
        st.markdown("#### Community Benchmark vs Your State")
        fig = px.bar(logs_df.groupby('cycle_phase')['concentration_score'].mean().reset_index(), 
                     x='cycle_phase', y='concentration_score', color_discrete_sequence=['#D81B60'])
        st.plotly_chart(fig, use_container_width=True)
        
        # Market-Ready Verdict
        if final_score > 7:
            st.success("🚀 **Verdict:** Your biology is currently optimized for deep work. Tackle your hardest modules today.")
        else:
            st.warning("🕯️ **Verdict:** Cognitive load management required. Stick to routine tasks and revision.")
        st.markdown("</div>", unsafe_allow_html=True)
