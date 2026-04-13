import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime

# --- THE ULTIMATE "GIRLYPOP" TECH STACK (CSS) ---
st.set_page_config(page_title="HerCatalyst AI", page_icon="🌸", layout="wide")

st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Inter:wght@400;700&display=swap');
    
    .stApp { background: linear-gradient(135deg, #FFF5F7 0%, #FCE4EC 100%); }
    
    /* Premium Cards */
    .feature-card {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(20px);
        border-radius: 30px;
        padding: 35px;
        border: 1px solid rgba(216, 27, 96, 0.1);
        box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        margin-bottom: 25px;
    }
    
    /* Typography */
    h1 { font-family: 'Syncopate', sans-serif; color: #880E4F; text-transform: uppercase; letter-spacing: -2px; }
    p { font-family: 'Inter', sans-serif; color: #4A4A4A; }
    
    /* Buttons */
    .stButton>button {
        background: linear-gradient(90deg, #D81B60 0%, #C2185B 100%);
        color: white; border-radius: 50px; border: none;
        padding: 15px 40px; font-weight: 700; font-size: 18px;
        transition: 0.4s all; width: 100%;
    }
    .stButton>button:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(216, 27, 96, 0.3); }
    </style>
    """, unsafe_allow_html=True)

# --- THE DATA INTELLIGENCE (Using your 18k logs as the "Teacher") ---
@st.cache_data
def load_intelligence():
    # This is the "Learning" base. We use it to train our predictions.
    return pd.read_csv('Period_Log.csv')

logs_df = load_intelligence()

# --- PHASE 1: FRESH STUDENT ONBOARDING ---
if 'authenticated' not in st.session_state:
    st.markdown("<br><br>", unsafe_allow_html=True)
    c1, c2, c3 = st.columns([1, 2, 1])
    with c2:
        st.markdown("<div class='feature-card'>", unsafe_allow_html=True)
        st.title("HERCATALYST OS")
        st.write("#### 🌸 Initialize your Student AI Environment")
        name = st.text_input("Full Name", placeholder="e.g. Niamat Dhillon")
        major = st.text_input("Major", placeholder="e.g. B.Tech Computer Science")
        
        if st.button("START SESSION"):
            if name and major:
                st.session_state.authenticated = True
                st.session_state.name = name
                st.session_state.major = major
                st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)
    st.stop()

# --- PHASE 2: THE "LEARNING" DASHBOARD ---
st.sidebar.markdown(f"### 🎓 {st.session_state.name}")
st.sidebar.caption(f"Campus: {st.session_state.major}")
st.sidebar.divider()

# Input for the "Learning" loop
st.sidebar.subheader("Bio-Sync Inputs")
last_period = st.sidebar.date_input("Last Cycle Start")
daily_stress = st.sidebar.slider("Current Academic Load", 1, 10, 5)

# Logic: Phase Detection
days_since = (datetime.now().date() - last_period).days % 28
if days_since <= 5: phase, color = "Menstrual", "#EF5350"
elif days_since <= 13: phase, color = "Follicular", "#66BB6A"
elif days_since <= 17: phase, color = "Ovulation", "#FFA726"
else: phase, color = "Luteal", "#AB47BC"

# --- MAIN CONTENT ---
st.title("PERFORMANCE HUB")
st.write(f"Aligning **{st.session_state.major}** curriculum with your biological rhythm.")

col_left, col_right = st.columns([1, 1.3], gap="large")

with col_left:
    st.markdown(f"""
        <div class='feature-card' style='border-top: 10px solid {color};'>
            <h2 style='color: {color};'>CURRENT PHASE: {phase}</h2>
            <p>Our AI is analyzing 18,240 historical data points to optimize your focus today.</p>
        </div>
    """, unsafe_allow_html=True)
    
    # Dynamic Insight based on Phase + Dataset
    avg_phase_focus = logs_df[logs_df['cycle_phase'] == phase]['concentration_score'].mean()
    
    st.markdown("<div class='feature-card'>", unsafe_allow_html=True)
    st.subheader("AI Performance Prediction")
    # This is where the app "Learns" from the current student's stress
    personal_score = np.clip(avg_phase_focus - (daily_stress * 0.15), 1, 10)
    st.metric("Readiness Score", f"{personal_score:.2f}/10", delta=f"{personal_score - 5:.1f} vs Avg")
    st.markdown("</div>", unsafe_allow_html=True)

with col_right:
    st.markdown("<div class='feature-card'>", unsafe_allow_html=True)
    st.subheader("Community Benchmark Trends")
    # Interactive Graph
    trend_data = logs_df.groupby('cycle_phase')['concentration_score'].mean().reset_index()
    fig = px.line(trend_data, x='cycle_phase', y='concentration_score', 
                  title="Cognitive Fluctuations Across 18k Logs",
                  line_shape="spline", markers=True)
    fig.update_traces(line_color='#D81B60', line_width=4)
    fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
    st.plotly_chart(fig, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

# THE VERDICT CARD
st.markdown("<div class='feature-card'>", unsafe_allow_html=True)
st.subheader("🎯 Market-Driven Recommendation")
if phase == "Follicular":
    st.success("**PREDICTION:** High Estrogen levels are boosting neuroplasticity. This is your 'Power Mode' for complex coding or mathematical logic.")
elif phase == "Menstrual":
    st.error("**PREDICTION:** Physical inflammation is peaking. Switch to 'Passive Learning' (watching lectures, reviewing notes) to maintain progress without burnout.")
else:
    st.info("**PREDICTION:** Stable state detected. Great for collaborative projects and campus seminars.")
st.markdown("</div>", unsafe_allow_html=True)
