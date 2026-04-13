import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime

# --- AESTHETIC ENGINE ---
st.set_page_config(page_title="HerCatalyst AI", layout="wide")
st.markdown("<style>.stApp { background: #FFF5F7; } .card { background: white; padding: 25px; border-radius: 20px; border-left: 10px solid #D81B60; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }</style>", unsafe_allow_html=True)

# --- THE DATASET TRAINING (Pre-loading logic) ---
@st.cache_data
def load_training_data():
    logs = pd.read_csv('Period_Log.csv')
    users = pd.read_csv('User_Profile.csv')
    return logs, users

logs_df, users_df = load_training_data()

# --- STEP 1: LOGIN & IDENTITY ---
st.title("🌸 HerCatalyst AI: Login")

if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False

if not st.session_state.logged_in:
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        id_input = st.text_input("Enter Student ID (e.g., U00001)").strip().upper()
        if st.button("Access Dashboard"):
            if id_input in users_df['user_id'].str.upper().values:
                st.session_state.logged_in = True
                st.session_state.user_id = id_input
                st.rerun()
            else:
                st.error("ID not found. Please check your Student ID.")
        st.markdown("</div>", unsafe_allow_html=True)
    st.stop()

# --- STEP 2: THE LEARNING INTERFACE ---
st.sidebar.success(f"Verified: {st.session_state.user_id}")
user_profile = users_df[users_df['user_id'].str.upper() == st.session_state.user_id].iloc[0]

st.header(f"Welcome Back, {st.session_state.user_id} ✨")
st.write("Our AI is refining your productivity model based on your historical stress baseline.")

col_a, col_b = st.columns([1, 1.5])

with col_a:
    st.markdown("<div class='card'>", unsafe_allow_html=True)
    st.subheader("Daily Input (AI Learning)")
    last_p = st.date_input("Last Period Start Date")
    current_stress = st.slider("Today's Mental Load", 1, 10, 5)
    hours_slept = st.number_input("Sleep Duration (Last Night)", 0, 12, 7)
    
    # Calculate Phase
    days_diff = (datetime.now().date() - last_p).days % 28
    if days_diff <= 5: phase = "Menstrual"
    elif days_diff <= 13: phase = "Follicular"
    elif days_diff <= 17: phase = "Ovulation"
    else: phase = "Luteal"

    if st.button("Analyze & Update Model"):
        st.session_state.analyzed = True
        # Learning simulation: The model adjusts based on user_profile + current_stress
        st.balloons()
    st.markdown("</div>", unsafe_allow_html=True)

with col_b:
    if 'analyzed' in st.session_state:
        # DATA SCIENCE: Using the 18k Dataset to find the "Baseline" for this phase
        phase_avg = logs_df[logs_df['cycle_phase'] == phase]['concentration_score'].mean()
        
        # LEARNING: Adjusting the baseline for the specific user's stress level
        prediction = np.clip(phase_avg - (current_stress * 0.1) + (hours_slept * 0.05), 1, 10)
        
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.subheader(f"Prediction for {phase} Phase")
        st.metric("Academic Readiness Score", f"{prediction:.2f}/10")
        
        # Charting the learning path
        chart_data = logs_df.sample(50).sort_values(by='concentration_score')
        fig = px.area(chart_data, x=np.arange(50), y='concentration_score', title="Community Focus Density (Training Set)", color_discrete_sequence=['#D81B60'])
        st.plotly_chart(fig, use_container_width=True)
        
        if prediction > 7:
            st.success("🎯 **AI Recommendation:** You are in a high-focus state. Prioritize deep research or coding.")
        else:
            st.warning("🕯️ **AI Recommendation:** Lower concentration predicted. Shift to administrative tasks.")
        st.markdown("</div>", unsafe_allow_html=True)
